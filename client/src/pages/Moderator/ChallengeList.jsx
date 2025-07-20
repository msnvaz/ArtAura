import { Calendar, Edit, Eye, Filter, Plus, Search, Trash2, Trophy, Users } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const ChallengeList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const challenges = [
    {
      id: 1,
      title: 'Web Design Challenge 2024',
      description: 'Create an innovative web design that showcases modern UI/UX principles.',
      status: 'active',
      publishDate: '2024-01-15',
      deadline: '2024-02-15',
      participants: 156,
      submissions: 89,
      category: 'Design'
    },
    {
      id: 2,
      title: 'Mobile App Innovation',
      description: 'Develop a mobile application that solves a real-world problem.',
      status: 'review',
      publishDate: '2024-01-10',
      deadline: '2024-02-10',
      participants: 203,
      submissions: 145,
      category: 'Development'
    },
    {
      id: 3,
      title: 'AI Art Competition',
      description: 'Create stunning artwork using artificial intelligence tools.',
      status: 'completed',
      publishDate: '2024-01-05',
      deadline: '2024-02-05',
      participants: 89,
      submissions: 67,
      category: 'Art'
    },
    {
      id: 4,
      title: 'Sustainability Hackathon',
      description: 'Build solutions for environmental challenges.',
      status: 'draft',
      publishDate: '2024-02-20',
      deadline: '2024-03-20',
      participants: 0,
      submissions: 0,
      category: 'Innovation'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'review':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || challenge.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      {/* Bootstrap CSS */}
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      
      <div className="min-h-screen" style={{backgroundColor: '#FFF5E1'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="space-y-6 w-full pt-8">
      {/* Top Navigation */}
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={() => window.location.assign('/moderatordashboard')}
          className="flex items-center gap-2 px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-900 transition-colors"
        >
          <Trophy size={20} />
          Moderator Dashboard
        </button>
        <Link
          to="/create-challenge"
          className="flex items-center gap-2 px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition-colors"
        >
          <Plus size={20} />
          Create Challenge
        </Link>
      </div>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-amber-900">Challenge Management</h1>
          <p className="text-amber-700 mt-2">Manage and monitor all your challenges</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search challenges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Challenge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChallenges.map((challenge) => (
          <div key={challenge.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">{challenge.category}</span>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(challenge.status)}`}>
                  {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{challenge.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{challenge.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar size={16} />
                  <span>Deadline: {new Date(challenge.deadline).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Users size={16} />
                  <span>{challenge.participants} participants • {challenge.submissions} submissions</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye size={16} />
                  </button>
                  <button className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                    <Edit size={16} />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
                <Link
                  to={`/challenges/${challenge.id}`}
                  className="text-sm font-medium text-amber-800 hover:text-amber-900"
                >
                  View Details →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredChallenges.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No challenges found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChallengeList;