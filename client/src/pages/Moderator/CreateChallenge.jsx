import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, FileText, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateChallenge = ({ onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    publishDate: '',
    publishTime: '',
    deadlineDate: '',
    deadlineTime: '',
    description: ''
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
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.publishDate) {
      newErrors.publishDate = 'Publish date is required';
    }
    
    if (!formData.publishTime) {
      newErrors.publishTime = 'Publish time is required';
    }
    
    if (!formData.deadlineDate) {
      newErrors.deadlineDate = 'Deadline date is required';
    }
    
    if (!formData.deadlineTime) {
      newErrors.deadlineTime = 'Deadline time is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    // Check if deadline is after publish date
    if (formData.publishDate && formData.publishTime && formData.deadlineDate && formData.deadlineTime) {
      const publishDateTime = new Date(`${formData.publishDate}T${formData.publishTime}`);
      const deadlineDateTime = new Date(`${formData.deadlineDate}T${formData.deadlineTime}`);
      
      if (deadlineDateTime <= publishDateTime) {
        newErrors.deadlineDate = 'Deadline must be after publish date';
        newErrors.deadlineTime = 'Deadline must be after publish time';
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
    
    setIsSubmitting(true);
    
    try {
      // Combine date and time for API submission
      const challengeData = {
        title: formData.title.trim(),
        publishDateTime: `${formData.publishDate}T${formData.publishTime}`,
        deadlineDateTime: `${formData.deadlineDate}T${formData.deadlineTime}`,
        description: formData.description.trim()
      };
      
      // Call the onSubmit prop with the challenge data
      if (onSubmit) {
        await onSubmit(challengeData);
      }
      
      // Reset form after successful submission
      setFormData({
        title: '',
        publishDate: '',
        publishTime: '',
        deadlineDate: '',
        deadlineTime: '',
        description: ''
      });
      
    } catch (error) {
      console.error('Error creating challenge:', error);
      // Handle error (you might want to show an error message to the user)
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().slice(0, 5);
    return { date, time };
  };

  const { date: currentDate, time: currentTime } = getCurrentDateTime();

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
          <h1 className="text-3xl font-bold text-amber-900">Create New Challenge</h1>
        </div>
      </div>
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="flex items-center gap-2 text-sm font-medium text-amber-800 mb-2">
            <FileText size={16} />
            Challenge Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter challenge title..."
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-transparent transition-colors ${
              errors.title ? 'border-red-500' : 'border-amber-300'
            } bg-white text-amber-900`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Publish Date and Time (same row) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="publishDate" className="flex items-center gap-2 text-sm font-medium text-amber-800 mb-2">
              <Calendar size={16} />
              Publish Date
            </label>
            <input
              type="date"
              id="publishDate"
              name="publishDate"
              value={formData.publishDate}
              onChange={handleInputChange}
              min={currentDate}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-transparent transition-colors ${
                errors.publishDate ? 'border-red-500' : 'border-amber-300'
              } bg-white text-amber-900`}
            />
            {errors.publishDate && (
              <p className="mt-1 text-sm text-red-600">{errors.publishDate}</p>
            )}
          </div>
          <div>
            <label htmlFor="publishTime" className="flex items-center gap-2 text-sm font-medium text-amber-800 mb-2">
              <Clock size={16} />
              Publish Time
            </label>
            <input
              type="time"
              id="publishTime"
              name="publishTime"
              value={formData.publishTime}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-transparent transition-colors ${
                errors.publishTime ? 'border-red-500' : 'border-amber-300'
              } bg-white text-amber-900`}
            />
            {errors.publishTime && (
              <p className="mt-1 text-sm text-red-600">{errors.publishTime}</p>
            )}
          </div>
        </div>

        {/* Deadline Date and Time (same row) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="deadlineDate" className="flex items-center gap-2 text-sm font-medium text-amber-800 mb-2">
              <Calendar size={16} />
              Deadline Date
            </label>
            <input
              type="date"
              id="deadlineDate"
              name="deadlineDate"
              value={formData.deadlineDate}
              onChange={handleInputChange}
              min={formData.publishDate || currentDate}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-transparent transition-colors ${
                errors.deadlineDate ? 'border-red-500' : 'border-amber-300'
              } bg-white text-amber-900`}
            />
            {errors.deadlineDate && (
              <p className="mt-1 text-sm text-red-600">{errors.deadlineDate}</p>
            )}
            {/* Show warning if deadline date is not after publish date */}
            {formData.publishDate && formData.deadlineDate && formData.deadlineDate <= formData.publishDate && (
              <p className="mt-1 text-sm text-red-600">Deadline date must be after publish date.</p>
            )}
          </div>
          <div>
            <label htmlFor="deadlineTime" className="flex items-center gap-2 text-sm font-medium text-amber-800 mb-2">
              <Clock size={16} />
              Deadline Time
            </label>
            <input
              type="time"
              id="deadlineTime"
              name="deadlineTime"
              value={formData.deadlineTime}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-transparent transition-colors ${
                errors.deadlineTime ? 'border-red-500' : 'border-amber-300'
              } bg-white text-amber-900`}
            />
            {errors.deadlineTime && (
              <p className="mt-1 text-sm text-red-600">{errors.deadlineTime}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="flex items-center gap-2 text-sm font-medium text-amber-800 mb-2">
            <FileText size={16} />
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter challenge description, rules, and requirements..."
            rows={6}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-800 focus:border-transparent transition-colors resize-vertical ${
              errors.description ? 'border-red-500' : 'border-amber-300'
            } bg-white text-amber-900`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
          <p className="mt-1 text-sm text-amber-700">
            {formData.description.length}/500 characters
          </p>
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
            <Send size={18} />
            {isSubmitting ? 'Creating Challenge...' : 'Create Challenge'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateChallenge;