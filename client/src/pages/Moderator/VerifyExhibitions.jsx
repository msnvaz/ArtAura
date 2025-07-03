import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, FileText, User, CheckCircle, MapPin, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const statusOptions = [
  'Pending',
  'Verified',
  'Rejected'
];

const VerifyExhibitions = ({ onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    createdBy: '',
    status: 'Pending',
    feePaid: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (!formData.createdBy.trim()) newErrors.createdBy = 'Created By is required';
    if (!formData.status) newErrors.status = 'Status is required';
    if (!formData.feePaid.trim()) newErrors.feePaid = 'Fee Paid is required';

    // Check if end is after start
    if (formData.startDate && formData.startTime && formData.endDate && formData.endTime) {
      const start = new Date(`${formData.startDate}T${formData.startTime}`);
      const end = new Date(`${formData.endDate}T${formData.endTime}`);
      if (end <= start) {
        newErrors.endDate = 'End must be after start';
        newErrors.endTime = 'End must be after start';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const exhibitionData = {
        ...formData,
        startDateTime: `${formData.startDate}T${formData.startTime}`,
        endDateTime: `${formData.endDate}T${formData.endTime}`
      };
      if (onSubmit) await onSubmit(exhibitionData);
      setFormData({
        title: '',
        description: '',
        location: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        createdBy: '',
        status: 'Pending',
        feePaid: ''
      });
    } catch (error) {
      // handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };
  const currentDate = getCurrentDate();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-amber-50 rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onBack ? onBack() : navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 text-amber-800 hover:text-white hover:bg-amber-800 border border-amber-800 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <h1 className="text-3xl font-bold text-amber-900">Verify Exhibition</h1>
        </div>
      </div>
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-amber-800 mb-2">
            <FileText size={16} />
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Exhibition title..."
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-transparent transition-colors ${
              errors.title ? 'border-red-500' : 'border-amber-300'
            } bg-white text-amber-900`}
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>
        {/* Description */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-amber-800 mb-2">
            <FileText size={16} />
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Exhibition description..."
            rows={4}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-transparent transition-colors resize-vertical ${
              errors.description ? 'border-red-500' : 'border-amber-300'
            } bg-white text-amber-900`}
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>
        {/* Location */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-amber-800 mb-2">
            <MapPin size={16} />
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Exhibition location..."
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-transparent transition-colors ${
              errors.location ? 'border-red-500' : 'border-amber-300'
            } bg-white text-amber-900`}
          />
          {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
        </div>
        {/* Start Date and Time */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="flex items-center gap-2 text-sm font-medium text-amber-800 mb-2">
              <Calendar size={16} />
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              min={currentDate}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-transparent transition-colors ${
                errors.startDate ? 'border-red-500' : 'border-amber-300'
              } bg-white text-amber-900`}
            />
            {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
          </div>
          <div className="flex-1">
            <label className="flex items-center gap-2 text-sm font-medium text-amber-800 mb-2">
              <Clock size={16} />
              Start Time
            </label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-transparent transition-colors ${
                errors.startTime ? 'border-red-500' : 'border-amber-300'
              } bg-white text-amber-900`}
            />
            {errors.startTime && <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>}
          </div>
        </div>
        {/* End Date and Time */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="flex items-center gap-2 text-sm font-medium text-amber-800 mb-2">
              <Calendar size={16} />
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              min={formData.startDate || currentDate}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-transparent transition-colors ${
                errors.endDate ? 'border-red-500' : 'border-amber-300'
              } bg-white text-amber-900`}
            />
            {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
          </div>
          <div className="flex-1">
            <label className="flex items-center gap-2 text-sm font-medium text-amber-800 mb-2">
              <Clock size={16} />
              End Time
            </label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-transparent transition-colors ${
                errors.endTime ? 'border-red-500' : 'border-amber-300'
              } bg-white text-amber-900`}
            />
            {errors.endTime && <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>}
          </div>
        </div>
        {/* Created By */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-amber-800 mb-2">
            <User size={16} />
            Created By
          </label>
          <input
            type="text"
            name="createdBy"
            value={formData.createdBy}
            onChange={handleInputChange}
            placeholder="Creator name or organization..."
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-transparent transition-colors ${
              errors.createdBy ? 'border-red-500' : 'border-amber-300'
            } bg-white text-amber-900`}
          />
          {errors.createdBy && <p className="mt-1 text-sm text-red-600">{errors.createdBy}</p>}
        </div>
        {/* Status */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-amber-800 mb-2">
            <CheckCircle size={16} />
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-transparent transition-colors ${
              errors.status ? 'border-red-500' : 'border-amber-300'
            } bg-white text-amber-900`}
          >
            {statusOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
        </div>
        {/* Fee Paid */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-amber-800 mb-2">
            <DollarSign size={16} />
            Fee Paid
          </label>
          <input
            type="text"
            name="feePaid"
            value={formData.feePaid}
            onChange={handleInputChange}
            placeholder="Fee paid (e.g. $100)"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-transparent transition-colors ${
              errors.feePaid ? 'border-red-500' : 'border-amber-300'
            } bg-white text-amber-900`}
          />
          {errors.feePaid && <p className="mt-1 text-sm text-red-600">{errors.feePaid}</p>}
        </div>
        {/* Submit Button */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex items-center gap-2 px-8 py-3 bg-amber-800 text-white rounded-lg font-medium transition-colors ${
              isSubmitting 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-amber-900 focus:ring-2 focus:ring-amber-800 focus:ring-offset-2'
            }`}
          >
            <CheckCircle size={18} />
            {isSubmitting ? 'Verifying...' : 'Verify Exhibition'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VerifyExhibitions;
