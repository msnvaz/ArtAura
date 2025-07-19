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
import axios from "axios";

const CommunityPage = () => {
  const { role } = useAuth(); // Get user role from auth context
  const [posts, setPosts] = useState([]);
  const [exhibitionPosts, setExhibitionPosts] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Mock regular posts
  const mockRegularPosts = [
    {
      post_id: 1,
      type: "regular",
      artist: {
        name: "Sarah Martinez",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      },
      caption: "Excited to share my latest digital artwork! 🎨✨",
      image:
        "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=600",
      created_at: "2025-07-15T10:30:00Z",
      likes: 34,
      comments: 5,
    },
    {
      post_id: 2,
      type: "regular",
      artist: {
        name: "Liam Chen",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      },
      caption: "My new sculpture is finally done! Thoughts?",
      image:
        "https://images.pexels.com/photos/1053924/pexels-photo-1053924.jpeg?auto=compress&cs=tinysrgb&w=600",
      created_at: "2025-07-16T14:20:00Z",
      likes: 21,
      comments: 2,
    },
    {
      post_id: 3,
      type: "regular",
      artist: {
        name: "Ava Patel",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      },
      caption: "Throwback to my first exhibition! #tbt",
      image:
        "https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg?auto=compress&cs=tinysrgb&w=600",
      created_at: "2025-07-14T09:00:00Z",
      likes: 47,
      comments: 8,
    },
  ];

  // Mock exhibition posts
  const mockExhibitionPosts = [
    {
      post_id: 4,
      type: "exhibition",
      title: "Modern Abstract Art Showcase",
      description:
        "🎨 Join us for an incredible exhibition featuring contemporary abstract artists from around the world. Experience bold colors, dynamic forms, and innovative techniques.",
      location: "Downtown Art Gallery, Colombo",
      startDate: "2025-08-15",
      endDate: "2025-08-25",
      startTime: "10:00",
      endTime: "18:00",
      organizer: "Contemporary Arts Society",
      category: "Abstract Art",
      entryFee: "Free",
      created_at: "2025-07-18T09:00:00Z",
      likes: 56,
      comments: 12,
      verification_status: "verified",
      artist: {
        name: "Maria Rodriguez",
        avatar: "https://randomuser.me/api/portraits/women/25.jpg",
      },
    },
    {
      post_id: 5,
      type: "exhibition",
      title: "Digital Photography Workshop & Exhibition",
      description:
        "📸 Learn advanced digital photography techniques and showcase your work! Perfect for both beginners and experienced photographers looking to enhance their skills.",
      location: "Cultural Center, Kandy",
      startDate: "2025-07-30",
      endDate: "2025-08-01",
      startTime: "09:00",
      endTime: "17:00",
      organizer: "Photography Club Lanka",
      category: "Photography",
      entryFee: "LKR 2500",
      created_at: "2025-07-17T14:30:00Z",
      likes: 43,
      comments: 8,
      verification_status: "verified",
      artist: {
        name: "James Wilson",
        avatar: "https://randomuser.me/api/portraits/men/15.jpg",
      },
    },
    {
      post_id: 6,
      type: "exhibition",
      title: "Young Artists Collective Exhibition",
      description:
        "✨ Showcasing emerging talent in Sri Lanka! This exhibition features works by artists under 25, exploring themes of identity, culture, and the future.",
      location: "National Museum, Galle",
      startDate: "2025-08-05",
      endDate: "2025-08-12",
      startTime: "10:00",
      endTime: "19:00",
      organizer: "Youth Arts Foundation",
      category: "Mixed Media",
      entryFee: "LKR 500",
      created_at: "2025-07-16T11:20:00Z",
      likes: 38,
      comments: 15,
      verification_status: "verified",
      artist: {
        name: "Priya Jayasuriya",
        avatar: "https://randomuser.me/api/portraits/women/42.jpg",
      },
    },
  ];

  useEffect(() => {
    // Uncomment below to fetch from backend
    // const fetchPosts = async () => {
    //   try {
    //     const response = await axios.get('http://localhost:8080/api/posts/all');
    //     setPosts(response.data);
    //   } catch (error) {
    //     setPosts([]);
    //   }
    // };
    // fetchPosts();

    // For demo, set mock data
    setPosts(mockRegularPosts);
    setExhibitionPosts(mockExhibitionPosts);
    setLoading(false);
  }, []);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  // Combine and filter posts
  const getAllPosts = () => {
    const allPosts = [...posts, ...exhibitionPosts];
    return allPosts.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
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
      <div className="flex justify-center pt-24 pb-10">
        <div className="flex w-full max-w-7xl px-4">
          {/* Left Sidebar - Hidden on mobile and tablet */}
          <aside className="hidden lg:block w-80 mr-6">
            <div className="sticky top-28">
              <RecentChallenges />
            </div>
          </aside>

          {/* Center Feed */}
          <main className="flex-1 max-w-2xl mx-auto">
            {/* Exhibition Post Form - Only for Buyers */}
            {role === "buyer" && <ExhibitionPostForm />}

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
                filteredPosts.map((post) => {
                  if (post.type === "exhibition") {
                    return (
                      <ExhibitionPost
                        key={post.post_id}
                        post_id={post.post_id}
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
                        created_at={post.created_at}
                        likes={post.likes}
                        comments={post.comments}
                        artist={post.artist}
                      />
                    );
                  } else {
                    return (
                      <Post
                        key={post.post_id}
                        username={post.artist.name}
                        avatar={post.artist.avatar}
                        timeAgo={post.created_at}
                        image={post.image}
                        likes={post.likes}
                        caption={post.caption}
                      />
                    );
                  }
                })
              )}
            </div>
          </main>

          {/* Right Sidebar - Hidden on mobile and tablet */}
          <aside className="hidden lg:block w-80 ml-6">
            <div className="sticky top-28">
              <TopArtists />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
