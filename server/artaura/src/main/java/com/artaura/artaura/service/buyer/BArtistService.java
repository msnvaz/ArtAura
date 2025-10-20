package com.artaura.artaura.service.buyer;

import com.artaura.artaura.dao.buyer.BArtistDAO;
import com.artaura.artaura.dto.buyer.ArtistListDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BArtistService {
    @Autowired
    private BArtistDAO bArtistDAO;

    public List<ArtistListDTO> getAllArtistsForList() {
        return bArtistDAO.getAllArtistsForList();
    }

    public void followArtist(Long artistId, String token) {
        // Validate JWT, get user info if needed
        bArtistDAO.incrementFollowers(artistId);
    }
}
