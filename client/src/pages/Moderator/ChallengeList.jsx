import { Calendar, Edit, Eye, Filter, Plus, Search, Trash2, Trophy, Users } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const ChallengeList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const challenges = [
    {
      id: 1,
      title: 'Modern Art Challenge 2025',
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
      title: 'Degital Art Challenge',
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
      title: 'New Art Compition August-2025',
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
      {/* CSS styles for button animations */}
      <style jsx>{`
        @keyframes smoothFadeIn {
          from {
            opacity: 0;
            transform: translateY(15px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .page-container {
          animation: smoothFadeIn 0.4s ease-out;
          opacity: 1;
        }

        .smooth-transition {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-animate {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 1;
          transform: translateY(0);
        }

        .btn-animate:hover {
          transform: translateY(-1px) scale(1.02);
        }

        .card-animate {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-animate:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        /* Ensure smooth rendering */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>

      {/* Bootstrap CSS */}
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      
      <div className="min-h-screen page-container" style={{backgroundColor: '#FFF5E1'}}>
        {/* Full Width Header */}
        <div
          className="w-full shadow-sm p-6 mb-8 relative"
          style={{
            backgroundImage:
              'linear-gradient(rgba(93, 58, 0, 0.85), rgba(93, 58, 0, 0.85)), url("https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2058&q=80")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full" style={{backgroundColor: '#FFD95A'}}>
                  <Trophy size={32} style={{color: '#5D3A00'}} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Challenge Management</h1>
                  <p className="text-gray-200">Manage and monitor all your challenges</p>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex gap-2 items-center">
                <button
                  onClick={() => navigate("/create-challenge")}
                  className="border px-3 py-2 rounded-lg font-medium flex items-center space-x-1 whitespace-nowrap btn-animate"
                  style={{
                    borderColor: '#FFE4D6',
                    color: '#FFE4D6',
                    backgroundColor: 'rgba(255, 228, 214, 0.1)'
                  }}
                >
                  <Plus size={14} />
                  <span className="hidden sm:inline">Create Challenge</span>
                  <span className="sm:hidden">Create</span>
                </button>
                <button
                  onClick={() => navigate('/moderatordashboard')}
                  className="border px-3 py-2 rounded-lg font-medium flex items-center space-x-1 whitespace-nowrap btn-animate"
                  style={{
                    borderColor: '#FFE4D6',
                    color: '#FFE4D6',
                    backgroundColor: 'rgba(255, 228, 214, 0.1)'
                  }}
                >
                  <Trophy size={14} />
                  <span className="hidden sm:inline">Dashboard</span>
                  <span className="sm:hidden">Dashboard</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-amber-900">All Challenges</h2>
          <p className="text-amber-700 mt-1">View and manage challenge details</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 smooth-transition">
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
          <div key={challenge.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow card-animate">
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
                  <button className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors btn-animate">
                    <Eye size={16} />
                  </button>
                  <button className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors btn-animate">
                    <Edit size={16} />
                  </button>
                  <button className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors btn-animate">
                    <Trash2 size={16} />
                  </button>
                </div>
                <Link
                  to={`/challenges/${challenge.id}`}
                  className="text-sm font-medium text-amber-800 hover:text-amber-900 btn-animate inline-block"
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