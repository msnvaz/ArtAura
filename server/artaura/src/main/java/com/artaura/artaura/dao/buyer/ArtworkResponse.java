package com.artaura.artaura.dao.buyer;
import com.artaura.artaura.dto.buyer.ArtworksResponse;

import java.util.List;
public interface ArtworkResponse {
    List<ArtworksResponse> findAvailableArtworksWithArtist();
}
