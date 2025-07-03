import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Eye,
  Plus,
  ShieldCheck,
  Trophy,
  Users
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ModeratorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Challenges', value: '5', icon: <ShieldCheck className="h-5 w-5" />, change: '+2 new this month' },
    { label: 'Pending Exhibitions', value: '3', icon: <Calendar className="h-5 w-5" />, change: '2 verified this month' },
    { label: 'Winners Selected', value: '2', icon: <Trophy className="h-5 w-5" />, change: '+1 this week' },
    { label: 'Active Users', value: '247', icon: <Users className="h-5 w-5" />, change: '+15 this week' },
  ];

  const recentActions = [
    { id: '001', action: 'Verified Exhibition', target: 'Modern Art Showcase', date: '2024-06-28', status: 'Verified' },
    { id: '002', action: 'Created Challenge', target: 'Digital Dreams Contest', date: '2024-06-26', status: 'Active' },
    { id: '003', action: 'Selected Winner', target: 'Urban Sketch Battle', date: '2024-06-25', status: 'Completed' },
    { id: '004', action: 'Reviewed Report', target: 'Inappropriate Content Flag', date: '2024-06-24', status: 'Resolved' }
  ];

  const upcomingTasks = [
    { name: 'Virtual Gallery Review', date: '2024-07-10', status: 'Pending', location: 'Online', priority: 'High' },
    { name: 'Summer Sketch Fest', date: '2024-07-25', status: 'Confirmed', location: 'City Hall', priority: 'Medium' },
    { name: 'Artist Verification Review', date: '2024-07-15', status: 'In Progress', location: 'Platform', priority: 'High' }
  ];

  const pendingReviews = [
    { type: 'Exhibition', title: 'Contemporary Colors Show', submitter: 'Gallery One', date: '2024-07-01', status: 'pending' },
    { type: 'Challenge', title: 'Nature Photography Contest', submitter: 'PhotoClub', date: '2024-06-30', status: 'pending' },
    { type: 'Report', title: 'Inappropriate Content', submitter: 'User Report', date: '2024-07-02', status: 'urgent' }
  ];

  const challengesData = [
    { title: 'Abstract Emotions', participants: 45, status: 'Active', deadline: '2024-07-15', winner: null },
    { title: 'Digital Dreams', participants: 32, status: 'Completed', deadline: '2024-06-30', winner: 'Sarah Martinez' },
    { title: 'Urban Landscapes', participants: 67, status: 'Active', deadline: '2024-08-01', winner: null },
    { title: 'Portrait Masters', participants: 28, status: 'Judging', deadline: '2024-07-01', winner: 'Pending' }
  ];

  const exhibitionsData = [
    { title: 'Modern Art Showcase', organizer: 'Metro Gallery', status: 'Verified', date: '2024-07-20', visitors: 156 },
    { title: 'Digital Dreams Exhibition', organizer: 'Art Space', status: 'Pending', date: '2024-07-25', visitors: 0 },
    { title: 'Summer Collection', organizer: 'Creative Hub', status: 'Rejected', date: '2024-07-10', visitors: 0 }
  ];

  const winnersData = [
    { challenge: 'Digital Dreams Contest', winner: 'Sarah Martinez', prize: '$600', date: '2024-06-30', artwork: 'Sunset Dreams' },
    { challenge: 'Urban Sketch Battle', winner: 'Mike Johnson', prize: '$400', date: '2024-06-25', artwork: 'City Lights' },
    { challenge: 'Abstract Flow', winner: 'Emma Wilson', prize: '$500', date: '2024-06-20', artwork: 'Ocean Waves' }
  ];

  return (
    <div className="min-h-screen bg-amber-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-amber-800 p-3 rounded-full">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-amber-900">Moderator Dashboard</h1>
                <p className="text-amber-700">Welcome back, Moderator!</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
              <button
                className="border border-amber-800 text-amber-800 px-4 py-2 rounded-lg hover:bg-amber-800 hover:text-white transition-colors font-medium flex items-center space-x-2"
                onClick={() => navigate('/CreateChallenge')}
              >
                <Plus className="h-4 w-4" />
                <span>Create Challenge</span>
              </button>
              <button className="border border-amber-800 text-amber-800 px-4 py-2 rounded-lg hover:bg-amber-800 hover:text-white transition-colors font-medium flex items-center space-x-2">
                <CheckCircle className="h-4 w-4" />
                <span>Select Winners</span>
              </button>
              <button
                className="border border-amber-800 text-amber-800 px-4 py-2 rounded-lg hover:bg-amber-800 hover:text-white transition-colors font-medium flex items-center space-x-2"
                onClick={() => navigate('/verifyExhibitions')}
              >
                <Calendar className="h-4 w-4" />
                <span>Verify Exhibitions</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-amber-200">
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
                      ? 'border-amber-800 text-amber-900'
                      : 'border-transparent text-amber-700 hover:text-amber-900 hover:border-amber-400'
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                // Assign a color for each box and text
                const boxColors = [
                  'bg-amber-100',
                  'bg-blue-100',
                  'bg-green-100',
                  'bg-pink-100'
                ];
                const iconColors = [
                  'text-amber-700',
                  'text-blue-700',
                  'text-green-700',
                  'text-pink-700'
                ];
                const valueColors = [
                  'text-amber-700',
                  'text-blue-700',
                  'text-green-700',
                  'text-pink-700'
                ];
                const labelColors = [
                  'text-amber-700',
                  'text-blue-700',
                  'text-green-700',
                  'text-pink-700'
                ];
                const changeColors = [
                  'text-amber-600',
                  'text-blue-600',
                  'text-green-600',
                  'text-pink-600'
                ];
                return (
                  <div
                    key={index}
                    className={`${boxColors[index % boxColors.length]} rounded-lg shadow-sm p-6`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm font-medium ${labelColors[index % labelColors.length]}`}>{stat.label}</p>
                        <p className={`text-2xl font-bold ${valueColors[index % valueColors.length]}`}>{stat.value}</p>
                      </div>
                      <div className={iconColors[index % iconColors.length]}>
                        {stat.icon}
                      </div>
                    </div>
                    <p className={`mt-4 text-sm ${changeColors[index % changeColors.length]}`}>{stat.change}</p>
                  </div>
                );
              })}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Recent Moderator Actions */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-amber-200">
                  <h3 className="text-lg font-semibold text-amber-900">Recent Actions</h3>
                </div>
                <div className="p-6 space-y-4">
                  {recentActions.map((action) => (
                    <div key={action.id} className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-amber-900">{action.action}</p>
                        <p className="text-sm text-amber-700">{action.target}</p>
                        <p className="text-xs text-amber-600">{action.date}</p>
                      </div>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        action.status === 'Verified' ? 'bg-green-100 text-green-800'
                          : action.status === 'Active' ? 'bg-yellow-100 text-yellow-800'
                          : action.status === 'Completed' ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {action.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Tasks */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-amber-200">
                  <h3 className="text-lg font-semibold text-amber-900">Upcoming Tasks</h3>
                </div>
                <div className="p-6 space-y-4">
                  {upcomingTasks.map((task, index) => (
                    <div key={index} className="p-4 bg-amber-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-amber-900">{task.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.status === 'Confirmed' ? 'bg-green-100 text-green-800'
                            : task.status === 'In Progress' ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {task.status}
                        </span>
                      </div>
                      <p className="text-sm text-amber-700 flex items-center space-x-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{task.date} • {task.location}</span>
                      </p>
                      <div className="mt-2">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          task.priority === 'High' ? 'bg-red-100 text-red-800'
                            : task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {task.priority} Priority
                        </span>
                      </div>
                    </div>
                  ))}
                  <button className="w-full mt-4 text-amber-800 hover:bg-amber-100 py-2 rounded-lg transition-colors font-medium">
                    View All Tasks
                  </button>
                </div>
              </div>

              {/* Pending Reviews */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-amber-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-amber-900">Pending Reviews</h3>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                      {pendingReviews.length} pending
                    </span>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {pendingReviews.map((review, index) => (
                    <div key={index} className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-400">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          review.status === 'urgent' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {review.type}
                        </span>
                        {review.status === 'urgent' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                      </div>
                      <h4 className="font-medium text-amber-900 text-sm">{review.title}</h4>
                      <p className="text-xs text-amber-700">By: {review.submitter}</p>
                      <p className="text-xs text-amber-600">{review.date}</p>
                    </div>
                  ))}
                  <button className="w-full mt-4 bg-amber-800 text-white py-2 rounded-lg hover:bg-amber-700 transition-colors font-medium">
                    Review All Pending
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Challenges Tab */}
        {activeTab === 'challenges' && (
          <dZiv className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-amber-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-amber-900">Challenge Management</h3>
                <button className="bg-amber-800 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors font-medium flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>New Challenge</span>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {challengesData.map((challenge, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-amber-900">{challenge.title}</h4>
                      <p className="text-sm text-amber-700">{challenge.participants} participants</p>
                      <p className="text-xs text-amber-600">Deadline: {challenge.deadline}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        challenge.status === 'Active' ? 'bg-green-100 text-green-800'
                          : challenge.status === 'Completed' ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {challenge.status}
                      </span>
                      <button className="text-amber-800 hover:text-amber-600">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </dZiv>
        )}

        {/* Exhibitions Tab */}
        {activeTab === 'exhibitions' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-amber-200">
              <h3 className="text-lg font-semibold text-amber-900">Exhibition Management</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {exhibitionsData.map((exhibition, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-amber-900">{exhibition.title}</h4>
                      <p className="text-sm text-amber-700">Organized by: {exhibition.organizer}</p>
                      <p className="text-xs text-amber-600">Date: {exhibition.date} • Visitors: {exhibition.visitors}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        exhibition.status === 'Verified' ? 'bg-green-100 text-green-800'
                          : exhibition.status === 'Pending' ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {exhibition.status}
                      </span>
                      <button className="text-amber-800 hover:text-amber-600">
                        <CheckCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Winners Tab */}
        {activeTab === 'winners' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-amber-200">
              <h3 className="text-lg font-semibold text-amber-900">Challenge Winners</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {winnersData.map((winner, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-yellow-100 p-2 rounded-full">
                        <Trophy className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-amber-900">{winner.challenge}</h4>
                        <p className="text-sm text-amber-700">Winner: {winner.winner}</p>
                        <p className="text-xs text-amber-600">Artwork: {winner.artwork} • {winner.date}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="font-bold text-amber-900">{winner.prize}</span>
                      <p className="text-xs text-amber-600">Prize</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModeratorDashboard;