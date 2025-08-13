import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import {
  Gift,
  ClipboardList,
  CheckCircle,
  X,
  Hourglass,
  Calendar,
  Users,
  Award
} from 'lucide-react';

const ShopSponsorships = () => {
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const campaigns = [
    {
      id: 1,
      title: 'Youth Art Festival 2025',
      description: 'An inter-university art competition aimed at promoting young talent across Sri Lanka.',
      date: '2025-08-20',
      status: 'open',
      participants: 150,
      prize: 'Rs. 50,000'
    },
    {
      id: 2,
      title: 'City Wall Mural Project',
      description: 'A public space painting event sponsored by the city council to beautify Colombo.',
      date: '2025-09-05',
      status: 'open',
      participants: 25,
      prize: 'Rs. 25,000'
    },
    {
      id: 3,
      title: 'Heritage Crafts Exhibition',
      description: 'A showcase of traditional Sri Lankan craftsmanship and cultural heritage.',
      date: '2025-10-01',
      status: 'closed',
      participants: 80,
      prize: 'Rs. 30,000'
    },
  ];

  const givenSponsorships = [
    {
      id: 1,
      campaign: 'Youth Art Festival 2025',
      type: 'Product Samples',
      description: 'Providing free branded sketchbooks and premium paint sets for participants.',
      status: 'pending',
      amount: 'Rs. 15,000',
      date: '2025-07-15'
    },
    {
      id: 2,
      campaign: 'City Wall Mural Project',
      type: 'Cash Prize',
      description: 'Offering Rs. 10,000 cash prize to the winning artist plus art supplies.',
      status: 'accepted',
      amount: 'Rs. 10,000',
      date: '2025-07-10'
    },
    {
      id: 3,
      campaign: 'Heritage Crafts Exhibition',
      type: 'Stall Setup',
      description: 'Providing an on-site promotional booth with product demonstrations.',
      status: 'rejected',
      amount: 'Rs. 8,000',
      date: '2025-06-25'
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center gap-1 text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-medium">
            <Hourglass className="w-3 h-3" /> Pending
          </span>
        );
      case 'accepted':
        return (
          <span className="flex items-center gap-1 text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-medium">
            <CheckCircle className="w-3 h-3" /> Accepted
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center gap-1 text-xs bg-red-100 text-red-800 px-3 py-1 rounded-full font-medium">
            <X className="w-3 h-3" /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const getCampaignStatusBadge = (status) => {
    return status === 'open' ? (
      <span className="flex items-center gap-1 px-3 py-1 text-xs rounded-full font-semibold bg-emerald-100 text-emerald-800">
        <CheckCircle className="w-3 h-3" />
        OPEN
      </span>
    ) : (
      <span className="flex items-center gap-1 px-3 py-1 text-xs rounded-full font-semibold bg-gray-100 text-gray-600">
        <X className="w-3 h-3" />
        CLOSED
      </span>
    );
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
        
        {/* Available Campaigns Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#5D3A00] flex items-center gap-2">
              <ClipboardList className="w-6 h-6 text-[#D87C5A]" />
              Available Campaigns
            </h2>
            <div className="text-sm text-[#5D3A00]/70">
              {campaigns.filter(c => c.status === 'open').length} Open Campaigns
            </div>
          </div>
          
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
                  {getCampaignStatusBadge(campaign.status)}
                </div>
                
                <p className="text-sm text-[#5D3A00]/70 mb-4 line-clamp-3">
                  {campaign.description}
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-[#5D3A00]">
                    <Calendar className="w-4 h-4 text-[#D87C5A]" />
                    <span className="font-medium">Event Date:</span>
                    <span>{new Date(campaign.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#5D3A00]">
                    <Users className="w-4 h-4 text-[#D87C5A]" />
                    <span className="font-medium">Participants:</span>
                    <span>{campaign.participants}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#5D3A00]">
                    <Award className="w-4 h-4 text-[#D87C5A]" />
                    <span className="font-medium">Prize Pool:</span>
                    <span className="font-bold text-[#D87C5A]">{campaign.prize}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleOfferClick(campaign)}
                  disabled={campaign.status !== 'open'}
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 transform ${
                    campaign.status === 'open'
                      ? 'bg-gradient-to-r from-[#D87C5A] to-[#5D3A00] text-white hover:shadow-lg hover:scale-105'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {campaign.status === 'open' ? 'Offer Sponsorship' : 'Campaign Closed'}
                </button>
              </div>
            ))}
          </div>
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
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {givenSponsorships.map((sponsorship, index) => (
              <div 
                key={sponsorship.id} 
                className="bg-white p-6 lg:p-8 rounded-2xl border border-[#f3f3f3] shadow-[0_0_16px_2px_rgba(93,58,0,0.15)] hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#5D3A00] flex-1 mr-3">
                    {sponsorship.campaign}
                  </h3>
                  {getStatusBadge(sponsorship.status)}
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#5D3A00]">Type:</span>
                    <span className="text-sm text-[#D87C5A] font-semibold bg-[#FFE4D6] px-3 py-1 rounded-full">
                      {sponsorship.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#5D3A00]">Amount:</span>
                    <span className="text-sm font-bold text-[#5D3A00]">{sponsorship.amount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#5D3A00]">Date:</span>
                    <span className="text-sm text-[#5D3A00]/70">{new Date(sponsorship.date).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <p className="text-sm text-[#5D3A00]/70 p-4 bg-[#FFF5E1] rounded-xl border border-[#FFE4D6]">
                  {sponsorship.description}
                </p>
              </div>
            ))}
          </div>
        </div>

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
                      {new Date(selectedCampaign.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-[#D87C5A]" />
                      {selectedCampaign.participants} participants
                    </span>
                  </div>
                </div>

                {/* Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#5D3A00] mb-2">Type of Sponsorship</label>
                    <input
                      type="text"
                      placeholder="e.g. Cash prize, Product samples, Booth space"
                      className="w-full border border-[#FFE4D6] rounded-lg px-4 py-3 focus:ring-0 outline-none focus:border-[#D87C5A] hover:border-[#D87C5A] transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-[#5D3A00] mb-2">Sponsorship Amount/Value</label>
                    <input
                      type="text"
                      placeholder="e.g. Rs. 10,000 or Product worth Rs. 5,000"
                      className="w-full border border-[#FFE4D6] rounded-lg px-4 py-3 focus:ring-0 outline-none focus:border-[#D87C5A] hover:border-[#D87C5A] transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-[#5D3A00] mb-2">Description</label>
                    <textarea
                      rows="4"
                      placeholder="Add more details about what you're offering, terms and conditions, etc."
                      className="w-full border border-[#FFE4D6] rounded-lg px-4 py-3 focus:ring-0 outline-none focus:border-[#D87C5A] hover:border-[#D87C5A] transition-colors resize-none"
                    ></textarea>
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
                    onClick={() => {
                      setShowOfferModal(false);
                      alert('Sponsorship offer submitted successfully!');
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#D87C5A] to-[#5D3A00] text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold transform hover:scale-105"
                  >
                    Submit Offer
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
