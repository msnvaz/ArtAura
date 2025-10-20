import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Post from "../components/community/Posts";
import ExhibitionPost from "../components/community/ExhibitionPost";
import TopArtists from "../components/community/TopArtists";
import ExhibitionPostForm from "../components/community/ExhibitionPostForm";
import RecentChallenges from "../components/community/RecentChallenges";
import CartSidebar from "../components/cart/CartSidebar";
import { Filter, Calendar, Image, Users, Home, ArrowLeft } from "lucide-react";
import { formatDistanceToNow, isValid } from "date-fns";

const API_URL = import.meta.env.VITE_API_URL;

const CommunityPage = () => {
  const { role, userId, token } = useAuth(); // Get user role and ID from auth context
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [exhibitionPosts, setExhibitionPosts] = useState([]);
  const [activeFilter, setActiveFilter] = useState("feed");
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState({ name: "", avatar: "" });

  // Helper function to safely format time distance
  const safeFormatDistanceToNow = (date) => {
    if (!date) return "Unknown time";

    let d;
    if (typeof date === "string") {
      d = new Date(date);
      if (!isValid(d)) {
        const timestamp = parseInt(date);
        if (!isNaN(timestamp)) {
          d = new Date(timestamp);
        }
      }
    } else if (typeof date === "number") {
      d = new Date(date);
    } else {
      d = new Date(date);
    }

    if (!isValid(d)) {
      console.warn("Invalid date provided to safeFormatDistanceToNow:", date);
      return "Unknown time";
    }

    return formatDistanceToNow(d, { addSuffix: true });
  };

  useEffect(() => {
    const fetchExhibitionPosts = async () => {
      setLoading(true);
      try {
        // Direct fetch using VITE_API_URL
        const response = await fetch(`${API_URL}/api/buyer/exhibitions/all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setExhibitionPosts(data || []);
      } catch (error) {
        setExhibitionPosts([]);
        console.error("Error fetching exhibition posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExhibitionPosts();
  }, []);

  useEffect(() => {
    const fetchArtistPosts = async () => {
      setLoading(true);
      try {
        // Direct fetch using VITE_API_URL
        const response = await fetch(`${API_URL}/api/aposts/all`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setPosts(data || []);
      } catch (error) {
        setPosts([]);
        console.error("Error fetching artist posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistPosts();
  }, []);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  // Only show verified exhibition posts in the feed
  const verifiedExhibitionPosts = exhibitionPosts.filter(
    (post) =>
      post.status === "verified" || post.verification_status === "verified"
  );

  // Combine and filter posts with proper chronological sorting
  const getAllPosts = () => {
    // Add type identifier to regular posts if not present
    const regularPostsWithType = posts.map((post) => ({
      ...post,
      type: "regular",
      // Ensure consistent date field
      sortDate: new Date(post.createdAt || post.created_at || Date.now()),
    }));

    // Add type identifier to exhibition posts and filter verified ones
    const exhibitionPostsWithType = verifiedExhibitionPosts.map((post) => ({
      ...post,
      type: "exhibition",
      // Ensure consistent date field
      sortDate: new Date(post.createdAt || post.created_at || Date.now()),
    }));

    // Combine all posts and sort by creation date (latest first)
    const allCombinedPosts = [
      ...regularPostsWithType,
      ...exhibitionPostsWithType,
    ];

    return allCombinedPosts.sort((a, b) => {
      return b.sortDate - a.sortDate; // Latest posts first
    });
  };

  const getFilteredPosts = () => {
    const allPosts = getAllPosts();
    if (activeFilter === "feed") return allPosts; // Feed shows all posts like buyer's home page
    if (activeFilter === "all") return allPosts;
    if (activeFilter === "regular") {
      return allPosts.filter((post) => post.type === "regular");
    }
    if (activeFilter === "exhibition") {
      return allPosts.filter(
        (post) => post.type === "exhibition" || post.category
      );
    }
    return allPosts;
  };

  const safeImageSrc = (src) => {
    return src && src.trim() !== "" ? src : null;
  }; // Helper function to prevent empty src

  // Helper function to get correct avatar path for both artists and buyers
  const getAvatarPath = (avatarUrl, userType = "artist") => {
    if (!avatarUrl) {
      // Return appropriate default avatar based on user type
      return userType === "buyer"
        ? "/uploads/buyer/default-buyer-avatar.svg"
        : "/uploads/profiles/default-avatar.svg";
    }

    // If it's already a full URL or starts with /, return as is
    if (avatarUrl.startsWith("http") || avatarUrl.startsWith("/")) {
      return avatarUrl;
    }

    // If it's a relative path, determine the correct directory
    if (userType === "buyer") {
      // For buyers, check if path already includes buyer directory
      if (avatarUrl.includes("buyer/")) {
        return `/${avatarUrl}`;
      }
      return `/uploads/buyer/${avatarUrl}`;
    } else {
      // For artists, check if path already includes profiles directory
      if (avatarUrl.includes("profiles/")) {
        return `/${avatarUrl}`;
      }
      return `/uploads/profiles/${avatarUrl}`;
    }
  };

  const handleImageError = (e) => {
    e.target.alt = "Image not available"; // Set alt attribute to default text
  };

  const renderPostImage = (imageSrc, altText) => (
    <img
      src={imageSrc}
      alt={altText}
      onError={handleImageError} // Use handleImageError for error handling
    />
  );

  const renderPost = (post) => (
    <div key={post.postId} className="post">
      <img src={post.image} alt="Post image" onError={handleImageError} />
      <div className="post-details">
        <h3>{post.caption}</h3>
        <p>Location: {post.location}</p>
        <p>Likes: {post.likes}</p>
        <div className="artist-details">
          <img
            src={post.artistAvatar}
            alt="Artist avatar"
            onError={handleImageError}
          />
          <p>Artist: {post.artistName}</p>
        </div>
      </div>
    </div>
  );

  const handleLike = (postId) => {
    console.log(`Liked post with ID: ${postId}`);
  };

  const filteredPosts = getFilteredPosts();

  // Simplified layout for artists
  if (role === "artist") {
    return (
      <div className="min-h-screen bg-[#FFF5E1] overflow-x-hidden">
        {/* Simple Header for Artists */}
        <div className="bg-white shadow-sm border-b border-[#fdf9f4]/40 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              onClick={() => navigate('/artist/artistportfolio')}
              className="flex items-center space-x-2 text-[#7f5539] hover:text-[#6e4c34] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Portfolio</span>
            </button>
            <h1 className="text-2xl font-bold text-[#7f5539]">Community Feed</h1>
            <div></div> {/* Spacer for center alignment */}
          </div>
        </div>

        {/* Main Feed - Simplified for Artists */}
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Posts Feed */}
          <div className="space-y-6">
            {loading ? (
              <div className="text-center text-[#7f5539]/60 py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7f5539] mx-auto mb-4"></div>
                Loading posts...
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center text-[#7f5539]/60 py-20">
                <div className="mb-4">
                  <Filter className="w-16 h-16 mx-auto text-[#7f5539]/30" />
                </div>
                <h3 className="text-xl font-semibold text-[#7f5539] mb-2">
                  No posts found
                </h3>
                <p>No posts to display yet.</p>
              </div>
            ) : (
              filteredPosts.map((post, index) => {
                console.log("Rendering post:", post);
                if (post.type === "exhibition" || post.category) {
                  return (
                    <ExhibitionPost
                      key={post.id || post.postId || `exh-${index}`}
                      post_id={post.id || post.postId}
                      title={post.title}
                      description={post.description}
                      location={post.location}
                      startDate={post.startDate}
                      endDate={post.endDate}
                      startTime={post.startTime}
                      endTime={post.endTime}
                      organizer={post.organizer}
                      category={post.category}
                      entryFee={post.entryFee}
                      maxParticipants={post.maxParticipants}
                      contactEmail={post.contactEmail}
                      contactPhone={post.contactPhone}
                      requirements={post.requirements}
                      created_at={post.createdAt || post.created_at}
                      likes={post.likes || 0}
                      comments={post.comments || 0}
                      artist={{
                        name: post.creatorName || "Unknown User",
                        avatar: getAvatarPath(post.creatorAvatar, "buyer"),
                      }}
                    />
                  );
                } else {
                  return (
                    <Post
                      key={post.post_id || `post-${index}`}
                      username={post.artistName || "Unknown Artist"}
                      avatar={getAvatarPath(post.artistAvatar)}
                      timeAgo={safeFormatDistanceToNow(post.createdAt)}
                      image={post.image.replace(/\[|\]|"/g, "")}
                      likes={post.likes || 0}
                      caption={post.caption}
                      postId={post.postId}
                    />
                  );
                }
              })
            )}
          </div>
        </div>
      </div>
    );
  }

  // Regular layout for buyers and other users
  return (
    <div className="min-h-screen bg-[#FFF5E1] overflow-x-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Cart Sidebar */}
      <CartSidebar />

      {/* Main Container */}
      <div className="flex justify-center pt-24 pb-10 min-h-screen">
        <div className="flex w-full max-w-7xl px-4">
          {/* Left Sidebar - Not fixed, scrolls with page */}
          <aside className="hidden lg:block w-80 mr-6">
            <RecentChallenges />
          </aside>

          {/* Center Feed - Not scrollable, grows with content */}
          <main className="flex-1 max-w-2xl mx-auto">
            {/* Exhibition Post Form - Only for Buyers */}
            {role === "buyer" && (
              <ExhibitionPostForm
                exhibitionPosts={exhibitionPosts}
                setExhibitionPosts={setExhibitionPosts}
              />
            )}

            {/* Filter Buttons - New Section */}
            <div className="flex space-x-3 mb-6">
              <button
                onClick={() => handleFilterChange("feed")}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center ${activeFilter === "feed"
                    ? "bg-[#7f5539] text-white shadow-md"
                    : "bg-white text-[#7f5539]"
                  }`}
              >
                <Home className="w-5 h-5 mr-2" />
                Feed
              </button>
              <button
                onClick={() => handleFilterChange("all")}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center ${activeFilter === "all"
                    ? "bg-[#7f5539] text-white shadow-md"
                    : "bg-white text-[#7f5539]"
                  }`}
              >
                <Users className="w-5 h-5 mr-2" />
                All
              </button>
              <button
                onClick={() => handleFilterChange("regular")}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center ${activeFilter === "regular"
                    ? "bg-[#7f5539] text-white shadow-md"
                    : "bg-white text-[#7f5539]"
                  }`}
              >
                <Image className="w-5 h-5 mr-2" />
                Posts
              </button>
              <button
                onClick={() => handleFilterChange("exhibition")}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center ${activeFilter === "exhibition"
                    ? "bg-[#7f5539] text-white shadow-md"
                    : "bg-white text-[#7f5539]"
                  }`}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Exhibitions
              </button>
            </div>

            {/* Posts Feed */}
            <div className="space-y-6">
              {loading ? (
                <div className="text-center text-[#7f5539]/60 py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7f5539] mx-auto mb-4"></div>
                  Loading posts...
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center text-[#7f5539]/60 py-20">
                  <div className="mb-4">
                    <Filter className="w-16 h-16 mx-auto text-[#7f5539]/30" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#7f5539] mb-2">
                    No posts found
                  </h3>
                  <p>
                    {activeFilter === "feed" || activeFilter === "all"
                      ? "No posts to display yet."
                      : `No ${activeFilter} posts to display yet.`}
                  </p>
                </div>
              ) : (
                filteredPosts.map((post, index) => {
                  console.log("Rendering post:", post);
                  if (post.type === "exhibition" || post.category) {
                    return (
                      <ExhibitionPost
                        key={post.id || post.postId || `exh-${index}`}
                        post_id={post.id || post.postId}
                        title={post.title}
                        description={post.description}
                        location={post.location}
                        startDate={post.startDate}
                        endDate={post.endDate}
                        startTime={post.startTime}
                        endTime={post.endTime}
                        organizer={post.organizer}
                        category={post.category}
                        entryFee={post.entryFee}
                        maxParticipants={post.maxParticipants}
                        contactEmail={post.contactEmail}
                        contactPhone={post.contactPhone}
                        requirements={post.requirements}
                        created_at={post.createdAt || post.created_at}
                        likes={post.likes || 0}
                        comments={post.comments || 0}
                        artist={{
                          name: post.creatorName || "Unknown User",
                          avatar: getAvatarPath(post.creatorAvatar, "buyer"), // Use creatorAvatar from backend response
                        }}
                      />
                    );
                  } else {
                    return (
                      <Post
                        key={post.post_id || `post-${index}`}
                        username={post.artistName || "Unknown Artist"}
                        avatar={getAvatarPath(post.artistAvatar)}
                        timeAgo={safeFormatDistanceToNow(post.createdAt)}
                        image={post.image.replace(/\[|\]|"/g, "")}
                        likes={post.likes || 0}
                        caption={post.caption}
                        postId={post.postId}
                      />
                    );
                  }
                })
              )}
            </div>
          </main>

          {/* Right Sidebar - Not fixed, scrolls with page */}
          <aside className="hidden lg:block w-80 ml-6">
            <TopArtists />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
