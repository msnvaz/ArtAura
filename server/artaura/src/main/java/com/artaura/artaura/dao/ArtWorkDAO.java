package com.artaura.artaura.dao;

import com.artaura.artaura.dto.artwork.ArtWorkCreateDTO;
import com.artaura.artaura.dto.artwork.ArtWorkResponseDTO;
import com.artaura.artaura.dto.artwork.ArtWorkUpdateDTO;
import java.util.List;

public interface ArtWorkDAO {

    void saveArtWork(Long artistId, ArtWorkCreateDTO dto);

    void deleteArtWorkById(Long artworkId);

    void updateArtWork(ArtWorkUpdateDTO dto);

    List<ArtWorkResponseDTO> getArtWorksByArtist(Long artistId);

    ArtWorkResponseDTO getArtWorkById(Long artworkId);
}
