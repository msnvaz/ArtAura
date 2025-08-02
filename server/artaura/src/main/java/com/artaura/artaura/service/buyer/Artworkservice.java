package com.artaura.artaura.service.buyer;

import com.artaura.artaura.dao.buyer.ArtworkResponse;
import com.artaura.artaura.dto.buyer.ArtworksResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class Artworkservice {
    @Autowired
    private ArtworkResponse artworkDao;

    public List<ArtworksResponse> getAvailableArtworks() {
        return artworkDao.findAvailableArtworksWithArtist();
    }
}
