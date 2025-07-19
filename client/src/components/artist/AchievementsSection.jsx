import React, { useState, useEffect } from 'react';
import { Trophy, Star, Medal, Award, FileText, Shield, Plus, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const AchievementsSection = ({ artistId, isOwnProfile = false, onAchievementsCountChange }) => {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddingAchievement, setIsAddingAchievement] = useState(false);
    const [editingAchievement, setEditingAchievement] = useState(null);
    const [newAchievement, setNewAchievement] = useState({
        title: '',
        type: 'winner',
        achievement_date: '',
        prize: '',
        description: '',
        icon_type: 'trophy',
        color_scheme: 'gold'
    });

    const { token } = useAuth();

    // Icon mapping
    const iconMapping = {
        trophy: Trophy,
        star: Star,
        medal: Medal,
        award: Award,
        certificate: FileText,
        badge: Shield
    };

    // Color mapping
    const colorMapping = {
        gold: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        silver: 'bg-gray-100 text-gray-800 border-gray-200',
        bronze: 'bg-orange-100 text-orange-800 border-orange-200',
        blue: 'bg-blue-100 text-blue-800 border-blue-200',
        purple: 'bg-purple-100 text-purple-800 border-purple-200',
        green: 'bg-green-100 text-green-800 border-green-200',
        red: 'bg-red-100 text-red-800 border-red-200'
    };

    useEffect(() => {
        fetchAchievements();
    }, [artistId]);

    const fetchAchievements = async () => {
        if (!artistId) return;

        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8081/api/achievements/artist/${artistId}`);
            const achievementsData = response.data || [];
            setAchievements(achievementsData);

            // Update count in parent component
            if (onAchievementsCountChange) {
                onAchievementsCountChange(achievementsData.length);
            }
        } catch (error) {
            console.error('Error fetching achievements:', error);
            setAchievements([]);
            if (onAchievementsCountChange) {
                onAchievementsCountChange(0);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAddAchievement = async () => {
        try {
            const achievementData = {
                title: newAchievement.title,
                type: newAchievement.type,
                achievementDate: newAchievement.achievement_date,
                prize: newAchievement.prize,
                description: newAchievement.description,
                iconType: newAchievement.icon_type,
                colorScheme: newAchievement.color_scheme
            };

            const response = await axios.post(
                'http://localhost:8081/api/achievements/create',
                achievementData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                await fetchAchievements();
                setIsAddingAchievement(false);
                resetForm();
                alert('Achievement added successfully!');
            }
        } catch (error) {
            console.error('Error adding achievement:', error);
            alert('Failed to add achievement. Please try again.');
        }
    };

    const handleUpdateAchievement = async () => {
        try {
            const response = await axios.put(
                `http://localhost:8081/api/achievements/${editingAchievement.achievementId}`,
                editingAchievement,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                await fetchAchievements();
                setEditingAchievement(null);
                alert('Achievement updated successfully!');
            }
        } catch (error) {
            console.error('Error updating achievement:', error);
            alert('Failed to update achievement. Please try again.');
        }
    };

    const handleDeleteAchievement = async (achievementId) => {
        if (!window.confirm('Are you sure you want to delete this achievement?')) {
            return;
        }

        try {
            const response = await axios.delete(
                `http://localhost:8081/api/achievements/${achievementId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200) {
                await fetchAchievements();
                alert('Achievement deleted successfully!');
            }
        } catch (error) {
            console.error('Error deleting achievement:', error);
            alert('Failed to delete achievement. Please try again.');
        }
    };

    const resetForm = () => {
        setNewAchievement({
            title: '',
            type: 'winner',
            achievement_date: '',
            prize: '',
            description: '',
            icon_type: 'trophy',
            color_scheme: 'gold'
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-20 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Achievements & Awards</h3>
                {isOwnProfile && (
                    <button
                        onClick={() => setIsAddingAchievement(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Add Achievement
                    </button>
                )}
            </div>

            {achievements.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No achievements to display yet</p>
                    {isOwnProfile && (
                        <p className="text-sm mt-2">Add your first achievement to showcase your accomplishments!</p>
                    )}
                </div>
            ) : (
                <div className="grid gap-4">
                    {achievements.map((achievement) => {
                        const IconComponent = iconMapping[achievement.iconType] || Award;
                        const colorClass = colorMapping[achievement.colorScheme] || colorMapping.gold;

                        return (
                            <div key={achievement.achievementId} className={`p-4 rounded-lg border-2 ${colorClass}`}>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0">
                                            <IconComponent className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-lg mb-1">{achievement.title}</h4>
                                            <div className="flex items-center gap-4 text-sm mb-2">
                                                <span className="font-medium capitalize">{achievement.type}</span>
                                                <span>{formatDate(achievement.achievementDate)}</span>
                                                {achievement.prize && (
                                                    <span className="font-medium">{achievement.prize}</span>
                                                )}
                                            </div>
                                            {achievement.description && (
                                                <p className="text-sm">{achievement.description}</p>
                                            )}
                                        </div>
                                    </div>
                                    {isOwnProfile && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setEditingAchievement(achievement)}
                                                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-white/50 rounded-lg transition-colors"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteAchievement(achievement.achievementId)}
                                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-white/50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add Achievement Modal */}
            {isAddingAchievement && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-bold mb-4">Add New Achievement</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={newAchievement.title}
                                    onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Achievement title"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select
                                        value={newAchievement.type}
                                        onChange={(e) => setNewAchievement({ ...newAchievement, type: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="winner">Winner</option>
                                        <option value="featured">Featured</option>
                                        <option value="runner-up">Runner-up</option>
                                        <option value="special">Special</option>
                                        <option value="certificate">Certificate</option>
                                        <option value="award">Award</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input
                                        type="date"
                                        value={newAchievement.achievement_date}
                                        onChange={(e) => setNewAchievement({ ...newAchievement, achievement_date: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Prize/Recognition</label>
                                <input
                                    type="text"
                                    value={newAchievement.prize}
                                    onChange={(e) => setNewAchievement({ ...newAchievement, prize: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="e.g., First Place, $500, Featured Artist"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={newAchievement.description}
                                    onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Brief description of the achievement"
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                                    <select
                                        value={newAchievement.icon_type}
                                        onChange={(e) => setNewAchievement({ ...newAchievement, icon_type: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="trophy">Trophy</option>
                                        <option value="star">Star</option>
                                        <option value="medal">Medal</option>
                                        <option value="award">Award</option>
                                        <option value="certificate">Document</option>
                                        <option value="badge">Shield</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                                    <select
                                        value={newAchievement.color_scheme}
                                        onChange={(e) => setNewAchievement({ ...newAchievement, color_scheme: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="gold">Gold</option>
                                        <option value="silver">Silver</option>
                                        <option value="bronze">Bronze</option>
                                        <option value="blue">Blue</option>
                                        <option value="purple">Purple</option>
                                        <option value="green">Green</option>
                                        <option value="red">Red</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleAddAchievement}
                                disabled={!newAchievement.title || !newAchievement.achievement_date}
                                className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                Add Achievement
                            </button>
                            <button
                                onClick={() => {
                                    setIsAddingAchievement(false);
                                    resetForm();
                                }}
                                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Achievement Modal */}
            {editingAchievement && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-bold mb-4">Edit Achievement</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={editingAchievement.title}
                                    onChange={(e) => setEditingAchievement({ ...editingAchievement, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select
                                        value={editingAchievement.type}
                                        onChange={(e) => setEditingAchievement({ ...editingAchievement, type: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="winner">Winner</option>
                                        <option value="featured">Featured</option>
                                        <option value="runner-up">Runner-up</option>
                                        <option value="special">Special</option>
                                        <option value="certificate">Certificate</option>
                                        <option value="award">Award</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input
                                        type="date"
                                        value={editingAchievement.achievementDate}
                                        onChange={(e) => setEditingAchievement({ ...editingAchievement, achievementDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Prize/Recognition</label>
                                <input
                                    type="text"
                                    value={editingAchievement.prize || ''}
                                    onChange={(e) => setEditingAchievement({ ...editingAchievement, prize: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={editingAchievement.description || ''}
                                    onChange={(e) => setEditingAchievement({ ...editingAchievement, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                                    <select
                                        value={editingAchievement.iconType}
                                        onChange={(e) => setEditingAchievement({ ...editingAchievement, iconType: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="trophy">Trophy</option>
                                        <option value="star">Star</option>
                                        <option value="medal">Medal</option>
                                        <option value="award">Award</option>
                                        <option value="certificate">Document</option>
                                        <option value="badge">Shield</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                                    <select
                                        value={editingAchievement.colorScheme}
                                        onChange={(e) => setEditingAchievement({ ...editingAchievement, colorScheme: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="gold">Gold</option>
                                        <option value="silver">Silver</option>
                                        <option value="bronze">Bronze</option>
                                        <option value="blue">Blue</option>
                                        <option value="purple">Purple</option>
                                        <option value="green">Green</option>
                                        <option value="red">Red</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleUpdateAchievement}
                                className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                Update Achievement
                            </button>
                            <button
                                onClick={() => setEditingAchievement(null)}
                                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AchievementsSection;
