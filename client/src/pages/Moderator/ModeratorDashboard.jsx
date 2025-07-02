import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Plus,
  CheckCircle,
  Calendar,
  Trophy
} from 'lucide-react';

const ModeratorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total Challenges', value: '5', icon: <ShieldCheck className="h-5 w-5" />, change: '+2 new this month' },
    { label: 'Pending Exhibitions', value: '3', icon: <Calendar className="h-5 w-5" />, change: '2 verified this month' },
    { label: 'Winners Selected', value: '2', icon: <Trophy className="h-5 w-5" />, change: '+1 this week' },
  ];

  const recentActions = [
    { id: '001', action: 'Verified Exhibition', target: 'Modern Art Showcase', date: '2024-06-28', status: 'Verified' },
    { id: '002', action: 'Created Challenge', target: 'Digital Dreams Contest', date: '2024-06-26', status: 'Active' },
    { id: '003', action: 'Selected Winner', target: 'Urban Sketch Battle', date: '2024-06-25', status: 'Completed' }
  ];

  const upcomingTasks = [
    { name: 'Virtual Gallery', date: '2024-07-10', status: 'Pending', location: 'Online' },
    { name: 'Summer Sketch Fest', date: '2024-07-25', status: 'Confirmed', location: 'City Hall' }
  ];

  return (
    <div className="min-h-screen bg-cream/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-brown p-3 rounded-full">
                <ShieldCheck className="h-8 w-8 text-cream" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-brown">Moderator Dashboard</h1>
                <p className="text-brown/70">Welcome back, Moderator!</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
              <Link
                to="/ModeratorDashboard/createChallenge"
                className="border border-brown text-brown px-4 py-2 rounded-lg hover:bg-brown hover:text-cream transition-colors font-medium flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Create Challenge</span>
              </Link>
              <Link
                to="/challenges/winners"
                className="border border-brown text-brown px-4 py-2 rounded-lg hover:bg-brown hover:text-cream transition-colors font-medium flex items-center space-x-2"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Select Winners</span>
              </Link>
              <Link
                to="/exhibitions/verify"
                className="border border-brown text-brown px-4 py-2 rounded-lg hover:bg-brown hover:text-cream transition-colors font-medium flex items-center space-x-2"
              >
                <Calendar className="h-4 w-4" />
                <span>Verify Exhibitions</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-cream/50">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'challenges', label: 'Challenges' },
                { id: 'exhibitions', label: 'Exhibitions' },
                { id: 'winners', label: 'Winners' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-brown text-brown'
                      : 'border-transparent text-brown/60 hover:text-brown hover:border-brown/30'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-brown/70">{stat.label}</p>
                      <p className="text-2xl font-bold text-brown">{stat.value}</p>
                    </div>
                    <div className="text-brown/60">{stat.icon}</div>
                  </div>
                  <p className="mt-4 text-sm text-brown/50">{stat.change}</p>
                </div>
              ))}
            </div>

            {/* Recent Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Recent Moderator Actions */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-cream/50">
                  <h3 className="text-lg font-semibold text-brown">Recent Actions</h3>
                </div>
                <div className="p-6 space-y-4">
                  {recentActions.map((action) => (
                    <div key={action.id} className="flex items-center justify-between p-4 bg-cream/30 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-brown">{action.action}</p>
                        <p className="text-sm text-brown/70">{action.target}</p>
                        <p className="text-xs text-brown/50">{action.date}</p>
                      </div>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        action.status === 'Verified' ? 'bg-green-100 text-green-800'
                          : action.status === 'Active' ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {action.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Tasks */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-cream/50">
                  <h3 className="text-lg font-semibold text-brown">Upcoming Tasks</h3>
                </div>
                <div className="p-6 space-y-4">
                  {upcomingTasks.map((task, index) => (
                    <div key={index} className="p-4 bg-cream/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-brown">{task.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.status === 'Confirmed' ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {task.status}
                        </span>
                      </div>
                      <p className="text-sm text-brown/70 flex items-center space-x-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{task.date} • {task.location}</span>
                      </p>
                    </div>
                  ))}
                  <button className="w-full mt-4 text-brown hover:bg-cream/50 py-2 rounded-lg transition-colors font-medium">
                    View All Tasks
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Other tabs */}
        {activeTab !== 'overview' && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h3 className="text-xl font-semibold text-brown mb-2">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section
            </h3>
            <p className="text-brown/70">
              This section is under development. More moderation tools coming soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModeratorDashboard;
