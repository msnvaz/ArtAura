import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Palette,
    Plus,
    TrendingUp,
    Star,
    Calendar,
    ShoppingBag,
    DollarSign,
    Trophy,
    Image,
    Edit,
    Eye
} from 'lucide-react';

import ArtistPortfolio from './ArtistPortfolio';

const ArtistDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');

    const stats = [
        { label: 'Artworks Sold', value: '24', icon: <ShoppingBag className="h-5 w-5" />, change: '+12%' },
        { label: 'Total Revenue', value: '$3,240', icon: <DollarSign className="h-5 w-5" />, change: '+18%' },
        { label: 'Portfolio Views', value: '1,847', icon: <Palette className="h-5 w-5" />, change: '+7%' },
        { label: 'Challenge Wins', value: '3', icon: <Trophy className="h-5 w-5" />, change: '+1' }
    ];

    const recentOrders = [
        { id: '001', buyer: 'Sarah Johnson', artwork: 'Sunset Dreams', amount: '$250', status: 'Completed', date: '2024-01-15' },
        { id: '002', buyer: 'Mike Chen', artwork: 'Abstract Flow', amount: '$180', status: 'In Progress', date: '2024-01-14' },
        { id: '003', buyer: 'Emma Wilson', artwork: 'City Lights', amount: '$320', status: 'Pending', date: '2024-01-13' }
    ];

    const upcomingExhibitions = [
        { name: 'Modern Art Showcase', date: '2024-02-15', location: 'Downtown Gallery', status: 'Confirmed' },
        { name: 'Digital Dreams', date: '2024-03-01', location: 'Virtual Space', status: 'Pending' }
    ];

    return (
        <div className="min-h-screen bg-cream/20 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="bg-brown p-3 rounded-full">
                                <Palette className="h-8 w-8 text-cream" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-brown">Artist Dashboard</h1>
                                <p className="text-brown/70">Welcome back, John Artist!</p>
                            </div>
                        </div>
                        <div className="mt-4 md:mt-0 flex space-x-3">
                            {/* <button className="bg-brown text-cream px-4 py-2 rounded-lg hover:bg-brown/90 transition-colors font-medium flex items-center space-x-2">
                                <Plus className="h-4 w-4" />
                                <span>Add Artwork</span>
                            </button> */}

<Link
                                to="/uploadartwork"
                                className="border border-brown text-brown px-4 py-2 rounded-lg hover:bg-brown hover:text-cream transition-colors font-medium flex items-center space-x-2"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Add Artwork</span>
                            </Link>


                            <Link
                                to="/artist/artistportfolio"
                                className="border border-brown text-brown px-4 py-2 rounded-lg hover:bg-brown hover:text-cream transition-colors font-medium flex items-center space-x-2"
                            >
                                <Eye className="h-4 w-4" />
                                <span>View Portfolio</span>
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
                                { id: 'artworks', label: 'My Artworks' },
                                { id: 'orders', label: 'Orders' },
                                { id: 'exhibitions', label: 'Exhibitions' },
                                { id: 'analytics', label: 'Analytics' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
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

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-8">

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {stats.map((stat, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-brown/70">{stat.label}</p>
                                            <p className="text-2xl font-bold text-brown">{stat.value}</p>
                                        </div>
                                        <div className="text-brown/60">{stat.icon}</div>
                                    </div>
                                    <div className="flex items-center mt-4">
                                        <span className="text-green-600 text-sm font-medium">{stat.change}</span>
                                        <span className="text-brown/50 text-sm ml-2">from last month</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recent Activity */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                            {/* Recent Orders */}
                            <div className="bg-white rounded-lg shadow-sm">
                                <div className="p-6 border-b border-cream/50">
                                    <h3 className="text-lg font-semibold text-brown">Recent Orders</h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    {recentOrders.map((order) => (
                                        <div key={order.id} className="flex items-center justify-between p-4 bg-cream/30 rounded-lg">
                                            <div className="flex-1">
                                                <p className="font-medium text-brown">{order.artwork}</p>
                                                <p className="text-sm text-brown/70">by {order.buyer}</p>
                                                <p className="text-xs text-brown/50">{order.date}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-brown">{order.amount}</p>
                                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                        order.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Upcoming Exhibitions */}
                            <div className="bg-white rounded-lg shadow-sm">
                                <div className="p-6 border-b border-cream/50">
                                    <h3 className="text-lg font-semibold text-brown">Upcoming Exhibitions</h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    {upcomingExhibitions.map((exhibition, index) => (
                                        <div key={index} className="p-4 bg-cream/30 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-medium text-brown">{exhibition.name}</h4>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${exhibition.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {exhibition.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-brown/70 flex items-center space-x-1">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                <span>{exhibition.date} • {exhibition.location}</span>
                                            </p>
                                        </div>
                                    ))}
                                    <button className="w-full mt-4 text-brown hover:bg-cream/50 py-2 rounded-lg transition-colors font-medium">
                                        Apply for New Exhibition
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
                            This section is under development. More features coming soon!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArtistDashboard;