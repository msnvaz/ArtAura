import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import {
  Gift,
  ClipboardList,
  CheckCircle,
  X,
  Calendar,
  Users,
  Award,
  Loader2
} from 'lucide-react';

// Use environment variable for API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

const ShopSponsorships = () => {
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [givenSponsorships, setGivenSponsorships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [discountPercentage, setDiscountPercentage] = useState(15);
  const [shopData, setShopData] = useState(null);

  // Fetch shop data from localStorage
  useEffect(() => {
    const userId = localStorage.getItem('userId'); // shop_id
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    console.log('🔍 Auth check - userId:', userId, 'token:', token ? 'present' : 'missing', 'role:', role);
    
    if (userId) {
      setShopData({ shop_id: parseInt(userId), token, role });
    }
  }, []);

  // Fetch challenges requesting sponsorship
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        console.log('🔍 Fetching challenges from:', `${API_BASE_URL}/api/sponsorships/challenges/active`);
        const response = await axios.get(`${API_BASE_URL}/api/sponsorships/challenges/active`);
        console.log('✅ API Response Status:', response.status);
        console.log('✅ API Response Data:', response.data);
        console.log('✅ Number of challenges:', response.data.length);
        setCampaigns(response.data);
        setLoading(false);
      } catch (error) {
        console.error('❌ Error fetching challenges:', error);
        console.error('❌ Error details:', error.response?.data || error.message);
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  // Fetch given sponsorships
  useEffect(() => {
    const fetchGivenSponsorships = async () => {
      if (shopData?.shop_id) {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/sponsorships/offers/shop/${shopData.shop_id}`);
          setGivenSponsorships(response.data);
        } catch (error) {
          console.error('Error fetching given sponsorships:', error);
        }
      }
    };

    fetchGivenSponsorships();
  }, [shopData]);

  const handleOfferSponsorship = async () => {
    if (!shopData?.shop_id) {
      alert('Please log in to offer sponsorship');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/sponsorships/offers`, {
        shopId: shopData.shop_id,
        challengeId: selectedCampaign.id,
        discountPercentage: discountPercentage
      });

      // Show success with discount code
      alert(`Sponsorship successful!\n\nYour Discount Code: ${response.data.discountCode}\nDiscount: ${discountPercentage}%\n\nChallenge winners can use this code at your shop!`);
      
      setShowOfferModal(false);
      
      // Refresh data
      const challengesResponse = await axios.get(`${API_BASE_URL}/api/sponsorships/challenges/active`);
      setCampaigns(challengesResponse.data);
      
      const offersResponse = await axios.get(`${API_BASE_URL}/api/sponsorships/offers/shop/${shopData.shop_id}`);
      setGivenSponsorships(offersResponse.data);
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create sponsorship';
      alert(errorMessage);
    }
  };

  const handleOfferClick = (campaign) => {
    setSelectedCampaign(campaign);
    setShowOfferModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Main Container - Aligned with navbar */}
      <div className="pt-4 px-1 sm:px-2 lg:px-4 max-w-full mx-0">
        
        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 text-[#D87C5A] animate-spin" />
          </div>
        ) : !shopData?.shop_id ? (
          /* Not Logged In State */
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="bg-white p-8 rounded-2xl border border-[#f3f3f3] shadow-lg text-center max-w-md">
              <Gift className="w-16 h-16 text-[#D87C5A] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#5D3A00] mb-2">Shop Login Required</h2>
              <p className="text-[#5D3A00]/70 mb-6">
                Please log in to your shop account to view and offer sponsorships to challenges.
              </p>
              <a 
                href="/login" 
                className="inline-block py-3 px-8 rounded-xl font-semibold text-sm transition-all duration-300 transform bg-gradient-to-r from-[#D87C5A] to-[#5D3A00] text-white hover:shadow-lg hover:scale-105"
              >
                Go to Login
              </a>
            </div>
          </div>
        ) : (
          <>
            {/* Available Campaigns Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#5D3A00] flex items-center gap-2">
                  <ClipboardList className="w-6 h-6 text-[#D87C5A]" />
                  Available Campaigns
                </h2>
                <div className="text-sm text-[#5D3A00]/70">
                  {campaigns.length} Campaigns Requesting Sponsorship
                </div>
              </div>
              
              {campaigns.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-[#f3f3f3] text-center">
                  <ClipboardList className="w-12 h-12 text-[#D87C5A] mx-auto mb-4 opacity-50" />
                  <p className="text-[#5D3A00]/70">No campaigns requesting sponsorship at the moment</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                  {campaigns.map((campaign, index) => (
                    <div 
                      key={campaign.id} 
                      className="bg-white p-6 lg:p-8 rounded-2xl border border-[#f3f3f3] shadow-[0_0_16px_2px_rgba(93,58,0,0.15)] hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-[#5D3A00] hover:text-[#D87C5A] transition-colors mb-2 line-clamp-2">
                            {campaign.title}
                          </h3>
                        </div>
                        <span className="flex items-center gap-1 px-3 py-1 text-xs rounded-full font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle className="w-3 h-3" />
                          OPEN
                        </span>
                      </div>
                      
                      <p className="text-sm text-[#5D3A00]/70 mb-4 line-clamp-3">
                        {campaign.description}
                      </p>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-2 text-sm text-[#5D3A00]">
                          <Calendar className="w-4 h-4 text-[#D87C5A]" />
                          <span className="font-medium">Deadline:</span>
                          <span>{new Date(campaign.deadlineDateTime).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#5D3A00]">
                          <Users className="w-4 h-4 text-[#D87C5A]" />
                          <span className="font-medium">Max Participants:</span>
                          <span>{campaign.maxParticipants}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#5D3A00]">
                          <Award className="w-4 h-4 text-[#D87C5A]" />
                          <span className="font-medium">Rewards:</span>
                          <span className="font-bold text-[#D87C5A]">{campaign.rewards}</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleOfferClick(campaign)}
                        className="w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 transform bg-gradient-to-r from-[#D87C5A] to-[#5D3A00] text-white hover:shadow-lg hover:scale-105"
                      >
                        Offer Sponsorship
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Already Given Sponsorships Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#5D3A00] flex items-center gap-2">
                  <Gift className="w-6 h-6 text-[#D87C5A]" />
                  Given Sponsorships
                </h2>
                <div className="text-sm text-[#5D3A00]/70">
                  {givenSponsorships.length} Total Sponsorships
                </div>
              </div>
              
              {givenSponsorships.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-[#f3f3f3] text-center">
                  <Gift className="w-12 h-12 text-[#D87C5A] mx-auto mb-4 opacity-50" />
                  <p className="text-[#5D3A00]/70">You haven't given any sponsorships yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  {givenSponsorships.map((sponsorship, index) => (
                    <div 
                      key={sponsorship.id} 
                      className="bg-white p-6 lg:p-8 rounded-2xl border border-[#f3f3f3] shadow-[0_0_16px_2px_rgba(93,58,0,0.15)] hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-[#5D3A00] flex-1 mr-3">
                          {sponsorship.challengeTitle}
                        </h3>
                        <span className="flex items-center gap-1 text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-medium">
                          <CheckCircle className="w-3 h-3" /> Active
                        </span>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-[#5D3A00]">Discount Code:</span>
                          <span className="text-sm text-white bg-gradient-to-r from-[#D87C5A] to-[#5D3A00] px-4 py-1 rounded-lg font-bold tracking-wider">
                            {sponsorship.discountCode}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-[#5D3A00]">Discount:</span>
                          <span className="text-sm font-bold text-[#D87C5A]">{sponsorship.discountPercentage}% OFF</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-[#5D3A00]">Created:</span>
                          <span className="text-sm text-[#5D3A00]/70">{new Date(sponsorship.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-[#FFF5E1] rounded-xl border border-[#FFE4D6]">
                        <p className="text-sm text-[#5D3A00]/70">
                          Winners of this challenge can use discount code <span className="font-bold text-[#D87C5A]">{sponsorship.discountCode}</span> at your shop to get {sponsorship.discountPercentage}% off their purchase.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Sponsorship Offer Modal */}
        {showOfferModal && selectedCampaign && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white max-w-2xl w-full rounded-2xl border border-[#f3f3f3] overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-[#FFF5E1] to-[#FFE4D6] p-6 lg:p-8 border-b border-[#FFE4D6] flex justify-between items-center">
                <h2 className="text-xl font-bold text-[#5D3A00] flex items-center gap-2">
                  <Gift className="w-6 h-6 text-[#D87C5A]" />
                  Sponsorship Offer
                </h2>
                <button
                  onClick={() => setShowOfferModal(false)}
                  className="text-[#D87C5A] hover:text-[#5D3A00] transition-colors p-2 hover:bg-white/50 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 lg:p-8 space-y-6">
                {/* Campaign Info */}
                <div className="bg-[#FFF5E1] p-4 rounded-xl border border-[#FFE4D6]">
                  <h3 className="font-semibold text-[#5D3A00] mb-2">Campaign: {selectedCampaign.title}</h3>
                  <p className="text-sm text-[#5D3A00]/70 mb-3">{selectedCampaign.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-[#D87C5A]" />
                      {new Date(selectedCampaign.deadlineDateTime).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-[#D87C5A]" />
                      {selectedCampaign.maxParticipants} max participants
                    </span>
                  </div>
                </div>

                {/* Discount Percentage Selection */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#5D3A00] mb-3">
                      Choose Discount Percentage for Challenge Winners
                    </label>
                    <p className="text-sm text-[#5D3A00]/70 mb-4">
                      Winners will receive a unique discount code to use at your shop. Select the discount percentage you'd like to offer.
                    </p>
                    
                    <div className="grid grid-cols-3 gap-3">
                      {[10, 15, 20, 25, 30].map((percent) => (
                        <button
                          key={percent}
                          onClick={() => setDiscountPercentage(percent)}
                          className={`py-4 px-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                            discountPercentage === percent
                              ? 'bg-gradient-to-r from-[#D87C5A] to-[#5D3A00] text-white shadow-lg scale-105'
                              : 'bg-[#FFF5E1] text-[#5D3A00] border-2 border-[#FFE4D6] hover:border-[#D87C5A]'
                          }`}
                        >
                          {percent}%
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          const custom = prompt('Enter custom discount percentage (1-50):', '35');
                          if (custom && !isNaN(custom) && custom >= 1 && custom <= 50) {
                            setDiscountPercentage(parseInt(custom));
                          }
                        }}
                        className={`py-4 px-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                          ![10, 15, 20, 25, 30].includes(discountPercentage)
                            ? 'bg-gradient-to-r from-[#D87C5A] to-[#5D3A00] text-white shadow-lg scale-105'
                            : 'bg-[#FFF5E1] text-[#5D3A00] border-2 border-[#FFE4D6] hover:border-[#D87C5A]'
                        }`}
                      >
                        {![10, 15, 20, 25, 30].includes(discountPercentage) ? `${discountPercentage}%` : 'Custom'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-sm text-amber-800">
                      <span className="font-semibold">Note:</span> A unique discount code will be automatically generated when you submit. 
                      Winners can use this code at your shop to receive <span className="font-bold">{discountPercentage}% OFF</span> their purchase.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setShowOfferModal(false)}
                    className="flex-1 px-6 py-3 text-[#5D3A00] border border-[#FFE4D6] rounded-xl hover:bg-[#FFF5E1] transition-all duration-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleOfferSponsorship}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#D87C5A] to-[#5D3A00] text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold transform hover:scale-105"
                  >
                    Confirm Sponsorship ({discountPercentage}% OFF)
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

export default ShopSponsorships;
