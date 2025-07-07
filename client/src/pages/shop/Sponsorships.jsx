import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import {
  Gift,
  ClipboardList,
  CheckCircle,
  X,
  Hourglass,
} from 'lucide-react';

const ShopSponsorships = () => {
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const campaigns = [
    {
      id: 1,
      title: 'Youth Art Festival 2025',
      description: 'An inter-university art competition aimed at promoting young talent.',
      date: '2025-08-20',
      status: 'open',
    },
    {
      id: 2,
      title: 'City Wall Mural Project',
      description: 'A public space painting event sponsored by the city council.',
      date: '2025-09-05',
      status: 'open',
    },
    {
      id: 3,
      title: 'Heritage Crafts Exhibition',
      description: 'A showcase of traditional Sri Lankan craftsmanship.',
      date: '2025-10-01',
      status: 'closed',
    },
  ];

  const givenSponsorships = [
    {
      id: 1,
      campaign: 'Youth Art Festival 2025',
      type: 'Product Samples',
      description: 'Providing free branded sketchbooks and paint sets.',
      status: 'pending',
    },
    {
      id: 2,
      campaign: 'City Wall Mural Project',
      type: 'Cash Prize',
      description: 'Offering LKR 10,000 to the winning artist.',
      status: 'accepted',
    },
    {
      id: 3,
      campaign: 'Heritage Crafts Exhibition',
      type: 'Stall Setup',
      description: 'Providing an on-site promotional booth.',
      status: 'rejected',
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
            <Hourglass className="w-3 h-3" /> Pending
          </span>
        );
      case 'accepted':
        return (
          <span className="flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
            <CheckCircle className="w-3 h-3" /> Accepted
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center gap-1 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
            <X className="w-3 h-3" /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const handleOfferClick = (campaign) => {
    setSelectedCampaign(campaign);
    setShowOfferModal(true);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-20 md:ml-64 flex-1 space-y-6 bg-white min-h-screen p-6 animate-fade-in">

        {/* Available Campaigns Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#5D3A00] flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-[#D87C5A]" />
            Available Campaigns
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="bg-white p-6 rounded-2xl border border-[#FFE4D6] shadow-md hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-[#5D3A00] hover:text-[#D87C5A] -">{campaign.title}</h3>
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${campaign.status === 'open' ? 'bg-[#DFFFD6] text-[#2E7D32]' : 'bg-[#FFE4D6] text-[#A67C52]'}`}>
                    {campaign.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-[#5D3A00]/70 mb-3">{campaign.description}</p>
                <p className="text-xs text-[#5D3A00]/50 mb-4">Event Date: {new Date(campaign.date).toLocaleDateString()}</p>
                <button
                  onClick={() => handleOfferClick(campaign)}
                  disabled={campaign.status !== 'open'}
                  className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                    campaign.status === 'open'
                      ? 'bg-gradient-to-r from-[#D87C5A] to-[#5D3A00] text-white hover:shadow-lg'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Offer Sponsorship
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Already Given Sponsorships */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-[#5D3A00] flex items-center gap-2">
            <Gift className="w-6 h-6 text-[#D87C5A]" />
            Already Given Sponsorships
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {givenSponsorships.map((s) => (
              <div key={s.id} className="bg-white p-5 rounded-2xl border border-[#FFE4D6] shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-md font-semibold text-[#5D3A00]">{s.campaign}</h3>
                  {getStatusBadge(s.status)}
                </div>
                <p className="text-sm text-[#5D3A00]/70 mb-1"><strong>Type:</strong> {s.type}</p>
                <p className="text-sm text-[#5D3A00]/70">{s.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Modal */}
        {showOfferModal && selectedCampaign && (
          <div className="fixed inset-0 bg-black/40 backdrop-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white max-w-xl w-full rounded-2xl border border-[#FFE4D6] overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r p-6 border-b border-[#FFE4D6] flex justify-between items-center">
                <h2 className="text-lg font-bold text-[#5D3A00] flex items-center gap-2">
                  <Gift className="w-5 h-5 text-[#D87C5A]" />
                  Sponsorship Offer for: <span className="ml-1 text-[#D87C5A]">{selectedCampaign.title}</span>
                </h2>
                <button
                  onClick={() => setShowOfferModal(false)}
                  className="text-[#D87C5A] hover:text-[#5D3A00] transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#5D3A00] mb-1">Type of Sponsorship</label>
                  <input
                    type="text"
                    placeholder="e.g. Cash prize, Product samples, Booth space"
                    className="rounded border-[#FFE4D6] focus:ring-0 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5D3A00] mb-1">Description</label>
                  <textarea
                    rows="3"
                    placeholder="Add more details about what you’re offering..."
                    className="rounded border-[#FFE4D6] focus:ring-0 outline-none"
                  ></textarea>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setShowOfferModal(false)}
                     className="flex-1 px-4 py-2 text-[#5D3A00] border border-[#FFE4D6] focus:ring-0 outline-none rounded-lg hover:bg-[#FFF5E1] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowOfferModal(false);
                      alert('Sponsorship Submitted!');
                    }}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-[#D87C5A] to-[#5D3A00] text-white rounded-lg hover:shadow-lg transition-all duration-300"
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
