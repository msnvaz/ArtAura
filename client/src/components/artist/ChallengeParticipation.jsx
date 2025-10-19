import React, { useState, useEffect } from 'react';
import {
    Trophy,
    Calendar,
    Users,
    Upload,
    CheckCircle,
    Clock,
    Star,
    AlertCircle,
    X,
    Camera,
    FileText
} from 'lucide-react';
import challengeParticipationApi from '../../services/challengeParticipationApi';
import { useAuth } from '../../context/AuthContext';

const ChallengeParticipation = ({ onChallengeCountChange }) => {
    const { userId, token } = useAuth();
    const [activeChallenges, setActiveChallenges] = useState([]);
    const [participations, setParticipations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSubmissionModal, setShowSubmissionModal] = useState(false);
    const [selectedChallenge, setSelectedChallenge] = useState(null);
    const [submissionForm, setSubmissionForm] = useState({
        artworkTitle: '',
        artworkDescription: '',
        artworkImage: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (userId && token) {
            fetchData();
        }
    }, [userId, token]);

    const fetchData = async () => {
        try {
            setLoading(true);
            // Fetch active challenges and artist's existing participations
            const [challengesData, participationsData] = await Promise.all([
                challengeParticipationApi.getActiveChallenges(),
                challengeParticipationApi.getArtistParticipations(userId)
            ]);

            setActiveChallenges(challengesData);
            setParticipations(participationsData || []);

            // Notify parent component about the challenge count
            if (onChallengeCountChange) {
                onChallengeCountChange(challengesData.length);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setActiveChallenges([]);
            setParticipations([]);
            // Still notify parent about count even if there's an error
            if (onChallengeCountChange) {
                onChallengeCountChange(0);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleParticipate = (challenge) => {
        // Check if artist has already participated in this challenge
        const hasParticipated = isParticipated(challenge.id);
        if (hasParticipated) {
            alert('You have already submitted your artwork for this challenge.\n\nTo maintain fairness, each artist can only submit one artwork per challenge.');
            return;
        }

        setSelectedChallenge(challenge);
        setShowSubmissionModal(true);
        setSubmissionForm({
            artworkTitle: '',
            artworkDescription: '',
            artworkImage: null
        });
        setImagePreview(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSubmissionForm(prev => ({ ...prev, artworkImage: file }));

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!submissionForm.artworkImage) {
            alert('Please select an artwork image');
            return;
        }

        try {
            setSubmitting(true);
            const participationData = {
                challengeId: selectedChallenge.id,
                artworkTitle: submissionForm.artworkTitle,
                artworkDescription: submissionForm.artworkDescription,
                artworkImage: submissionForm.artworkImage
            };

            await challengeParticipationApi.submitChallengeParticipation(participationData);

            // Refresh data
            await fetchData();

            // Close modal
            setShowSubmissionModal(false);
            setSelectedChallenge(null);

            alert('Successfully submitted your artwork for the challenge!');
        } catch (error) {
            console.error('Error submitting participation:', error);

            // Check if the error is about duplicate participation
            if (error.response && error.response.status === 400 &&
                error.response.data && error.response.data.includes('already participated')) {
                alert('You have already submitted artwork for this challenge.\n\nEach artist can only submit one artwork per challenge.');
                // Refresh data to update the UI
                await fetchData();
            } else {
                alert('Error submitting your artwork. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const isParticipated = (challengeId) => {
        return participations.some(p => p.challengeId === challengeId);
    };

    const getParticipationStatus = (challengeId) => {
        const participation = participations.find(p => p.challengeId === challengeId);
        return participation?.status || null;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'submitted': return 'text-blue-600 bg-blue-100';
            case 'under_review': return 'text-yellow-600 bg-yellow-100';
            case 'approved': return 'text-green-600 bg-green-100';
            case 'rejected': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7f5539]"></div>
                <span className="ml-3 text-[#7f5539]">Loading challenges...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#7f5539] to-[#a0785a] rounded-lg p-6 text-white">
                <h2 className="text-2xl font-bold mb-2 flex items-center">
                    <Trophy className="mr-3" />
                    Challenge Participation
                </h2>
                <p className="opacity-90">
                    Showcase your talent in exciting art challenges and compete with fellow artists
                </p>
            </div>

            {/* Active Challenges */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {activeChallenges.map((challenge) => {
                    const participated = isParticipated(challenge.id);
                    const status = getParticipationStatus(challenge.id);

                    return (
                        <div key={challenge.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-[#7f5539] mb-2">
                                    {challenge.title}
                                </h3>

                                <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                                    {challenge.description}
                                </p>

                                {/* Challenge Info */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        <span>Ends: {formatDate(challenge.deadlineDateTime)}</span>
                                    </div>

                                    {challenge.rewards && (
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Trophy className="h-4 w-4 mr-2" />
                                            <span>Rewards: {challenge.rewards}</span>
                                        </div>
                                    )}

                                    {challenge.maxParticipants && (
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Users className="h-4 w-4 mr-2" />
                                            <span>Max: {challenge.maxParticipants} participants</span>
                                        </div>
                                    )}
                                </div>

                                {/* Participation Status or Action */}
                                {participated ? (
                                    <div className="space-y-2">
                                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                                            <CheckCircle className="h-4 w-4 mr-1" />
                                            {status === 'submitted' && 'Submitted'}
                                            {status === 'under_review' && 'Under Review'}
                                            {status === 'approved' && 'Approved'}
                                            {status === 'rejected' && 'Rejected'}
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            ✓ You have already submitted to this challenge
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => handleParticipate(challenge)}
                                            className="w-full bg-[#7f5539] text-white py-2 px-4 rounded-lg hover:bg-[#6d4830] transition-colors flex items-center justify-center"
                                        >
                                            <Upload className="h-4 w-4 mr-2" />
                                            Submit Artwork
                                        </button>
                                        <p className="text-xs text-gray-500 text-center">
                                            One submission per challenge allowed
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {activeChallenges.length === 0 && (
                <div className="text-center py-12">
                    <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-600 mb-2">No Active Challenges</h3>
                    <p className="text-gray-500">Check back later for new exciting challenges!</p>
                </div>
            )}

            {/* Submission Modal */}
            {showSubmissionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-semibold text-[#7f5539]">
                                    Submit Artwork
                                </h3>
                                <button
                                    onClick={() => setShowSubmissionModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            {selectedChallenge && (
                                <div className="mb-6 p-4 bg-[#fdf9f4] rounded-lg border border-[#FFD95A]/20">
                                    <h4 className="font-medium text-[#7f5539] mb-1">
                                        {selectedChallenge.title}
                                    </h4>
                                    <p className="text-sm text-gray-600 mb-2">
                                        {selectedChallenge.description}
                                    </p>
                                    <div className="flex items-center text-xs text-[#D87C5A] bg-[#FFD95A]/10 p-2 rounded border border-[#FFD95A]/30">
                                        <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                                        <span>Important: You can only submit one artwork per challenge</span>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Artwork Image Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Artwork Image *
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                        {imagePreview ? (
                                            <div className="space-y-3">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="max-h-40 mx-auto rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setImagePreview(null);
                                                        setSubmissionForm(prev => ({ ...prev, artworkImage: null }));
                                                    }}
                                                    className="text-red-600 hover:text-red-700 text-sm"
                                                >
                                                    Remove Image
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="cursor-pointer">
                                                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                                <p className="text-gray-600 mb-2">Click to upload artwork</p>
                                                <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    required
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>

                                {/* Artwork Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Artwork Title *
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539]/50"
                                        value={submissionForm.artworkTitle}
                                        onChange={(e) => setSubmissionForm(prev => ({
                                            ...prev,
                                            artworkTitle: e.target.value
                                        }))}
                                        placeholder="Enter your artwork title"
                                        required
                                    />
                                </div>

                                {/* Artwork Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539]/50"
                                        rows={4}
                                        value={submissionForm.artworkDescription}
                                        onChange={(e) => setSubmissionForm(prev => ({
                                            ...prev,
                                            artworkDescription: e.target.value
                                        }))}
                                        placeholder="Describe your artwork and inspiration..."
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="flex space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowSubmissionModal(false)}
                                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 px-4 py-2 bg-[#7f5539] text-white rounded-lg hover:bg-[#6d4830] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                    >
                                        {submitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="h-4 w-4 mr-2" />
                                                Submit Artwork
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChallengeParticipation;
