import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, MessageCircle, Send, Edit, Trash2, Reply } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

const PostInteractions = ({ postId, initialLikesCount = 0, initialCommentsCount = 0 }) => {
    const { token, userType } = useAuth();
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(initialLikesCount);
    const [comments, setComments] = useState([]);
    const [commentsCount, setCommentsCount] = useState(initialCommentsCount);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [replyTo, setReplyTo] = useState(null);
    const [editingComment, setEditingComment] = useState(null);
    const [editText, setEditText] = useState('');

    console.log('PostInteractions Component Props:', {
        postId,
        initialLikesCount,
        initialCommentsCount,
        token: !!token,
        userType
    });



    // Debug state changes
    useEffect(() => {
        console.log('=== COMMENTS STATE CHANGED ===');
        console.log('Comments array:', comments);
        console.log('Comments length:', comments.length);
        console.log('Comments count:', commentsCount);
        console.log('Show comments:', showComments);
    }, [comments, commentsCount, showComments]);

    // Fetch initial like status and comments
    useEffect(() => {
        console.log('PostInteractions useEffect triggered:', { postId, token, showComments });
        if (token && postId) {
            fetchLikeStatus();
            // Always fetch comments when component mounts, not just when showComments is true
            fetchComments();
        }
    }, [postId, token]);

    const fetchLikeStatus = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/posts/${postId}/like-status`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.success) {
                setLiked(response.data.liked);
                setLikesCount(response.data.likesCount);
            }
        } catch (error) {
            console.error('Error fetching like status:', error);
        }
    };

    const fetchComments = async () => {
        try {
            console.log('=== FETCH COMMENTS START ===');
            console.log('PostId:', postId);
            console.log('Token exists:', !!token);
            console.log('API URL:', `${API_URL}/api/posts/${postId}/comments`);

            const response = await axios.get(`${API_URL}/api/posts/${postId}/comments`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            console.log('Response data:', response.data);

            if (response.data.success) {
                console.log('Comments received:', response.data.comments);
                console.log('Comments count received:', response.data.commentsCount);
                console.log('Comments array length:', response.data.comments?.length);

                setComments(response.data.comments || []);
                setCommentsCount(response.data.commentsCount || 0);

                console.log('State after setting - comments length:', (response.data.comments || []).length);
            } else {
                console.error('API returned success=false:', response.data.message);
                setComments([]);
                setCommentsCount(0);
            }
            console.log('=== FETCH COMMENTS END ===');
        } catch (error) {
            console.error('=== FETCH COMMENTS ERROR ===');
            console.error('Error message:', error.message);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            console.error('Full error:', error);
            setComments([]);
            setCommentsCount(0);
        }
    };

    const handleLike = async () => {
        if (!token) return;

        try {
            setLoading(true);
            const response = await axios.post(`${API_URL}/api/posts/${postId}/like`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                setLiked(response.data.liked);
                setLikesCount(response.data.likesCount);
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async () => {
        if (!token || !newComment.trim()) return;

        try {
            setLoading(true);
            const requestBody = {
                commentText: newComment.trim()
            };

            if (replyTo) {
                requestBody.parentCommentId = replyTo.id;
            }

            console.log('Adding comment:', requestBody, 'to postId:', postId);
            const response = await axios.post(`${API_URL}/api/posts/${postId}/comments`, requestBody, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Add comment response:', response.data);
            if (response.data.success) {
                setNewComment('');
                setReplyTo(null);
                await fetchComments(); // Refresh comments
            } else {
                console.error('Failed to add comment:', response.data.message);
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            console.error('Error response:', error.response?.data);
        } finally {
            setLoading(false);
        }
    };

    const handleEditComment = async (commentId) => {
        if (!token || !editText.trim()) return;

        try {
            setLoading(true);
            const response = await axios.put(`${API_URL}/api/posts/comments/${commentId}`, {
                commentText: editText.trim()
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                setEditingComment(null);
                setEditText('');
                await fetchComments(); // Refresh comments
            }
        } catch (error) {
            console.error('Error editing comment:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!token) return;

        if (!window.confirm('Are you sure you want to delete this comment?')) {
            return;
        }

        try {
            setLoading(true);
            const response = await axios.delete(`${API_URL}/api/posts/comments/${commentId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                await fetchComments(); // Refresh comments
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d ago`;
        return date.toLocaleDateString();
    };

    const renderComment = (comment, isReply = false) => {
        console.log('Rendering individual comment:', comment);
        const isOwner = comment.userId === parseInt(localStorage.getItem('userId')) &&
            comment.userType === userType;

        return (
            <div key={comment.id} className={`${isReply ? 'ml-8 mt-2' : 'mt-4'} p-3 bg-gray-50 rounded-lg`}>
                <div className="flex items-start space-x-3">
                    <img
                        src={comment.userAvatar || 'https://via.placeholder.com/32'}
                        alt={comment.userName || 'User'}
                        className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="font-medium text-sm text-gray-900">{comment.userName || 'Anonymous'}</span>
                                <span className="text-xs text-gray-500 ml-2">{formatTimeAgo(comment.createdAt)}</span>
                            </div>
                            {isOwner && (
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => {
                                            setEditingComment(comment.id);
                                            setEditText(comment.commentText);
                                        }}
                                        className="text-gray-400 hover:text-blue-500"
                                    >
                                        <Edit className="h-3 w-3" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteComment(comment.id)}
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {editingComment === comment.id ? (
                            <div className="mt-2">
                                <textarea
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    className="w-full p-2 text-sm border border-gray-300 rounded-lg resize-none"
                                    rows="2"
                                />
                                <div className="flex items-center space-x-2 mt-2">
                                    <button
                                        onClick={() => handleEditComment(comment.id)}
                                        disabled={loading || !editText.trim()}
                                        className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 disabled:opacity-50"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditingComment(null);
                                            setEditText('');
                                        }}
                                        className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded-lg hover:bg-gray-400"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <p className="text-sm text-gray-800 mt-1">{comment.commentText}</p>
                                {!isReply && (
                                    <button
                                        onClick={() => setReplyTo(comment)}
                                        className="text-xs text-blue-500 hover:text-blue-600 mt-1 flex items-center space-x-1"
                                    >
                                        <Reply className="h-3 w-3" />
                                        <span>Reply</span>
                                    </button>
                                )}
                            </>
                        )}

                        {/* Render replies */}
                        {comment.replies && comment.replies.length > 0 && (
                            <div className="mt-2">
                                {comment.replies.map(reply => renderComment(reply, true))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="border-t pt-4 mt-4">
            {/* Like and Comment buttons */}
            <div className="flex items-center space-x-6 mb-4">
                <button
                    onClick={handleLike}
                    disabled={loading || !token}
                    className={`flex items-center space-x-2 ${liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                        } transition-colors`}
                >
                    <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
                    <span className="text-sm font-medium">{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
                </button>

                <button
                    onClick={() => {
                        console.log('Toggling comments visibility. Current showComments:', showComments);
                        setShowComments(!showComments);
                    }}
                    className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
                >
                    <MessageCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">{commentsCount} {commentsCount === 1 ? 'Comment' : 'Comments'}</span>
                </button>
            </div>

            {/* Comments section */}
            {showComments && (
                <div className="space-y-4">
                    {/* Add comment form */}
                    {token && (
                        <div className="bg-white p-4 rounded-lg border">
                            {replyTo && (
                                <div className="flex items-center justify-between mb-2 p-2 bg-blue-50 rounded">
                                    <span className="text-sm text-blue-600">Replying to {replyTo.userName}</span>
                                    <button
                                        onClick={() => setReplyTo(null)}
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                            <div className="flex space-x-3">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder={replyTo ? "Write a reply..." : "Write a comment..."}
                                    className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows="2"
                                />
                                <button
                                    onClick={handleAddComment}
                                    disabled={loading || !newComment.trim()}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Comments list */}
                    <div className="space-y-2">
                        {console.log('=== RENDERING COMMENTS SECTION ===')}
                        {console.log('Comments state:', comments)}
                        {console.log('Comments is Array:', Array.isArray(comments))}
                        {console.log('Comments length:', comments?.length)}
                        {console.log('Show comments flag:', showComments)}

                        {comments && Array.isArray(comments) && comments.length > 0 ? (
                            <div>
                                {console.log('Rendering', comments.length, 'comments')}
                                {comments.map((comment, index) => {
                                    console.log(`Rendering comment ${index}:`, comment);
                                    return renderComment(comment);
                                })}
                            </div>
                        ) : (
                            <div>
                                {console.log('No comments to display')}
                                <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostInteractions;
