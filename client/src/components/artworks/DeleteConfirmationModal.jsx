import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { formatLKR } from '../../util/currency';

const DeleteConfirmationModal = ({
    isOpen,
    artwork,
    onConfirm,
    onCancel,
    isLoading = false
}) => {
    // Get API URL from environment variable
    const API_URL = import.meta.env.VITE_API_URL;

    if (!isOpen || !artwork) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-red-600 flex items-center">
                        <AlertTriangle className="mr-2" size={24} />
                        Delete Artwork
                    </h2>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={isLoading}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                    <div className="text-center space-y-4">
                        {/* Warning Icon */}
                        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                            <Trash2 className="h-8 w-8 text-red-600" />
                        </div>

                        {/* Warning Message */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Are you sure you want to delete this artwork?
                            </h3>
                            <p className="text-gray-600 mb-4">
                                You are about to permanently delete:
                            </p>
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                <div className="flex items-center space-x-3">
                                    {artwork.imageUrl && (
                                        <img
                                            src={`${API_URL}${artwork.imageUrl}`}
                                            alt={artwork.title}
                                            className="w-16 h-16 rounded-lg object-cover"
                                        />
                                    )}
                                    <div className="text-left">
                                        <h4 className="font-semibold text-gray-900">{artwork.title}</h4>
                                        <p className="text-sm text-gray-600">{artwork.medium}</p>
                                        <p className="text-sm text-gray-600">{formatLKR(artwork.price)}</p>
                                    </div>
                                </div>
                            </div>
                            <p className="text-red-600 font-medium">
                                This action cannot be undone!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center space-x-2"
                        disabled={isLoading}
                    >
                        <Trash2 className="h-4 w-4" />
                        <span>{isLoading ? 'Deleting...' : 'Delete Artwork'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;