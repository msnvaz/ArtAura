import React, { useState } from 'react';
import { X, Clock, DollarSign, Calendar, Palette, Target, MessageCircle, Save } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const AcceptOrderModal = ({ order, isOpen, onClose, onSuccess }) => {
  const [estimatedDays, setEstimatedDays] = useState('');
  const [artistNotes, setArtistNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const { showSuccess, showError } = useNotification();

  const handleAccept = async () => {
    if (!estimatedDays || isNaN(estimatedDays) || parseInt(estimatedDays) <= 0) {
      showError('Please enter a valid number of days');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:8081/api/orders/${order.orderId}/accept`,
        {
          estimatedDays: parseInt(estimatedDays),
          artistNotes: artistNotes
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data && response.data.success) {
        showSuccess('Order accepted successfully!');
        onSuccess();
        onClose();
      } else {
        showError('Failed to accept order');
      }
    } catch (error) {
      console.error('Error accepting order:', error);
      showError('Error accepting order: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-[#7f5539]">Accept Order</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h4 className="font-medium text-[#7f5539] mb-2">{order.title}</h4>
            <p className="text-sm text-[#7f5539]/70 mb-4">From: {order.buyerName}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#7f5539] mb-2">
                Estimated Completion Days *
              </label>
              <input
                type="number"
                value={estimatedDays}
                onChange={(e) => setEstimatedDays(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539]"
                placeholder="Enter number of days"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#7f5539] mb-2">
                Notes for Customer (Optional)
              </label>
              <textarea
                value={artistNotes}
                onChange={(e) => setArtistNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] resize-none"
                rows="3"
                placeholder="Add any additional notes or requirements..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[#7f5539] border border-[#7f5539] rounded-lg hover:bg-[#7f5539]/5 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleAccept}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{loading ? 'Accepting...' : 'Accept Order'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const RejectOrderModal = ({ order, isOpen, onClose, onSuccess }) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const { showSuccess, showError } = useNotification();

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      showError('Please provide a rejection reason');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:8081/api/orders/${order.orderId}/reject`,
        rejectionReason,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'text/plain'
          }
        }
      );

      if (response.data && response.data.success) {
        showSuccess('Order rejected successfully');
        onSuccess();
        onClose();
      } else {
        showError('Failed to reject order');
      }
    } catch (error) {
      console.error('Error rejecting order:', error);
      showError('Error rejecting order: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-[#7f5539]">Reject Order</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h4 className="font-medium text-[#7f5539] mb-2">{order.title}</h4>
            <p className="text-sm text-[#7f5539]/70 mb-4">From: {order.buyerName}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#7f5539] mb-2">
              Reason for Rejection *
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] resize-none"
              rows="4"
              placeholder="Please explain why you're rejecting this order..."
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[#7f5539] border border-[#7f5539] rounded-lg hover:bg-[#7f5539]/5 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleReject}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <X className="h-4 w-4" />
            )}
            <span>{loading ? 'Rejecting...' : 'Reject Order'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export { AcceptOrderModal, RejectOrderModal };
