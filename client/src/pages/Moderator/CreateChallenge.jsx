import { ArrowLeft, Calendar, Clock, FileText, Send } from 'lucide-react';
import { useState } from 'react';
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
  const [requestSponsorship, setRequestSponsorship] = useState(false);
  const [sponsorshipType, setSponsorshipType] = useState('');
  const [sponsorshipMessage, setSponsorshipMessage] = useState('');
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
    if (!formData.publishDate) newErrors.publishDate = 'Publish date is required';
    if (!formData.publishTime) newErrors.publishTime = 'Publish time is required';
    if (!formData.deadlineDate) newErrors.deadlineDate = 'Deadline date is required';
    if (!formData.deadlineTime) newErrors.deadlineTime = 'Deadline time is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';

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

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const challengeData = {
        title: formData.title.trim(),
        publishDateTime: `${formData.publishDate}T${formData.publishTime}`,
        deadlineDateTime: `${formData.deadlineDate}T${formData.deadlineTime}`,
        description: formData.description.trim(),
        sponsorshipRequest: requestSponsorship
          ? {
              type: sponsorshipType,
              message: sponsorshipMessage
            }
          : null
      };

      if (onSubmit) await onSubmit(challengeData);

      setFormData({
        title: '',
        publishDate: '',
        publishTime: '',
        deadlineDate: '',
        deadlineTime: '',
        description: ''
      });
      setRequestSponsorship(false);
      setSponsorshipType('');
      setSponsorshipMessage('');

    } catch (error) {
      // handle error
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

  const { date: currentDate } = getCurrentDateTime();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#fdf9f4] rounded-lg shadow-lg">
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
          <label className="flex items-center gap-2 text-sm font-medium text-amber-800 mb-2">
            <FileText size={16} />
            Challenge Title
          </label>
          <input
            type="text"
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
        {/* Publish Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-amber-800 mb-2">
              <Calendar size={16} />
              Publish Date
            </label>
            <input
              type="date"
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
            <label className="flex items-center gap-2 text-sm font-medium text-amber-800 mb-2">
              <Clock size={16} />
              Publish Time
            </label>
            <input
              type="time"
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
        {/* Deadline Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-amber-800 mb-2">
              <Calendar size={16} />
              Deadline Date
            </label>
            <input
              type="date"
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
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-amber-800 mb-2">
              <Clock size={16} />
              Deadline Time
            </label>
            <input
              type="time"
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
          <label className="flex items-center gap-2 text-sm font-medium text-amber-800 mb-2">
            <FileText size={16} />
            Description
          </label>
          <textarea
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
        {/* Sponsorship Request Section */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <label className="flex items-center gap-2 text-amber-800 font-medium mb-2">
            <input
              type="checkbox"
              checked={requestSponsorship}
              onChange={e => setRequestSponsorship(e.target.checked)}
              className="accent-amber-800 h-4 w-4"
            />
            Request Sponsorships for this Challenge?
          </label>
          {requestSponsorship && (
            <div className="space-y-4 mt-2">
              <div>
                <label className="block text-sm font-medium text-amber-800 mb-1">Expected Sponsorship Type</label>
                <select
                  value={sponsorshipType}
                  onChange={e => setSponsorshipType(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg bg-white text-amber-900 border-amber-300 focus:ring-2 focus:ring-amber-800"
                >
                  <option value="">Select type...</option>
                  <option value="Monetary">Monetary</option>
                  <option value="Gift">Gift</option>
                  <option value="Voucher">Voucher</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-800 mb-1">Message to Shops (optional)</label>
                <textarea
                  value={sponsorshipMessage}
                  onChange={e => setSponsorshipMessage(e.target.value)}
                  rows={3}
                  placeholder="Describe what kind of sponsorship you expect, or any special notes..."
                  className="w-full px-4 py-2 border rounded-lg bg-white text-amber-900 border-amber-300 focus:ring-2 focus:ring-amber-800"
                />
              </div>
            </div>
          )}
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