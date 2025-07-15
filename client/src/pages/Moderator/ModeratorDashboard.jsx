import { Award, Calendar, Clock, TrendingUp, Trophy, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ModeratorDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      name: 'Active Challenges',
      value: '12',
      icon: Trophy,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+2.1%',
      changeType: 'increase'
    },
    {
      name: 'Total Participants',
      value: '1,247',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+12.5%',
      changeType: 'increase'
    },
    {
      name: 'Pending Reviews',
      value: '23',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      change: '-4.3%',
      changeType: 'decrease'
    },
    {
      name: 'Winners Selected',
      value: '89',
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+8.2%',
      changeType: 'increase'
    }
  ];

  const recentChallenges = [
    {
      id: 1,
      title: 'Web Design Challenge 2024',
      status: 'Active',
      participants: 156,
      deadline: '2024-02-15',
      submissions: 89
    },
    {
      id: 2,
      title: 'Mobile App Innovation',
      status: 'Review',
      participants: 203,
      deadline: '2024-02-10',
      submissions: 145
    },
    {
      id: 3,
      title: 'AI Art Competition',
      status: 'Completed',
      participants: 89,
      deadline: '2024-02-05',
      submissions: 67
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex justify-center min-h-screen py-8" style={{ backgroundColor: '#fdf5e6' }}>
      <div className="space-y-6 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Dashboard Button */}
        <div className="mb-4">
          <button
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded shadow"
            onClick={() => navigate('/Moderator/ModeratorDashboard')}
          >
            Dashboard
          </button>
        </div>
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-amber-900">Moderator Dashboard</h1>
              <p className="text-amber-700 mt-2 text-sm sm:text-base">Welcome back! Here's what's happening with your challenges.</p>
            </div>
            <div className="flex items-center space-x-2 text-amber-600">
              <Calendar className="h-5 w-5" />
              <span className="text-xs sm:text-sm font-medium">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="bg-white rounded-lg shadow-md p-4 sm:p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-2 sm:p-3 rounded-full`}>
                    <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className={`h-4 w-4 ${stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`} />
                  <span className={`text-xs sm:text-sm font-medium ml-2 ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500 ml-2">from last month</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Challenges */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Recent Challenges</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                    Challenge
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                    Participants
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                    Submissions
                  </th>
                  <th className="px-2 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                    Deadline
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentChallenges.map((challenge) => (
                  <tr key={challenge.id} className="hover:bg-gray-50">
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{challenge.title}</div>
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(challenge.status)}`}>
                        {challenge.status}
                      </span>
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                      {challenge.participants}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                      {challenge.submissions}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                      {new Date(challenge.deadline).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeratorDashboard;