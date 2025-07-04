import React from 'react';
import { Edit, X, Camera, Upload, Save } from 'lucide-react';

const EditProfileModal = ({ 
  isOpen, 
  onClose, 
  editedProfile, 
  onProfileChange, 
  onSave, 
  artistProfile 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#fdf9f4]/50">
          <h2 className="text-2xl font-bold text-[#7f5539] flex items-center">
            <Edit className="mr-2" size={24} />
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="text-[#7f5539]/60 hover:text-[#7f5539] transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6 space-y-6">
          {/* Profile Images Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#7f5539] mb-4">Profile Images</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#7f5539]">Cover Image</label>
              <div className="relative h-32 rounded-lg overflow-hidden border-2 border-dashed border-[#7f5539]/30 hover:border-[#7f5539]/50 transition-colors">
                <img src={artistProfile.coverImage} alt="Cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                  <button className="bg-[#7f5539] text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                    <Camera size={16} />
                    <span>Change Cover</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#7f5539]">Profile Picture</label>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img src={artistProfile.avatar} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg" />
                  <button className="absolute -bottom-1 -right-1 bg-[#7f5539] text-white p-2 rounded-full hover:bg-[#6e4c34] transition-colors">
                    <Camera size={12} />
                  </button>
                </div>
                <div className="flex-1">
                  <button className="bg-[#7f5539]/10 text-[#7f5539] px-4 py-2 rounded-lg hover:bg-[#7f5539]/20 transition-colors font-medium flex items-center space-x-2">
                    <Upload size={16} />
                    <span>Upload New Picture</span>
                  </button>
                  <p className="text-xs text-[#7f5539]/60 mt-1">JPG, PNG or GIF. Max size 2MB.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#7f5539]">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#7f5539]">Full Name</label>
                <input
                  type="text"
                  value={editedProfile.name || ''}
                  onChange={(e) => onProfileChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-[#7f5539]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-colors"
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#7f5539]">Location</label>
                <input
                  type="text"
                  value={editedProfile.location || ''}
                  onChange={(e) => onProfileChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-[#7f5539]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-colors"
                  placeholder="City, State/Country"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#7f5539]">Email</label>
                <input
                  type="email"
                  value={editedProfile.email || ''}
                  onChange={(e) => onProfileChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-[#7f5539]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#7f5539]">Phone</label>
                <input
                  type="tel"
                  value={editedProfile.phone || ''}
                  onChange={(e) => onProfileChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-[#7f5539]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-colors"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#7f5539]">Bio</label>
              <textarea
                value={editedProfile.bio || ''}
                onChange={(e) => onProfileChange('bio', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-[#7f5539]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-colors resize-none"
                placeholder="Tell us about yourself, your artistic style, and what inspires you..."
              />
              <p className="text-xs text-[#7f5539]/60">{(editedProfile.bio || '').length}/500 characters</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#7f5539]">Online Presence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#7f5539]">Website</label>
                <input
                  type="url"
                  value={editedProfile.website || ''}
                  onChange={(e) => onProfileChange('website', e.target.value)}
                  className="w-full px-3 py-2 border border-[#7f5539]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-colors"
                  placeholder="www.yourwebsite.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#7f5539]">Instagram</label>
                <input
                  type="text"
                  value={editedProfile.instagram || ''}
                  onChange={(e) => onProfileChange('instagram', e.target.value)}
                  className="w-full px-3 py-2 border border-[#7f5539]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-colors"
                  placeholder="@yourusername"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-[#7f5539]">Twitter</label>
                <input
                  type="text"
                  value={editedProfile.twitter || ''}
                  onChange={(e) => onProfileChange('twitter', e.target.value)}
                  className="w-full px-3 py-2 border border-[#7f5539]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7f5539]/20 focus:border-[#7f5539] transition-colors"
                  placeholder="@yourusername"
                />
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#7f5539]">Privacy Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-[#fdf9f4]/30 rounded-lg">
                <div>
                  <p className="font-medium text-[#7f5539] text-sm">Public Profile</p>
                  <p className="text-xs text-[#7f5539]/60">Allow others to find and view your profile</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#7f5539]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7f5539]"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#fdf9f4]/30 rounded-lg">
                <div>
                  <p className="font-medium text-[#7f5539] text-sm">Show Contact Information</p>
                  <p className="text-xs text-[#7f5539]/60">Display email and phone on your profile</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#7f5539]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7f5539]"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#fdf9f4]/30 rounded-lg">
                <div>
                  <p className="font-medium text-[#7f5539] text-sm">Portfolio Analytics</p>
                  <p className="text-xs text-[#7f5539]/60">Allow collection of viewing statistics</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#7f5539]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7f5539]"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 p-6 border-t border-[#fdf9f4]/50">
          <button onClick={onClose} className="px-6 py-2 border border-[#7f5539]/30 text-[#7f5539] rounded-lg hover:bg-[#7f5539]/5 transition-colors font-medium">
            Cancel
          </button>
          <button onClick={onSave} className="px-6 py-2 bg-[#7f5539] text-white rounded-lg hover:bg-[#6e4c34] transition-colors font-medium flex items-center space-x-2">
            <Save size={16} />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
