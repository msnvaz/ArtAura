package com.artaura.artaura.dao.buyer;

import com.artaura.artaura.dto.buyer.ArtistListDTO;

import java.util.List;

public interface BArtistDAO {
    // List all artists for frontend
    List<ArtistListDTO> getAllArtistsForList();
    void incrementFollowers(Long artistId);
}
