import React, { useState } from 'react';
import { Calendar, MessageSquare, X, Clock, AlertCircle } from 'lucide-react';

const CommissionActionModal = ({ 
  isOpen, 
  onClose, 
  onAccept, 
  onReject, 
  request, 
  action = 'accept' // 'accept' or 'reject'
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    deadline: '',
    rejectionReason: '',
    customReason: ''
  });
  const [errors, setErrors] = useState({});

  // Predefined rejection reasons
  const rejectionReasons = [
    'Too busy with current projects',
    'Not within my artistic style',
    'Budget doesn\'t match my rates',
    'Timeline is too tight',
    'Requires skills I don\'t possess',
    'Subject matter not suitable',
    'Personal reasons',
    'Other (please specify)'
  ];

  // Get the minimum date (today) and maximum date (buyer's requested deadline)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    if (request?.deadline) {
      return request.deadline;
    }
    return '';
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (action === 'accept') {
      if (!formData.deadline) {
        newErrors.deadline = 'Please select a deadline';
      } else {
        const selectedDate = new Date(formData.deadline);
        const today = new Date();
        const buyerDeadline = new Date(request.deadline);

        if (selectedDate < today) {
          newErrors.deadline = 'Deadline cannot be in the past';
        } else if (selectedDate > buyerDeadline) {
          newErrors.deadline = 'Deadline cannot be later than buyer\'s requested date';
        }
      }
    } else if (action === 'reject') {
      if (!formData.rejectionReason) {
        newErrors.rejectionReason = 'Please select a reason for rejection';
      }
      
      if (formData.rejectionReason === 'Other (please specify)' && !formData.customReason.trim()) {
        newErrors.customReason = 'Please specify the reason';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (action === 'accept') {
        await onAccept(request.id, formData.deadline);
      } else {
        const reason = formData.rejectionReason === 'Other (please specify)' 
          ? formData.customReason 
          : formData.rejectionReason;
        await onReject(request.id, reason);
      }
      onClose();
    } catch (error) {
      console.error('Error processing commission request:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      deadline: '',
      rejectionReason: '',
      customReason: ''
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#FFE4D6] p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#7f5539] flex items-center gap-2">
                {action === 'accept' ? (
                  <>
                    <Calendar size={24} />
                    Accept Commission Request
                  </>
                ) : (
                  <>
                    <AlertCircle size={24} />
                    Reject Commission Request
                  </>
                )}
              </h2>
              <p className="text-[#7f5539]/70 mt-1">
                {action === 'accept' 
                  ? 'Set your working deadline for this commission'
                  : 'Please provide a reason for rejection'
                }
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-[#FFE4D6] rounded-lg transition-colors"
            >
              <X size={24} className="text-[#7f5539]" />
            </button>
          </div>
        </div>

        {/* Request Summary */}
        <div className="p-6 bg-[#FFF5E1] border-b border-[#FFE4D6]">
          <h3 className="text-lg font-semibold text-[#7f5539] mb-3">Commission Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-[#7f5539]">Title:</span>
              <span className="ml-2 text-[#7f5539]/80">{request.title}</span>
            </div>
            <div>
              <span className="font-medium text-[#7f5539]">Budget:</span>
              <span className="ml-2 text-[#7f5539]/80">{request.budget}</span>
            </div>
            <div>
              <span className="font-medium text-[#7f5539]">Client:</span>
              <span className="ml-2 text-[#7f5539]/80">{request.clientName}</span>
            </div>
            <div>
              <span className="font-medium text-[#7f5539]">Requested Deadline:</span>
              <span className="ml-2 text-[#7f5539]/80">
                {new Date(request.deadline).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {action === 'accept' ? (
            /* Accept form - deadline selection */
            <div>
              <label className="block text-sm font-medium text-[#7f5539] mb-2">
                <Clock className="inline w-4 h-4 mr-2" />
                Set Your Working Deadline *
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                min={getMinDate()}
                max={getMaxDate()}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] ${
                  errors.deadline ? 'border-red-500' : 'border-[#FFE4D6]'
                }`}
              />
              {errors.deadline && (
                <p className="text-red-500 text-xs mt-1">{errors.deadline}</p>
              )}
              <p className="text-sm text-[#7f5539]/60 mt-2">
                Choose a deadline between today and {new Date(request.deadline).toLocaleDateString()}
              </p>
            </div>
          ) : (
            /* Reject form - reason selection */
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#7f5539] mb-2">
                  <MessageSquare className="inline w-4 h-4 mr-2" />
                  Reason for Rejection *
                </label>
                <select
                  value={formData.rejectionReason}
                  onChange={(e) => handleInputChange('rejectionReason', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] ${
                    errors.rejectionReason ? 'border-red-500' : 'border-[#FFE4D6]'
                  }`}
                >
                  <option value="">Select a reason</option>
                  {rejectionReasons.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
                {errors.rejectionReason && (
                  <p className="text-red-500 text-xs mt-1">{errors.rejectionReason}</p>
                )}
              </div>

              {formData.rejectionReason === 'Other (please specify)' && (
                <div>
                  <label className="block text-sm font-medium text-[#7f5539] mb-2">
                    Please specify the reason *
                  </label>
                  <textarea
                    value={formData.customReason}
                    onChange={(e) => handleInputChange('customReason', e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD95A] resize-none ${
                      errors.customReason ? 'border-red-500' : 'border-[#FFE4D6]'
                    }`}
                    placeholder="Please provide a specific reason for rejection..."
                  />
                  {errors.customReason && (
                    <p className="text-red-500 text-xs mt-1">{errors.customReason}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-6 py-3 border border-[#FFE4D6] text-[#7f5539] rounded-lg hover:bg-[#FFF5E1] transition-colors font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                action === 'accept' 
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  {action === 'accept' ? (
                    <>
                      <Calendar size={20} />
                      Accept Commission
                    </>
                  ) : (
                    <>
                      <AlertCircle size={20} />
                      Reject Commission
                    </>
                  )}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommissionActionModal;
