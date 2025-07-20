import React, { useState, useEffect } from 'react';
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
  Plus,
  Loader2,
  Heart
} from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import CurrencySelector from '../../components/common/CurrencySelector';

const ArtworkManagement = () => {
  const [artworkSearchTerm, setArtworkSearchTerm] = useState('');
  const [artworkFilterStatus, setArtworkFilterStatus] = useState('all');
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [expandedArtworkId, setExpandedArtworkId] = useState(null);
  const { formatPrice } = useCurrency();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Load data when filters change (but not search term - that's handled by local filtering)
  useEffect(() => {
    loadArtworks();
  }, [artworkFilterStatus, pagination.page, pagination.size]);

  // API functions
  const loadArtworks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Always use the getAllArtworks endpoint and let local filtering handle search
      const filters = {
        page: pagination.page,
        size: pagination.size,
        status: artworkFilterStatus !== 'all' ? artworkFilterStatus : undefined
      };

      const response = await adminArtworkApi.getAllArtworks(filters);

      // Use artworks directly without status mapping
      const processedArtworks = response.content || [];

      setArtworks(processedArtworks);
      setPagination(prev => ({
        ...prev,
        totalElements: response.totalElements || 0,
        totalPages: response.totalPages || 0
      }));
    } catch (err) {
      setError('Failed to load artworks. Please try again.');
      console.error('Error loading artworks:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await adminArtworkApi.getArtworkStatistics();
      setStatistics(stats);
    } catch (err) {
      console.error('Error loading statistics:', err);
    }
  };

  const loadFilterOptions = async () => {
    try {
      const options = await adminArtworkApi.getFilterOptions();
      setFilterOptions(options);
    } catch (err) {
      console.error('Error loading filter options:', err);
    }
  };

  // Status values that match the database enum ('Available', 'Sold', 'Reserved')
  const validStatuses = ['Available', 'Sold', 'Reserved'];

  const handleBlockArtwork = async (artworkId) => {
    try {
      const artwork = artworks.find(a => a.artworkId === artworkId);
      if (!artwork) return;

      const newStatus = artwork.status === 'Sold' ? 'Available' : 'Sold';
      
      if (!validStatuses.includes(newStatus)) {
        setError(`Invalid status: ${newStatus}`);
        return;
      }

      await adminArtworkApi.updateArtworkStatus(artworkId, newStatus);
      
      // Update local state
      setArtworks(artworks.map(artwork => 
        artwork.artworkId === artworkId ? { 
          ...artwork, 
          status: newStatus
        } : artwork
      ));
      
      // Update selected artwork if it's the one being modified
      if (selectedArtwork && selectedArtwork.artworkId === artworkId) {
        setSelectedArtwork({ ...selectedArtwork, status: newStatus });
      }
      
      setSuccessMessage(`Artwork marked as ${newStatus.toLowerCase()} successfully`);
    } catch (err) {
      setError('Failed to update artwork status. Please try again.');
      console.error('Error updating artwork status:', err);
    }
  };

  const handleToggleFeatured = async (artworkId) => {
    try {
      const artwork = artworks.find(a => a.artworkId === artworkId);
      if (!artwork) return;

      const newFeaturedStatus = !artwork.isFeatured;
      await adminArtworkApi.updateArtworkFeaturedStatus(artworkId, newFeaturedStatus);
      
      // Update local state
      setArtworks(artworks.map(artwork => 
        artwork.artworkId === artworkId ? { 
          ...artwork, 
          isFeatured: newFeaturedStatus
        } : artwork
      ));
      
      // Update selected artwork if it's the one being modified
      if (selectedArtwork && selectedArtwork.artworkId === artworkId) {
        setSelectedArtwork({ ...selectedArtwork, isFeatured: newFeaturedStatus });
      }
      
      setSuccessMessage(`Artwork ${newFeaturedStatus ? 'added to' : 'removed from'} featured successfully`);
    } catch (err) {
      setError('Failed to update featured status. Please try again.');
      console.error('Error updating featured status:', err);
    }
  };

  const filteredArtworks = artworks.filter(artwork => {
    // Debug: log the artwork structure to understand the data
    if (artworkSearchTerm && artworks.length > 0 && artworks.indexOf(artwork) === 0) {
      console.log('Sample artwork structure:', artwork);
    }
    
    const artistName = artwork.artistName || artwork.artist || '';
    const title = artwork.title || '';
    const category = artwork.category || '';
    
    // Debug: log search values
    if (artworkSearchTerm) {
      console.log('Searching for:', artworkSearchTerm);
      console.log('Title:', title, 'Artist:', artistName, 'Category:', category);
    }
    
    const matchesSearch = !artworkSearchTerm || 
                         title.toLowerCase().includes(artworkSearchTerm.toLowerCase()) ||
                         artistName.toLowerCase().includes(artworkSearchTerm.toLowerCase()) ||
                         category.toLowerCase().includes(artworkSearchTerm.toLowerCase());
    const matchesStatus = artworkFilterStatus === 'all' || artwork.status === artworkFilterStatus;
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
      label: 'Available', 
      value: (statistics.availableArtworks || artworks.filter(a => a.status === 'Available').length).toLocaleString(), 
      icon: UserCheck, 
      color: '#5D9CDB',
      change: statistics.availableArtworksChange || '+12%',
      changeType: 'positive'
    },
    { 
      label: 'Sold', 
      value: (statistics.soldArtworks || artworks.filter(a => a.status === 'Sold').length).toLocaleString(), 
      icon: AlertTriangle, 
      color: '#28a745',
      change: statistics.soldArtworksChange || '+25%',
      changeType: 'positive'
    },
    { 
      label: 'Reserved', 
      value: (statistics.reservedArtworks || artworks.filter(a => a.status === 'Reserved').length).toLocaleString(), 
      icon: ShieldAlert, 
      color: '#FFD95A',
      change: statistics.reservedArtworksChange || '+5%',
      changeType: 'neutral'
    }
  ];

  // Artwork Details Component
  const ArtworkDetails = ({ artwork }) => {
    return (
      <div className="bg-white rounded-lg shadow-lg border-2 border-orange-200 overflow-hidden w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold" style={{color: '#5D3A00'}}>Artwork Details</h3>
            <button
              onClick={() => {
                setExpandedArtworkId(null);
                setSelectedArtwork(null);
              }}
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
                src={artwork.imageUrl} 
                alt={artwork.title}
                className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-sm"
              />
              <div className="mt-4 flex items-center justify-between">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  artwork.status === 'Available' ? 'text-green-800 bg-green-100' :
                  artwork.status === 'Sold' ? 'text-blue-800 bg-blue-100' :
                  artwork.status === 'Reserved' ? 'text-yellow-800 bg-yellow-100' :
                  'text-gray-800 bg-gray-100'
                }`}>
                  {artwork.status}
                </span>
                <div className="text-sm" style={{color: '#D87C5A'}}>
                  {artwork.viewsCount || artwork.views || 0} views • {artwork.likesCount || artwork.likes || 0} likes
                </div>
              </div>
            </div>
            
            {/* Artwork Details */}
            <div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-bold mb-2" style={{color: '#5D3A00'}}>{artwork.title}</h4>
                  <p className="text-lg" style={{color: '#D87C5A'}}>by {artwork.artistName || artwork.artist}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium" style={{color: '#5D3A00'}}>Category:</span>
                    <p>{artwork.category}</p>
                  </div>
                  <div>
                    <span className="font-medium" style={{color: '#5D3A00'}}>Price:</span>
                    <p className="text-lg font-bold" style={{color: '#5D3A00'}}>{formatPrice(artwork.price)}</p>
                  </div>
                  <div>
                    <span className="font-medium" style={{color: '#5D3A00'}}>Upload Date:</span>
                    <p>{artwork.createdAt ? new Date(artwork.createdAt).toLocaleDateString() : artwork.uploadDate}</p>
                  </div>
                  <div>
                    <span className="font-medium" style={{color: '#5D3A00'}}>Status:</span>
                    <p className={
                      artwork.status === 'Available' ? 'text-green-600 font-medium' :
                      artwork.status === 'Sold' ? 'text-blue-600 font-medium' :
                      artwork.status === 'Reserved' ? 'text-yellow-600 font-medium' :
                      'text-gray-600 font-medium'
                    }>
                      {artwork.status}
                    </p>
                  </div>
                </div>
                
                <div>
                  <span className="font-medium" style={{color: '#5D3A00'}}>Performance Metrics:</span>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">Total Views</div>
                      <div className="text-lg font-bold" style={{color: '#5D3A00'}}>{(artwork.viewsCount || artwork.views || 0).toLocaleString()}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">Engagement</div>
                      <div className="text-lg font-bold" style={{color: '#5D3A00'}}>
                        {Math.round(((artwork.likesCount || artwork.likes || 0) / (artwork.viewsCount || artwork.views || 1)) * 100)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex gap-3 flex-wrap">
            <button
              onClick={() => {
                handleBlockArtwork(artwork.artworkId || artwork.id);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                artwork.status === 'Sold'
                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
            >
              {artwork.status === 'Sold' ? <UserCheck size={16} /> : <Ban size={16} />}
              {artwork.status === 'Sold' ? 'Mark as Available' : 'Mark as Sold'}
            </button>
            <button
              onClick={() => {
                handleToggleFeatured(artwork.artworkId || artwork.id);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                artwork.isFeatured
                  ? 'bg-red-100 text-red-800 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              <Heart size={16} fill={artwork.isFeatured ? 'currentColor' : 'none'} />
              {artwork.isFeatured ? 'Remove from Featured' : 'Add to Featured'}
            </button>
            <button
              onClick={() => window.open(artwork.imageUrl, '_blank')}
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
    );
  };

  return (
    <>
      {/* Add smooth animations */}
      <style jsx>{`
        @keyframes smoothFadeIn {
          from {
            opacity: 0;
            transform: translateY(15px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .artwork-container {
          animation: smoothFadeIn 0.4s ease-out;
        }

        .artwork-stats {
          animation: slideInUp 0.5s ease-out 0.1s both;
        }

        .artwork-header {
          animation: slideInUp 0.5s ease-out 0.2s both;
        }

        .artwork-filters {
          animation: slideInUp 0.5s ease-out 0.3s both;
        }

        .artwork-grid {
          animation: slideInUp 0.5s ease-out 0.4s both;
        }

        .artwork-stat-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .artwork-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .artwork-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .artwork-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
        }
      `}</style>

      <div className="space-y-4 artwork-container">
        {/* Artwork Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 artwork-stats">
          {artworkStats.map((stat, index) => (
            <div key={index} className="rounded-lg shadow-sm border h-full relative overflow-hidden artwork-stat-card" style={{backgroundColor: '#FFF5E1'}}>
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
              <div className="p-3 relative z-10">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm font-semibold mb-1" style={{color: '#5D3A00'}}>{stat.label}</p>
                    <h2 className="text-xl font-bold mb-2" style={{color: '#5D3A00'}}>{stat.value}</h2>
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
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Artwork Management Heading */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2 artwork-header">
          <h2 className="text-2xl font-bold flex items-center gap-2" style={{color: '#5D3A00'}}>
            Artwork Management ({filteredArtworks.length} artworks)
          </h2>
          <CurrencySelector className="flex-shrink-0" />
        </div>

        {/* Search and Filters */}
        <div className="bg-transparent rounded-lg py-1 px-4 artwork-filters">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{color: '#5D3A00'}} />
              <input
                type="text"
                placeholder="Search by title, artist name, or category..."
                value={artworkSearchTerm}
                onChange={(e) => setArtworkSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent w-full sm:w-64"
                style={{borderColor: '#FFE4D6', backgroundColor: 'rgba(255, 255, 255, 0.8)'}}
              />
            </div>
            <div className="relative">
              <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{color: '#5D3A00'}} />
              <select
                value={artworkFilterStatus}
                onChange={(e) => setArtworkFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent appearance-none w-full sm:w-auto"
                style={{borderColor: '#FFE4D6', backgroundColor: 'rgba(255, 255, 255, 0.8)'}}
              >
                <option value="all">All Status</option>
                <option value="Available">Available</option>
                <option value="Sold">Sold</option>
                <option value="Reserved">Reserved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Artworks Grid */}
        <div className="space-y-4 artwork-grid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="col-span-full flex justify-center items-center py-12">
                <div className="flex items-center gap-3" style={{color: '#D87C5A'}}>
                  <Loader2 className="animate-spin" size={24} />
                  <span>Loading artworks...</span>
                </div>
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-12">
                <div className="text-red-600 mb-4">{error}</div>
                <button
                  onClick={loadArtworks}
                  className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : filteredArtworks.length === 0 ? (
              <div className="col-span-full text-center py-12" style={{color: '#5D3A00'}}>
                <Image size={48} className="mx-auto mb-4 opacity-50" />
                <p>No artworks found matching your criteria.</p>
              </div>
            ) : filteredArtworks.map((artwork) => {
              const isExpanded = expandedArtworkId === (artwork.artworkId || artwork.id);
              return (
                <div 
                  key={artwork.artworkId || artwork.id}
                  className={`bg-white rounded-lg shadow-sm overflow-hidden artwork-card cursor-pointer transition-all ${
                    isExpanded ? 'ring-2 ring-orange-300 shadow-lg' : ''
                  }`}
                  onClick={() => {
                    const artworkId = artwork.artworkId || artwork.id;
                    if (isExpanded) {
                      setExpandedArtworkId(null);
                      setSelectedArtwork(null);
                    } else {
                      setExpandedArtworkId(artworkId);
                      setSelectedArtwork(artwork);
                    }
                  }}
                >
                  <div className="relative">
                    <img 
                      src={artwork.imageUrl} 
                      alt={artwork.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        artwork.status === 'Available' ? 'text-green-800 bg-green-100' :
                        artwork.status === 'Sold' ? 'text-blue-800 bg-blue-100' :
                        artwork.status === 'Reserved' ? 'text-yellow-800 bg-yellow-100' :
                        'text-gray-800 bg-gray-100'
                      }`}>
                        {artwork.status}
                      </span>
                    </div>
                    {isExpanded && (
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                          Selected
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="mb-3">
                      <h3 className="font-bold text-lg mb-1" style={{color: '#5D3A00'}}>{artwork.title}</h3>
                      <p className="text-sm" style={{color: '#D87C5A'}}>by {artwork.artistName || artwork.artist}</p>
                      <p className="text-xs mt-1" style={{color: '#5D3A00'}}>{artwork.category}</p>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-lg" style={{color: '#5D3A00'}}>{formatPrice(artwork.price)}</span>
                      <div className="flex items-center gap-3 text-sm" style={{color: '#D87C5A'}}>
                        <span>{artwork.viewsCount || artwork.views || 0} views</span>
                        <span>{artwork.likesCount || artwork.likes || 0} likes</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs" style={{color: '#5D3A00'}}>
                        Uploaded: {artwork.createdAt ? new Date(artwork.createdAt).toLocaleDateString() : artwork.uploadDate}
                      </span>
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleBlockArtwork(artwork.artworkId || artwork.id)}
                          className={`p-2 rounded-lg transition-all ${
                            artwork.status === 'Sold'
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                          }`}
                          onMouseOver={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.transform = 'scale(1)';
                          }}
                          title={artwork.status === 'Sold' ? 'Mark as Available' : 'Mark as Sold'}
                        >
                          {artwork.status === 'Sold' ? <UserCheck size={16} /> : <Ban size={16} />}
                        </button>
                        <button
                          onClick={() => handleToggleFeatured(artwork.artworkId || artwork.id)}
                          className={`p-2 rounded-lg transition-all ${
                            artwork.isFeatured
                              ? 'bg-red-100 text-red-800 hover:bg-red-200'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                          onMouseOver={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                          }}
                          onMouseOut={(e) => {
                            e.target.style.transform = 'scale(1)';
                          }}
                          title={artwork.isFeatured ? 'Remove from Featured' : 'Add to Featured'}
                        >
                          <Heart size={16} fill={artwork.isFeatured ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Expanded Details - Separate row to maintain grid layout */}
          {expandedArtworkId && selectedArtwork && (
            <ArtworkDetails artwork={selectedArtwork} />
          )}
        </div>

        {filteredArtworks.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center" style={{color: '#D87C5A'}}>
            <Image size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No artworks found</p>
            <p className="text-sm">Try adjusting your search terms or filters</p>
          </div>
        )}

        {/* Artwork Details Modal */}
        {/* Details are now inline with the grid */}
      </div>
    </>
  );
};

export default ArtworkManagement;
