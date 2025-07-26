import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/common/Navbar";
import Post from "../components/community/Posts";
import ExhibitionPost from "../components/community/ExhibitionPost";
import TopArtists from "../components/community/TopArtists";
import ExhibitionPostForm from "../components/community/ExhibitionPostForm";
import RecentChallenges from "../components/community/RecentChallenges";
import CartSidebar from "../components/cart/CartSidebar";
import { Filter, Calendar, Image, Users } from "lucide-react";
import { formatDistanceToNow, isValid } from "date-fns";

const API_URL = import.meta.env.VITE_API_URL;

const CommunityPage = () => {
  const { role, userId, token } = useAuth(); // Get user role and ID from auth context
  const [posts, setPosts] = useState([]);
  const [exhibitionPosts, setExhibitionPosts] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
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

  // Mock regular posts
  const mockRegularPosts = [
    {
      post_id: 1,
      type: "regular",
      artist: {
        name: "Nimali Perera",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      },
      caption: "My latest Sri Lankan style painting! 🇱🇰🎨✨",
      image: "/art1.jpeg", // public image
      created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
      likes: 34,
      comments: 5,
    },
    {
      post_id: 2,
      type: "regular",
      artist: {
        name: "Kasun Fernando",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      },
      caption: "My new clay sculpture!",
      image: "/art2.jpeg", // public image
      created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
      likes: 21,
      comments: 2,
    },
    {
      post_id: 3,
      type: "regular",
      artist: {
        name: "Amaya Jayasinghe",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      },
      caption: "Throwback to my first exhibition! 🇱🇰 #tbt",
      image: "/art3.jpeg", // public image
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      likes: 47,
      comments: 8,
    },
  ];

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

    // For demo, keep regular posts as mock
    setPosts(mockRegularPosts);
    fetchExhibitionPosts();
  }, []);

  useEffect(() => {
    // Fetch user profile and save to localStorage
    if (!userId || !token) return;
    fetch(`${API_URL}/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const profile = {
          name:
            data.name ||
            `${data.firstName || ""} ${data.lastName || ""}`.trim() ||
            "Unknown User",
          avatar: data.avatar || data.avatarUrl || "",
        };
        setUserProfile(profile);
        localStorage.setItem("profile_name", profile.name);
        localStorage.setItem("profile_avatar", profile.avatar);
      })
      .catch(() => {
        setUserProfile({ name: "Unknown User", avatar: "" });
        localStorage.setItem("profile_name", "Unknown User");
        localStorage.setItem("profile_avatar", "");
      });
  }, [userId, token]);

  // Artist posts backend logic commented out
  // useEffect(() => {
  //   const fetchArtistPosts = async () => {
  //     // Backend logic for artist posts
  //   };
  //   fetchArtistPosts();
  // }, []);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  // Only show verified exhibition posts in the feed
  const verifiedExhibitionPosts = exhibitionPosts.filter(
    (post) =>
      post.status === "verified" || post.verification_status === "verified"
  );

  // Combine and filter posts
  const getAllPosts = () => {
    // Ensure exhibitionPosts are sorted by created_at DESC
    const sortedExhibitionPosts = [...verifiedExhibitionPosts].sort(
      (a, b) =>
        new Date(b.createdAt || b.created_at) -
        new Date(a.createdAt || a.created_at)
    );
    // Ensure regular posts are sorted by created_at DESC
    const sortedRegularPosts = [...posts].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    // Exhibition posts should appear first, then regular posts
    return [...sortedExhibitionPosts, ...sortedRegularPosts];
  };

  const getFilteredPosts = () => {
    const allPosts = getAllPosts();
    if (activeFilter === "all") return allPosts;
    return allPosts.filter((post) => post.type === activeFilter);
  };

  const filteredPosts = getFilteredPosts();

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

            {/* Info Message for Artists */}
            {role === "artist" && (
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-blue-800 font-semibold text-sm">
                      Exhibition Posts
                    </h3>
                    <p className="text-blue-600 text-sm">
                      Exhibition announcements are created by art buyers and
                      galleries. You can view and engage with exhibition posts
                      in your feed.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Filter Buttons - New Section */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => handleFilterChange("all")}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center ${
                  activeFilter === "all"
                    ? "bg-[#7f5539] text-white shadow-md"
                    : "bg-white text-[#7f5539]"
                }`}
              >
                <Users className="w-5 h-5 mr-2" />
                All
              </button>
              <button
                onClick={() => handleFilterChange("regular")}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center ${
                  activeFilter === "regular"
                    ? "bg-[#7f5539] text-white shadow-md"
                    : "bg-white text-[#7f5539]"
                }`}
              >
                <Image className="w-5 h-5 mr-2" />
                Posts
              </button>
              <button
                onClick={() => handleFilterChange("exhibition")}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center ${
                  activeFilter === "exhibition"
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
                    {activeFilter === "all"
                      ? "No posts to display yet."
                      : `No ${activeFilter} posts to display yet.`}
                  </p>
                </div>
              ) : (
                filteredPosts.map((post, index) => {
                  if (post.type === "exhibition" || post.category) {
                    // Use a unique key for each exhibition post
                    return (
                      <ExhibitionPost
                        key={post.id ? `exh-${post.id}` : `exh-${index}`}
                        post_id={post.id || post.post_id}
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
                          avatar: "", // You can extend backend to return avatar if needed
                        }}
                      />
                    );
                  } else {
                    const artistName =
                      post.artist && post.artist.name
                        ? post.artist.name
                        : "Unknown Artist";
                    const artistAvatar =
                      post.artist && post.artist.avatar
                        ? post.artist.avatar
                        : "";
                    // return (
                    //   <Post
                    //     key={`reg-${post.post_id}-${index}`}
                    //     username={artistName}
                    //     avatar={artistAvatar}
                    //     timeAgo={safeFormatDistanceToNow(post.created_at)}
                    //     image={`http://localhost:8081${post.image}`}
                    //     likes={post.likes}
                    //     caption={post.caption}
                    //   />
                    // );
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
