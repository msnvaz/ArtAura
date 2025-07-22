import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import {
    Plus,
    Calendar,
    MapPin,
    Eye,
    Users,
    ExternalLink,
    Mail,
    Phone,
    DollarSign,
    Edit,
    Trash2,
    Star,
    Building,
    Clock
} from 'lucide-react';

const ExhibitionsSection = ({ onExhibitionsCountChange, onRefresh }) => {
    const { token, userId } = useAuth();
    const { showSuccess, showError } = useNotification();
    const [exhibitions, setExhibitions] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingExhibition, setEditingExhibition] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        venue: '',
        startDate: '',
        endDate: '',
        status: 'upcoming',
        exhibitionType: 'group',
        artworksCount: 0,
        totalVisitors: 0,
        websiteUrl: '',
        contactEmail: '',
        contactPhone: '',
        entryFee: '0.00',
        isFeatured: false
    });

    // Reset form data
    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            location: '',
            venue: '',
            startDate: '',
            endDate: '',
            status: 'upcoming',
            exhibitionType: 'group',
            artworksCount: 0,
            totalVisitors: 0,
            websiteUrl: '',
            contactEmail: '',
            contactPhone: '',
            entryFee: '0.00',
            isFeatured: false
        });
    };

    // Fetch exhibitions
    const fetchExhibitions = async () => {
        if (!userId || !token) return;

        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8081/api/exhibitions/artist/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const fetchedExhibitions = response.data || [];
            setExhibitions(fetchedExhibitions);

            // Update parent component with count
            if (onExhibitionsCountChange) {
                onExhibitionsCountChange(fetchedExhibitions.length);
            }

            console.log('Exhibitions fetched:', fetchedExhibitions.length);
        } catch (error) {
            console.error('Error fetching exhibitions:', error);
            setExhibitions([]);
            if (onExhibitionsCountChange) {
                onExhibitionsCountChange(0);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExhibitions();
    }, [userId, token]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Handle form submission for adding new exhibition
    const handleAddExhibition = async (e) => {
        e.preventDefault();
        if (!token) return;

        try {
            setLoading(true);
            const response = await axios.post(
                'http://localhost:8081/api/exhibitions/create',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Exhibition created:', response.data);

            // Refresh exhibitions list
            await fetchExhibitions();

            // Reset form and close modal
            resetForm();
            setShowAddModal(false);

            showSuccess('Exhibition created successfully!');

            // Call refresh callback if provided
            if (onRefresh) {
                onRefresh();
            }
        } catch (error) {
            console.error('Error creating exhibition:', error);
            showError('Failed to create exhibition. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle editing exhibition
    const handleEditExhibition = (exhibition) => {
        setEditingExhibition(exhibition);
        setFormData({
            title: exhibition.title || '',
            description: exhibition.description || '',
            location: exhibition.location || '',
            venue: exhibition.venue || '',
            startDate: exhibition.startDate || '',
            endDate: exhibition.endDate || '',
            status: exhibition.status || 'upcoming',
            exhibitionType: exhibition.exhibitionType || 'group',
            artworksCount: exhibition.artworksCount || 0,
            totalVisitors: exhibition.totalVisitors || 0,
            websiteUrl: exhibition.websiteUrl || '',
            contactEmail: exhibition.contactEmail || '',
            contactPhone: exhibition.contactPhone || '',
            entryFee: exhibition.entryFee ? exhibition.entryFee.toString() : '0.00',
            isFeatured: exhibition.isFeatured || false
        });
        setShowEditModal(true);
    };

    // Handle form submission for updating exhibition
    const handleUpdateExhibition = async (e) => {
        e.preventDefault();
        if (!token || !editingExhibition) return;

        try {
            setLoading(true);
            const response = await axios.put(
                `http://localhost:8081/api/exhibitions/${editingExhibition.exhibitionId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Exhibition updated:', response.data);

            // Refresh exhibitions list
            await fetchExhibitions();

            // Reset form and close modal
            resetForm();
            setShowEditModal(false);
            setEditingExhibition(null);

            showSuccess('Exhibition updated successfully!');

            // Call refresh callback if provided
            if (onRefresh) {
                onRefresh();
            }
        } catch (error) {
            console.error('Error updating exhibition:', error);
            showError('Failed to update exhibition. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle deleting exhibition
    const handleDeleteExhibition = (exhibition) => {
        setEditingExhibition(exhibition);
        setShowDeleteModal(true);
    };

    // Confirm delete
    const confirmDelete = async () => {
        if (!token || !editingExhibition) return;

        try {
            setLoading(true);
            await axios.delete(
                `http://localhost:8081/api/exhibitions/${editingExhibition.exhibitionId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log('Exhibition deleted:', editingExhibition.exhibitionId);

            // Refresh exhibitions list
            await fetchExhibitions();

            // Close modal and reset
            setShowDeleteModal(false);
            setEditingExhibition(null);

            showSuccess('Exhibition deleted successfully!');

            // Call refresh callback if provided
            if (onRefresh) {
                onRefresh();
            }
        } catch (error) {
            console.error('Error deleting exhibition:', error);
            showError('Failed to delete exhibition. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'upcoming': return 'bg-blue-100 text-blue-800';
            case 'ongoing': return 'bg-green-100 text-green-800';
            case 'completed': return 'bg-gray-100 text-gray-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Get exhibition type icon
    const getExhibitionTypeIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'solo': return <Users className="h-4 w-4" />;
            case 'group': return <Users className="h-4 w-4" />;
            case 'virtual': return <ExternalLink className="h-4 w-4" />;
            case 'popup': return <Building className="h-4 w-4" />;
            default: return <Building className="h-4 w-4" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Exhibitions</h3>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-[#7f5539] text-[#fdf9f4] px-6 py-2 rounded-lg hover:bg-[#6e4c34] transition-colors font-medium flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Add Exhibition Details
                </button>
            </div>

            {/* Loading State */}
            {loading && !showAddModal && !showEditModal && (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading exhibitions...</p>
                </div>
            )}

            {/* Empty State */}
            {!loading && exhibitions.length === 0 && (
                <div className="text-center py-8">
                    <Building className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">No exhibitions yet. Create your first exhibition!</p>
                </div>
            )}

            {/* Exhibitions Grid */}
            {!loading && exhibitions.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {exhibitions.map((exhibition) => (
                        <div key={exhibition.exhibitionId} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-6">
                                {/* Header with title and status */}
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-lg mb-1">{exhibition.title}</h4>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                            {getExhibitionTypeIcon(exhibition.exhibitionType)}
                                            <span className="capitalize">{exhibition.exhibitionType}</span>
                                            {exhibition.isFeatured && (
                                                <Star className="h-4 w-4 text-yellow-500" fill="currentColor" />
                                            )}
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(exhibition.status)}`}>
                                        {exhibition.status}
                                    </span>
                                </div>

                                {/* Description */}
                                {exhibition.description && (
                                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">{exhibition.description}</p>
                                )}

                                {/* Details */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <MapPin className="h-4 w-4" />
                                        <span>{exhibition.location}</span>
                                        {exhibition.venue && <span>• {exhibition.venue}</span>}
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar className="h-4 w-4" />
                                        <span>{formatDate(exhibition.startDate)} - {formatDate(exhibition.endDate)}</span>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        {exhibition.artworksCount > 0 && (
                                            <div className="flex items-center gap-1">
                                                <Eye className="h-4 w-4" />
                                                <span>{exhibition.artworksCount} artworks</span>
                                            </div>
                                        )}
                                        {exhibition.totalVisitors > 0 && (
                                            <div className="flex items-center gap-1">
                                                <Users className="h-4 w-4" />
                                                <span>{exhibition.totalVisitors} visitors</span>
                                            </div>
                                        )}
                                        {exhibition.entryFee && exhibition.entryFee > 0 && (
                                            <div className="flex items-center gap-1">
                                                <DollarSign className="h-4 w-4" />
                                                <span>${exhibition.entryFee}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Contact & Links */}
                                    <div className="flex items-center gap-4 text-sm">
                                        {exhibition.websiteUrl && (
                                            <a
                                                href={exhibition.websiteUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                                Website
                                            </a>
                                        )}
                                        {exhibition.contactEmail && (
                                            <a
                                                href={`mailto:${exhibition.contactEmail}`}
                                                className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                                            >
                                                <Mail className="h-4 w-4" />
                                                Email
                                            </a>
                                        )}
                                        {exhibition.contactPhone && (
                                            <a
                                                href={`tel:${exhibition.contactPhone}`}
                                                className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                                            >
                                                <Phone className="h-4 w-4" />
                                                Call
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="flex gap-2 pt-4 border-t">
                                    <button
                                        onClick={() => handleEditExhibition(exhibition)}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 text-sm"
                                    >
                                        <Edit className="h-4 w-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteExhibition(exhibition)}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 text-sm"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Exhibition Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold">Add New Exhibition</h3>
                                <button
                                    onClick={() => {
                                        setShowAddModal(false);
                                        resetForm();
                                    }}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ×
                                </button>
                            </div>

                            <form onSubmit={handleAddExhibition} className="space-y-4">
                                {/* Basic Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Exhibition Title *
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Exhibition Type
                                        </label>
                                        <select
                                            name="exhibitionType"
                                            value={formData.exhibitionType}
                                            onChange={handleInputChange}
                                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="group">Group</option>
                                            <option value="solo">Solo</option>
                                            <option value="virtual">Virtual</option>
                                            <option value="popup">Pop-up</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                {/* Location Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Location *
                                        </label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Venue
                                        </label>
                                        <input
                                            type="text"
                                            name="venue"
                                            value={formData.venue}
                                            onChange={handleInputChange}
                                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>

                                {/* Dates */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Start Date *
                                        </label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={handleInputChange}
                                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            End Date *
                                        </label>
                                        <input
                                            type="date"
                                            name="endDate"
                                            value={formData.endDate}
                                            onChange={handleInputChange}
                                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Status and Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Status
                                        </label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="upcoming">Upcoming</option>
                                            <option value="ongoing">Ongoing</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Artworks Count
                                        </label>
                                        <input
                                            type="number"
                                            name="artworksCount"
                                            value={formData.artworksCount}
                                            onChange={handleInputChange}
                                            min="0"
                                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Total Visitors
                                        </label>
                                        <input
                                            type="number"
                                            name="totalVisitors"
                                            value={formData.totalVisitors}
                                            onChange={handleInputChange}
                                            min="0"
                                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Contact Email
                                        </label>
                                        <input
                                            type="email"
                                            name="contactEmail"
                                            value={formData.contactEmail}
                                            onChange={handleInputChange}
                                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Contact Phone
                                        </label>
                                        <input
                                            type="tel"
                                            name="contactPhone"
                                            value={formData.contactPhone}
                                            onChange={handleInputChange}
                                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>

                                {/* Additional Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Website URL
                                        </label>
                                        <input
                                            type="url"
                                            name="websiteUrl"
                                            value={formData.websiteUrl}
                                            onChange={handleInputChange}
                                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Entry Fee
                                        </label>
                                        <input
                                            type="number"
                                            name="entryFee"
                                            value={formData.entryFee}
                                            onChange={handleInputChange}
                                            step="0.01"
                                            min="0"
                                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>

                                {/* Featured checkbox */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="isFeatured"
                                        checked={formData.isFeatured}
                                        onChange={handleInputChange}
                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label className="ml-2 text-sm text-gray-700">
                                        Mark as Featured Exhibition
                                    </label>
                                </div>

                                {/* Form Actions */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {loading ? 'Creating...' : 'Create Exhibition'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowAddModal(false);
                                            resetForm();
                                        }}
                                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Exhibition Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold">Edit Exhibition</h3>
                                <button
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setEditingExhibition(null);
                                        resetForm();
                                    }}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ×
                                </button>
                            </div>

                            <form onSubmit={handleUpdateExhibition} className="space-y-4">
                                {/* Same form fields as Add Modal */}
                                {/* Basic Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Exhibition Title *
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Exhibition Type
                                        </label>
                                        <select
                                            name="exhibitionType"
                                            value={formData.exhibitionType}
                                            onChange={handleInputChange}
                                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="group">Group</option>
                                            <option value="solo">Solo</option>
                                            <option value="virtual">Virtual</option>
                                            <option value="popup">Pop-up</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                {/* Location Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Location *
                                        </label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Venue
                                        </label>
                                        <input
                                            type="text"
                                            name="venue"
                                            value={formData.venue}
                                            onChange={handleInputChange}
                                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>

                                {/* Dates */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Start Date *
                                        </label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={handleInputChange}
                                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            End Date *
                                        </label>
                                        <input
                                            type="date"
                                            name="endDate"
                                            value={formData.endDate}
                                            onChange={handleInputChange}
                                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Status and Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Status
                                        </label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="upcoming">Upcoming</option>
                                            <option value="ongoing">Ongoing</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Artworks Count
                                        </label>
                                        <input
                                            type="number"
                                            name="artworksCount"
                                            value={formData.artworksCount}
                                            onChange={handleInputChange}
                                            min="0"
                                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Total Visitors
                                        </label>
                                        <input
                                            type="number"
                                            name="totalVisitors"
                                            value={formData.totalVisitors}
                                            onChange={handleInputChange}
                                            min="0"
                                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Contact Email
                                        </label>
                                        <input
                                            type="email"
                                            name="contactEmail"
                                            value={formData.contactEmail}
                                            onChange={handleInputChange}
                                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Contact Phone
                                        </label>
                                        <input
                                            type="tel"
                                            name="contactPhone"
                                            value={formData.contactPhone}
                                            onChange={handleInputChange}
                                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>

                                {/* Additional Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Website URL
                                        </label>
                                        <input
                                            type="url"
                                            name="websiteUrl"
                                            value={formData.websiteUrl}
                                            onChange={handleInputChange}
                                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Entry Fee
                                        </label>
                                        <input
                                            type="number"
                                            name="entryFee"
                                            value={formData.entryFee}
                                            onChange={handleInputChange}
                                            step="0.01"
                                            min="0"
                                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>

                                {/* Featured checkbox */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="isFeatured"
                                        checked={formData.isFeatured}
                                        onChange={handleInputChange}
                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label className="ml-2 text-sm text-gray-700">
                                        Mark as Featured Exhibition
                                    </label>
                                </div>

                                {/* Form Actions */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {loading ? 'Updating...' : 'Update Exhibition'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowEditModal(false);
                                            setEditingExhibition(null);
                                            resetForm();
                                        }}
                                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && editingExhibition && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Delete Exhibition</h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete "{editingExhibition.title}"? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={confirmDelete}
                                    disabled={loading}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                                >
                                    {loading ? 'Deleting...' : 'Delete'}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setEditingExhibition(null);
                                    }}
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExhibitionsSection;