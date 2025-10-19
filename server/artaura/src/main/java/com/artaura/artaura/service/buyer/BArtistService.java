package com.artaura.artaura.service.buyer;

import com.artaura.artaura.dao.buyer.BArtistDAO;
import com.artaura.artaura.dto.buyer.ArtistListDTO;
import com.artaura.artaura.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BArtistService {
    @Autowired
    private BArtistDAO bArtistDAO;
    
    @Autowired
    private JwtUtil jwtUtil;

    public List<ArtistListDTO> getAllArtistsForList() {
        return bArtistDAO.getAllArtistsForList();
    }

    public boolean followArtist(Long artistId, String token) {
        try {
            // Extract JWT token (remove "Bearer " prefix if present)
            String jwt = token.startsWith("Bearer ") ? token.substring(7) : token;
            
            // Extract user ID from JWT token using the correct method
            Long buyerId = jwtUtil.extractUserId(jwt);
            
            // Check if user is already following this artist
            if (bArtistDAO.isFollowing(buyerId, artistId)) {
                return false; // Already following
            }
            
            // Add follow relationship and increment follower count
            bArtistDAO.followArtist(buyerId, artistId);
            return true; // Successfully followed
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to follow artist: " + e.getMessage());
        }
    }
    
    public boolean unfollowArtist(Long artistId, String token) {
        try {
            // Extract JWT token (remove "Bearer " prefix if present)
            String jwt = token.startsWith("Bearer ") ? token.substring(7) : token;
            
            // Extract user ID from JWT token using the correct method
            Long buyerId = jwtUtil.extractUserId(jwt);
            
            // Check if user is following this artist
            if (!bArtistDAO.isFollowing(buyerId, artistId)) {
                return false; // Not following
            }
            
            // Remove follow relationship and decrement follower count
            bArtistDAO.unfollowArtist(buyerId, artistId);
            return true; // Successfully unfollowed
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to unfollow artist: " + e.getMessage());
        }
    }
    
    public boolean isFollowing(Long artistId, String token) {
        try {
            // Extract JWT token (remove "Bearer " prefix if present)
            String jwt = token.startsWith("Bearer ") ? token.substring(7) : token;
            
            // Extract user ID from JWT token using the correct method
            Long buyerId = jwtUtil.extractUserId(jwt);
            
            return bArtistDAO.isFollowing(buyerId, artistId);
            
        } catch (Exception e) {
            return false; // Return false if token is invalid or other error
        }
    }
}
