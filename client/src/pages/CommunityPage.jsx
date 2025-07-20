import React, { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import Post from "../components/community/Posts";
import TopArtists from "../components/community/TopArtists";
import ExhibitionPostForm from "../components/community/ExhibitionPostForm";
import RecentChallenges from "../components/community/RecentChallenges";
import axios from "axios";

const CommunityPage = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const posts = [
    {
      id: 1,
      username: "iamkokilahiran",
      avatar: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg",
      timeAgo: "5h",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
      likes: 1247,
      caption: "Lost in the moment 🖤",
    },
    {
      id: 2,
      username: "naturevibes",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
      timeAgo: "8h",
      image: "https://images.pexels.com/photos/1758144/pexels-photo-1758144.jpeg",
      likes: 892,
      caption: "Nature therapy at its finest 🌿",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 overflow-x-hidden">
      {/* Navbar */}
      <Navbar onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

      {/* Main Layout */}
      <div className="flex pt-16">
        {/* Left Sidebar */}
        <div
          className={`transition-all duration-300 shrink-0 ${
            isSidebarCollapsed ? 'w-16' : 'w-64'
          } min-h-screen fixed top-16 left-0`}
        >
          <Sidebar isCollapsed={isSidebarCollapsed} />
        </div>

        {/* Sidebar Spacer */}
        <div className={`${isSidebarCollapsed ? 'w-16' : 'w-64'} shrink-0`} />

        {/* Post Feed */}
        <main className="flex-1 px-4 py-6 max-w-[700px] mx-auto xl:mr-[22rem]">
  <div className="space-y-6">
    {posts.map((post) => (
      <Post key={post.id} {...post} />
    ))}
  </div>
</main>


        {/* Right Sidebar */}
        <div className="hidden xl:block w-72 min-h-screen fixed top-16 right-0 overflow-y-auto p-4">
          <TopContributors />
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
