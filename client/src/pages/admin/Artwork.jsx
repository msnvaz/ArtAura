import React, { useState } from 'react';
import { 
  Image, 
  Search,
  Filter,
  Eye,
  UserCheck,
  Ban,
  ShieldAlert,
  AlertTriangle,
  MoreVertical,
  X,
  Plus
} from 'lucide-react';

const ArtworkManagement = () => {
  const [artworkSearchTerm, setArtworkSearchTerm] = useState('');
  const [artworkFilterStatus, setArtworkFilterStatus] = useState('all');
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [showArtworkModal, setShowArtworkModal] = useState(false);

  // Mock data for artworks
  const [artworks, setArtworks] = useState([
    { 
      id: 1, 
      title: 'Digital Sunset', 
      artist: 'Alex Johnson', 
      category: 'Digital Art', 
      price: 1250, 
      status: 'Approved', 
      uploadDate: '2024-01-20', 
      views: 1543, 
      likes: 89, 
      blocked: false,
      imageUrl: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    },
    { 
      id: 2, 
      title: 'Abstract Harmony', 
      artist: 'Elena Rodriguez', 
      category: 'Painting', 
      price: 2100, 
      status: 'Pending', 
      uploadDate: '2024-02-15', 
      views: 892, 
      likes: 45, 
      blocked: false,
      imageUrl: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    },
    { 
      id: 3, 
      title: 'Urban Photography', 
      artist: 'David Chen', 
      category: 'Photography', 
      price: 850, 
      status: 'Approved', 
      uploadDate: '2024-03-01', 
      views: 2341, 
      likes: 156, 
      blocked: false,
      imageUrl: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    },
    { 
      id: 4, 
      title: 'Controversial Art', 
      artist: 'Sarah Wilson', 
      category: 'Mixed Media', 
      price: 3200, 
      status: 'Flagged', 
      uploadDate: '2024-02-28', 
      views: 567, 
      likes: 12, 
      blocked: true,
      imageUrl: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    },
    { 
      id: 5, 
      title: 'Nature\'s Beauty', 
      artist: 'Lisa Thompson', 
      category: 'Landscape', 
      price: 1750, 
      status: 'Approved', 
      uploadDate: '2024-01-25', 
      views: 3421, 
      likes: 234, 
      blocked: false,
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    }
  ]);

  const handleBlockArtwork = (artworkId) => {
    setArtworks(artworks.map(artwork => 
      artwork.id === artworkId ? { 
        ...artwork, 
        blocked: !artwork.blocked, 
        status: artwork.blocked ? 'Approved' : 'Flagged' 
      } : artwork
    ));
  };

  const filteredArtworks = artworks.filter(artwork => {
    const matchesSearch = artwork.title.toLowerCase().includes(artworkSearchTerm.toLowerCase()) ||
                         artwork.artist.toLowerCase().includes(artworkSearchTerm.toLowerCase()) ||
                         artwork.category.toLowerCase().includes(artworkSearchTerm.toLowerCase());
    const matchesStatus = artworkFilterStatus === 'all' || artwork.status.toLowerCase() === artworkFilterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Artwork management stats
  const artworkStats = [
    { 
      label: 'Total Artworks', 
      value: artworks.length.toLocaleString(), 
      icon: Image, 
      color: '#D87C5A',
      change: '+18%',
      changeType: 'positive'
    },
    { 
      label: 'Approved', 
      value: artworks.filter(a => a.status === 'Approved').length.toLocaleString(), 
      icon: UserCheck, 
      color: '#5D9CDB',
      change: '+12%',
      changeType: 'positive'
    },
    { 
      label: 'Pending Review', 
      value: artworks.filter(a => a.status === 'Pending').length.toLocaleString(), 
      icon: AlertTriangle, 
      color: '#FFD95A',
      change: '+5%',
      changeType: 'neutral'
    },
    { 
      label: 'Flagged Content', 
      value: artworks.filter(a => a.status === 'Flagged').length.toLocaleString(), 
      icon: ShieldAlert, 
      color: '#E74C3C',
      change: '-25%',
      changeType: 'positive'
    }
  ];

  // Artwork Details Modal
  const ArtworkModal = () => {
    if (!showArtworkModal || !selectedArtwork) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 max-h-90vh overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold" style={{color: '#5D3A00'}}>Artwork Details</h3>
              <button
                onClick={() => setShowArtworkModal(false)}
                className="p-2 rounded-lg transition-colors"
                style={{backgroundColor: '#FFE4D6', color: '#5D3A00'}}
                onMouseOver={(e) => e.target.style.backgroundColor = '#FFD95A'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#FFE4D6'}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Artwork Image */}
              <div>
                <img 
                  src={selectedArtwork.imageUrl} 
                  alt={selectedArtwork.title}
                  className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-sm"
                />
                <div className="mt-4 flex items-center justify-between">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    selectedArtwork.status === 'Approved' ? 'text-green-800 bg-green-100' :
                    selectedArtwork.status === 'Pending' ? 'text-yellow-800 bg-yellow-100' :
                    'text-red-800 bg-red-100'
                  }`}>
                    {selectedArtwork.status}
                  </span>
                  <div className="text-sm" style={{color: '#D87C5A'}}>
                    {selectedArtwork.views} views • {selectedArtwork.likes} likes
                  </div>
                </div>
              </div>
              
              {/* Artwork Details */}
              <div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xl font-bold mb-2" style={{color: '#5D3A00'}}>{selectedArtwork.title}</h4>
                    <p className="text-lg" style={{color: '#D87C5A'}}>by {selectedArtwork.artist}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium" style={{color: '#5D3A00'}}>Category:</span>
                      <p>{selectedArtwork.category}</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{color: '#5D3A00'}}>Price:</span>
                      <p className="text-lg font-bold" style={{color: '#5D3A00'}}>${selectedArtwork.price.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{color: '#5D3A00'}}>Upload Date:</span>
                      <p>{selectedArtwork.uploadDate}</p>
                    </div>
                    <div>
                      <span className="font-medium" style={{color: '#5D3A00'}}>Content Status:</span>
                      <p className={selectedArtwork.blocked ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                        {selectedArtwork.blocked ? 'Flagged' : 'Approved'}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium" style={{color: '#5D3A00'}}>Performance Metrics:</span>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600">Total Views</div>
                        <div className="text-lg font-bold" style={{color: '#5D3A00'}}>{selectedArtwork.views.toLocaleString()}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600">Engagement</div>
                        <div className="text-lg font-bold" style={{color: '#5D3A00'}}>{Math.round((selectedArtwork.likes / selectedArtwork.views) * 100)}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex gap-3">
              <button
                onClick={() => {
                  handleBlockArtwork(selectedArtwork.id);
                  setSelectedArtwork({...selectedArtwork, blocked: !selectedArtwork.blocked, status: selectedArtwork.blocked ? 'Approved' : 'Flagged'});
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  selectedArtwork.blocked 
                    ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                }`}
              >
                {selectedArtwork.blocked ? <UserCheck size={16} /> : <Ban size={16} />}
                {selectedArtwork.blocked ? 'Approve Artwork' : 'Flag as Inappropriate'}
              </button>
              <button
                className="px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                style={{backgroundColor: '#FFE4D6', color: '#5D3A00'}}
                onMouseOver={(e) => e.target.style.backgroundColor = '#FFD95A'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#FFE4D6'}
              >
                <Eye size={16} />
                View Full Resolution
              </button>
              <button
                className="px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                style={{backgroundColor: '#D87C5A', color: 'white'}}
                onMouseOver={(e) => e.target.style.backgroundColor = '#B85A3A'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#D87C5A'}
              >
                <Plus size={16} />
                Contact Artist
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Artwork Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {artworkStats.map((stat, index) => (
          <div key={index} className="rounded-lg shadow-sm border h-full relative overflow-hidden" style={{backgroundColor: '#FFF5E1'}}>
            {/* Background Image */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: index === 0 
                  ? 'url("https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")' // Total artworks - art gallery
                  : index === 1 
                  ? 'url("https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")' // Approved - checkmark/approval
                  : index === 2 
                  ? 'url("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")' // Pending - hourglass/clock
                  : 'url("https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")', // Flagged - warning/shield
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            ></div>
            <div className="p-6 relative z-10">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm font-semibold mb-1" style={{color: '#5D3A00'}}>{stat.label}</p>
                  <h2 className="text-2xl font-bold mb-2" style={{color: '#5D3A00'}}>{stat.value}</h2>
                  <div className="flex items-center gap-1">
                    <span 
                      className="text-xs font-medium px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: stat.changeType === 'positive' ? '#d4edda' : stat.changeType === 'negative' ? '#f8d7da' : '#fff3cd',
                        color: stat.changeType === 'positive' ? '#155724' : stat.changeType === 'negative' ? '#721c24' : '#856404'
                      }}
                    >
                      {stat.change}
                    </span>
                    <span className="text-xs opacity-75" style={{color: '#5D3A00'}}>vs last month</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg shadow-lg" style={{backgroundColor: stat.color}}>
                  <stat.icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Header with Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-2xl font-bold flex items-center gap-2" style={{color: '#5D3A00'}}>
            <Image size={24} />
            Artwork Management ({filteredArtworks.length} artworks)
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{color: '#5D3A00'}} />
              <input
                type="text"
                placeholder="Search artworks by title, artist, or category..."
                value={artworkSearchTerm}
                onChange={(e) => setArtworkSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent w-full sm:w-64"
                style={{borderColor: '#FFE4D6', backgroundColor: 'white'}}
              />
            </div>
            <div className="relative">
              <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{color: '#5D3A00'}} />
              <select
                value={artworkFilterStatus}
                onChange={(e) => setArtworkFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent appearance-none w-full sm:w-auto"
                style={{borderColor: '#FFE4D6', backgroundColor: 'white'}}
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="flagged">Flagged</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Artworks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArtworks.map((artwork) => (
          <div key={artwork.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="relative">
              <img 
                src={artwork.imageUrl} 
                alt={artwork.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  artwork.status === 'Approved' ? 'text-green-800 bg-green-100' :
                  artwork.status === 'Pending' ? 'text-yellow-800 bg-yellow-100' :
                  'text-red-800 bg-red-100'
                }`}>
                  {artwork.status}
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="mb-3">
                <h3 className="font-bold text-lg mb-1" style={{color: '#5D3A00'}}>{artwork.title}</h3>
                <p className="text-sm" style={{color: '#D87C5A'}}>by {artwork.artist}</p>
                <p className="text-xs mt-1" style={{color: '#5D3A00'}}>{artwork.category}</p>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-lg" style={{color: '#5D3A00'}}>${artwork.price.toLocaleString()}</span>
                <div className="flex items-center gap-3 text-sm" style={{color: '#D87C5A'}}>
                  <span>{artwork.views} views</span>
                  <span>{artwork.likes} likes</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{color: '#5D3A00'}}>Uploaded: {artwork.uploadDate}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {setSelectedArtwork(artwork); setShowArtworkModal(true);}}
                    className="p-2 rounded-lg transition-colors"
                    style={{backgroundColor: '#FFE4D6', color: '#5D3A00'}}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#FFD95A';
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = '#FFE4D6';
                      e.target.style.transform = 'scale(1)';
                    }}
                    title="View Details"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleBlockArtwork(artwork.id)}
                    className={`p-2 rounded-lg transition-all ${
                      artwork.blocked 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                    title={artwork.blocked ? 'Approve Artwork' : 'Flag Artwork'}
                  >
                    {artwork.blocked ? <UserCheck size={16} /> : <Ban size={16} />}
                  </button>
                  <button
                    className="p-2 rounded-lg transition-colors"
                    style={{backgroundColor: '#FFE4D6', color: '#5D3A00'}}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#FFD95A';
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = '#FFE4D6';
                      e.target.style.transform = 'scale(1)';
                    }}
                    title="More Options"
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredArtworks.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center" style={{color: '#D87C5A'}}>
          <Image size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">No artworks found</p>
          <p className="text-sm">Try adjusting your search terms or filters</p>
        </div>
      )}

      {/* Artwork Details Modal */}
      <ArtworkModal />
    </div>
  );
};

export default ArtworkManagement;
