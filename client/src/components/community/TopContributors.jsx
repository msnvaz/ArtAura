import React from 'react';

const topContributors = [
  { id: 1, name: 'Alice Wonder', avatar: 'https://i.pravatar.cc/50?img=1', posts: 120 },
  { id: 2, name: 'Bob Artist', avatar: 'https://i.pravatar.cc/50?img=2', posts: 98 },
  { id: 3, name: 'Charlie Paints', avatar: 'https://i.pravatar.cc/50?img=3', posts: 85 },
  { id: 4, name: 'Diana Sketch', avatar: 'https://i.pravatar.cc/50?img=4', posts: 73 },
  { id: 5, name: 'Eve Colors', avatar: 'https://i.pravatar.cc/50?img=5', posts: 65 },
  // Add more contributors as needed
];

const TopContributorsSidebar = () => {
  return (
    <aside className="hidden lg:flex flex-col fixed right-0 top-16 h-[calc(100vh-4rem)] w-72 bg-white border-l border-gray-200 shadow-lg p-4">
      <h2 className="text-xl font-semibold mb-4 border-b pb-2">Top Contributors</h2>
      <div className="flex flex-col space-y-4 overflow-y-auto max-h-full">
        {topContributors.map(({ id, name, avatar, posts }) => (
          <div
            key={id}
            className="flex items-center space-x-4 hover:bg-gray-100 rounded-md p-2 cursor-pointer transition"
            title={`${name} — ${posts} posts`}
          >
            <img
              src={avatar}
              alt={`${name}'s avatar`}
              className="w-12 h-12 rounded-full object-cover"
              loading="lazy"
            />
            <div className="flex flex-col">
              <span className="font-medium text-gray-900">{name}</span>
              <span className="text-sm text-gray-500">{posts} posts</span>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default TopContributorsSidebar;
