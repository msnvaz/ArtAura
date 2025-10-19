package com.artaura.artaura.dao.buyer;

import com.artaura.artaura.dto.buyer.ArtistListDTO;

import java.util.List;

public interface BArtistDAO {
    // List all artists for frontend
    List<ArtistListDTO> getAllArtistsForList();
    
    // Follow relationship management
    void followArtist(Long buyerId, Long artistId);
    void unfollowArtist(Long buyerId, Long artistId);
    boolean isFollowing(Long buyerId, Long artistId);
    
    // Deprecated - use followArtist/unfollowArtist instead
    @Deprecated
    void incrementFollowers(Long artistId);
}
