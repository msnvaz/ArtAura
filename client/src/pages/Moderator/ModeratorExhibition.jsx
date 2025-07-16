import React, { useState } from 'react';
import { Eye, Download, Star, Filter, Search, Calendar, User, Award } from 'lucide-react';

const ModeratorExhibition = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterChallenge, setFilterChallenge] = useState('all');
  const [filterRating, setFilterRating] = useState('all');

  const exhibitions = [
    {
      id: 1,
      title: 'Modern E-commerce Dashboard',
      participant: 'Sarah Johnson',
      challenge: 'Web Design Challenge 2024',
      submissionDate: '2024-02-10',
      rating: 4.8,
      views: 245,
      description: 'A sleek and intuitive e-commerce dashboard with advanced analytics.',
      imageUrl: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['UI/UX', 'Dashboard', 'E-commerce'],
      status: 'featured'
    },
    {
      id: 2,
      title: 'AI-Powered Task Manager',
      participant: 'Michael Chen',
      challenge: 'Mobile App Innovation',
      submissionDate: '2024-02-08',
      rating: 4.6,
      views: 189,
      description: 'Smart task management app with AI-driven priority suggestions.',
      imageUrl: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['Mobile', 'AI', 'Productivity'],
      status: 'approved'
    },
    {
      id: 3,
      title: 'Digital Art Portrait',
      participant: 'Emma Rodriguez',
      challenge: 'AI Art Competition',
      submissionDate: '2024-02-05',
      rating: 4.9,
      views: 312,
      description: 'Stunning AI-generated portrait with unique artistic style.',
      imageUrl: 'https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['AI Art', 'Portrait', 'Digital'],
      status: 'winner'
    },
    {
      id: 4,
      title: 'Eco-Friendly App Concept',
      participant: 'David Kim',
      challenge: 'Sustainability Hackathon',
      submissionDate: '2024-02-12',
      rating: 4.4,
      views: 156,
      description: 'Mobile app promoting sustainable living practices.',
      imageUrl: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400',
      tags: ['Sustainability', 'Mobile', 'Environment'],
      status: 'pending'
    }
  ];

  const challenges = ['Web Design Challenge 2024', 'Mobile App Innovation', 'AI Art Competition', 'Sustainability Hackathon'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'winner':
        return 'bg-yellow-100 text-yellow-800';
      case 'featured':
        return 'bg-purple-100 text-purple-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'winner':
        return <Award className="h-4 w-4" />;
      case 'featured':
        return <Star className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const filteredExhibitions = exhibitions.filter(exhibition => {
    const matchesSearch = exhibition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exhibition.participant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChallenge = filterChallenge === 'all' || exhibition.challenge === filterChallenge;
    const matchesRating = filterRating === 'all' || 
                         (filterRating === '4+' && exhibition.rating >= 4) ||
                         (filterRating === '3+' && exhibition.rating >= 3);
    return matchesSearch && matchesChallenge && matchesRating;
  });

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-amber-900">Exhibition Gallery</h1>
          <p className="text-amber-700 mt-2">Browse and manage submitted works</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition-colors">
            <Download size={20} />
            Export All
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search exhibitions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-500" />
            <select
              value={filterChallenge}
              onChange={(e) => setFilterChallenge(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="all">All Challenges</option>
              {challenges.map(challenge => (
                <option key={challenge} value={challenge}>{challenge}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Star size={20} className="text-gray-500" />
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="all">All Ratings</option>
              <option value="4+">4+ Stars</option>
              <option value="3+">3+ Stars</option>
            </select>
          </div>
        </div>
      </div>

      {/* Exhibition Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExhibitions.map((exhibition) => (
          <div key={exhibition.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <div className="relative">
              <img
                src={exhibition.imageUrl}
                alt={exhibition.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(exhibition.status)}`}>
                  {getStatusIcon(exhibition.status)}
                  {exhibition.status.charAt(0).toUpperCase() + exhibition.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{exhibition.title}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{exhibition.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <User size={16} />
                  <span>{exhibition.participant}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar size={16} />
                  <span>{new Date(exhibition.submissionDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{exhibition.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Eye size={16} />
                    <span>{exhibition.views} views</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {exhibition.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-500">{exhibition.challenge}</span>
                <button className="flex items-center gap-1 text-amber-800 hover:text-amber-900 text-sm font-medium">
                  <Eye size={16} />
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredExhibitions.length === 0 && (
        <div className="text-center py-12">
          <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No exhibitions found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ModeratorExhibition;