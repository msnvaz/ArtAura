import React from 'react';
import { Star, MapPin, Users, TrendingUp, Calendar } from 'lucide-react';

const ProfileHeader = ({
    artistProfile,
    isFollowing,
    onToggleFollow,
    onOrderCustomArtwork,
    isPublicView = false
}) => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
                {/* Avatar */}
                <div className="relative mb-4 md:mb-0">
                    <img
                        src={artistProfile.avatar}
                        alt={artistProfile.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                        <div>
                            <div className="flex items-center space-x-3 mb-2">
                                <h2 className="text-2xl font-bold text-[#7f5539]">{artistProfile.name}</h2>
                                {artistProfile.isVerified && (
                                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                                        <Star className="h-3 w-3" />
                                        <span>Verified Artist</span>
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                <div>
                                    <div className="text-2xl font-bold text-[#7f5539]">{artistProfile.stats.artworks}</div>
                                    <div className="text-sm text-[#7f5539]/60">Artworks</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-[#7f5539]">{artistProfile.stats.sales}</div>
                                    <div className="text-sm text-[#7f5539]/60">Sales</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-[#7f5539]">
                                        {artistProfile.stats.followers + (isFollowing ? 1 : 0)}
                                    </div>
                                    <div className="text-sm text-[#7f5539]/60">Followers</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-[#7f5539]">{artistProfile.stats.views}</div>
                                    <div className="text-sm text-[#7f5539]/60">Views</div>
                                </div>
                            </div>
                        </div>

                        {isPublicView && (
                            <div className="flex flex-col space-y-2 mt-4 md:mt-0">
                                <button
                                    onClick={onToggleFollow}
                                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${isFollowing
                                            ? 'bg-gray-200 text-[#7f5539] hover:bg-gray-300'
                                            : 'bg-[#7f5539] text-[#fdf9f4] hover:bg-[#6e4c34]'
                                        }`}
                                >
                                    {isFollowing ? 'Following' : 'Follow'}
                                </button>
                                <button
                                    onClick={onOrderCustomArtwork}
                                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center space-x-2"
                                >
                                    <TrendingUp className="h-4 w-4" />
                                    <span>Request Custom Art</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Bio */}
                    <div className="mb-4">
                        <p className="text-[#7f5539]/70 leading-relaxed">{artistProfile.bio}</p>
                    </div>

                    {/* Artist Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <h4 className="font-semibold text-[#7f5539] mb-2">Specialties</h4>
                            <div className="flex flex-wrap gap-2">
                                {artistProfile.specialties?.map((specialty, index) => (
                                    <span
                                        key={index}
                                        className="bg-[#7f5539]/10 text-[#7f5539] px-3 py-1 rounded-full text-sm"
                                    >
                                        {specialty}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-[#7f5539] mb-2">Price Range</h4>
                            <p className="text-[#7f5539]/70">{artistProfile.priceRange}</p>
                            {artistProfile.customWorkAvailable && (
                                <p className="text-green-600 text-sm mt-1">✓ Custom work available</p>
                            )}
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center space-x-1 text-[#7f5539]/70">
                            <MapPin className="h-4 w-4" />
                            <span>{artistProfile.location}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-[#7f5539]/70">
                            <Calendar className="h-4 w-4" />
                            <span>Joined {artistProfile.joinDate}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;