import React, { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import Post from "../components/community/Posts";
import TopArtists from "../components/community/TopArtists";
import RecentChallenges from "../components/community/PopularHashtags";
import ExhibitionPostForm from "../components/community/ExhibitionPostForm";
import axios from "axios";

const CommunityPage = () => {
  const [posts, setPosts] = useState([
    {
      post_id: 1,
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
  ]);

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
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF5E1] overflow-x-hidden">
      {/* Navbar */}
      <Navbar />

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
            {/* Exhibition Post Form */}
            <ExhibitionPostForm />

            {/* Posts Feed */}
            <div className="space-y-6">
              {posts.length === 0 ? (
                <div className="text-center text-[#7f5539]/60 py-20">
                  No posts to display yet.
                </div>
              ) : (
                posts.map((post) => (
                  <Post key={post.id || post.post_id} {...post} />
                ))
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
