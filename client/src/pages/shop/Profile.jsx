import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  UserX,
  Camera,
  Save,
  X,
  AlertTriangle,
  Shield,
  Bell,
  Eye,
  EyeOff,
  Palette,
  Award,
  Star
} from 'lucide-react';

const ProfileDetails = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Sarah Johnson',
    email: 'sarah.johnson@artshop.com',
    phone: '+1 (555) 123-4567',
    address: '123 Art Street, Creative City, CA 90210',
    joinDate: 'March 15, 2022',
    role: 'Shop Owner',
    bio: 'Passionate about bringing art supplies to creative minds. Running this shop for over 5 years with dedication to quality and customer satisfaction.',
    avatar: '/src/assets/user.png'
  });

  const [editData, setEditData] = useState(profileData);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(profileData);
  };

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleDeactivate = () => {
    setShowDeactivateModal(false);
    // Handle deactivation logic here
    alert('Profile deactivated successfully');
  };

  const stats = [
    {
      label: 'Total Orders',
      value: '1,247',
      icon: Award,
      color: 'bg-[#D87C5A]',
      textColor: 'text-[#D87C5A]'
    },
    {
      label: 'Customer Rating',
      value: '4.9/5',
      icon: Star,
      color: 'bg-[#FFD95A]',
      textColor: 'text-[#bfa100]'
    },
    {
      label: 'Years Active',
      value: '5+',
      icon: Calendar,
      color: 'bg-[#66bb6a]',
      textColor: 'text-[#2e7d32]'
    }
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-20 md:ml-64 flex-1 space-y-6 bg-white min-h-screen p-6 animate-fade-in">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div>
            
          </div>
          <div className="flex gap-3">
            {!isEditing ? (
              <>
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#D87C5A] to-[#5D3A00] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
                <button
                  onClick={() => setShowDeactivateModal(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <UserX className="w-4 h-4" />
                  Deactivate
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#66bb6a] to-[#2e7d32] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 text-[#5D3A00] border border-[#FFE4D6] focus:ring-0 outline-none rounded-lg hover:bg-[#FFF5E1] s px-6 py-3   transform hover:scale-105 transition-all duration-300"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card (Left Column) */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-[#f3f3f3] bg-white shadow-[0_0_16px_2px_rgba(93,58,0,0.15)] p-6 transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl animate-fade-in">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <img
                    src={profileData.avatar}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-[#FFD95A] shadow-lg"
                  />
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-[#D87C5A] text-white p-2 rounded-full hover:bg-[#c06949] transition shadow-md">
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <h2 className="text-xl font-bold text-[#5D3A00] mb-1">{profileData.name}</h2>
                <p className="text-[#D87C5A] font-medium mb-4">{profileData.role}</p>
                
                {/* Stats Cards */}
                <div className="space-y-3 mt-6">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <div 
                        key={index} 
                        className={`rounded-xl border border-[#f3f3f3] bg-white p-4 shadow-[0_0_16px_2px_rgba(93,58,0,0.15)] transition-all duration-500 hover:scale-[1.02]`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-xl ${stat.color} shadow-lg`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-sm font-medium text-[#5D3A00]">{stat.label}</span>
                          </div>
                          <span className={`text-lg font-bold ${stat.textColor}`}>{stat.value}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Two Sections) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Card */}
            <div className="rounded-2xl border border-[#FFE4D6] bg-white shadow-xl p-6 animate-fade-in">
              <h3 className="text-xl font-bold text-[#5D3A00] mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-[#D87C5A]" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#5D3A00]">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                      className="w-full p-3 border border-[#FFE4D6] rounded-lg focus:outline-none focus:ring-0 focus:border-[#D87C5A] hover:border-[#D87C5A] text-[#5D3A00]"
                    />
                  ) : (
                    <p className="p-3 bg-[#FFF5E1] rounded-lg text-[#5D3A00]">{profileData.name}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#5D3A00]">Email Address</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({...editData, email: e.target.value})}
                      className="w-full p-3 border border-[#FFE4D6] rounded-lg focus:outline-none focus:ring-0 focus:border-[#D87C5A] hover:border-[#D87C5A] text-[#5D3A00]"
                    />
                  ) : (
                    <p className="p-3 bg-[#FFF5E1] rounded-lg text-[#5D3A00] flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#D87C5A]" />
                      {profileData.email}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#5D3A00]">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => setEditData({...editData, phone: e.target.value})}
                      className="w-full p-3 border border-[#FFE4D6] rounded-lg focus:outline-none focus:ring-0 focus:border-[#D87C5A] hover:border-[#D87C5A] text-[#5D3A00]"
                    />
                  ) : (
                    <p className="p-3 bg-[#FFF5E1] rounded-lg text-[#5D3A00] flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#D87C5A]" />
                      {profileData.phone}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#5D3A00]">Join Date</label>
                  <p className="p-3 bg-[#FFE4D6] rounded-lg text-[#5D3A00] flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#D87C5A]" />
                    {profileData.joinDate}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <label className="text-sm font-medium text-[#5D3A00]">Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.address}
                    onChange={(e) => setEditData({...editData, address: e.target.value})}
                    className="w-full p-3 border border-[#FFE4D6] rounded-lg focus:outline-none focus:ring-0 focus:border-[#D87C5A] hover:border-[#D87C5A] text-[#5D3A00]"
                  />
                ) : (
                  <p className="p-3 bg-[#FFF5E1] rounded-lg text-[#5D3A00] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#D87C5A]" />
                    {profileData.address}
                  </p>
                )}
              </div>
              
              <div className="mt-4 space-y-2">
                <label className="text-sm font-medium text-[#5D3A00]">Bio</label>
                {isEditing ? (
                  <textarea
                    value={editData.bio}
                    onChange={(e) => setEditData({...editData, bio: e.target.value})}
                    rows={3}
                    className="w-full p-3 border border-[#FFE4D6] rounded-lg focus:outline-none focus:ring-0 focus:border-[#D87C5A] hover:border-[#D87C5A] text-[#5D3A00] resize-none"
                  />
                ) : (
                  <p className="p-3 bg-[#FFF5E1] rounded-lg text-[#5D3A00]">{profileData.bio}</p>
                )}
              </div>
            </div>

            {/* Account Settings Card */}
            <div className="rounded-2xl border border-[#FFE4D6] bg-white shadow-xl p-6 animate-fade-in">
              <h3 className="text-xl font-bold text-[#5D3A00] mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#D87C5A]" />
                Account Settings
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#FFF5E1] rounded-lg border border-[#FFE4D6] hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-[#D87C5A]" />
                    <div>
                      <p className="font-medium text-[#5D3A00]">Email Notifications</p>
                      <p className="text-sm text-[#5D3A00] opacity-70">Receive updates about orders and promotions</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D87C5A]"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-[#FFE4D6] rounded-lg border border-[#FFE4D6] hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-[#D87C5A]" />
                    <div>
                      <p className="font-medium text-[#5D3A00]">Profile Visibility</p>
                      <p className="text-sm text-[#5D3A00] opacity-70">Control who can see your profile information</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D87C5A]"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deactivate Modal */}
        {showDeactivateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="bg-gradient-to-r p-6 rounded-t-2xl border-b border-[#FFE4D6]">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-[#5D3A00] flex items-center gap-2">
                    <AlertTriangle className="w-6 h-6 text-[#D87C5A]" />
                    Deactivate Account
                  </h2>
                  <button
                    onClick={() => setShowDeactivateModal(false)}
                    className="text-[#5D3A00] hover:text-[#D87C5A] transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <p className="text-[#5D3A00] mb-6">
                  Are you sure you want to deactivate your account? This action will temporarily disable your profile and you won't be able to access the dashboard until you reactivate it.
                </p>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeactivateModal(false)}
                    className="flex-1 px-4 py-2 text-[#5D3A00] border border-[#FFE4D6] focus:ring-0 outline-none rounded-lg hover:bg-[#FFF5E1] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeactivate}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                  >
                    Deactivate
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileDetails;