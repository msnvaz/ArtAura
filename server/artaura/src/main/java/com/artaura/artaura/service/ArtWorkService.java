package com.artaura.artaura.service;

import com.artaura.artaura.dao.ArtWorkDAO;
import com.artaura.artaura.dto.artwork.ArtWorkCreateDTO;
import com.artaura.artaura.dto.artwork.ArtWorkResponseDTO;
import com.artaura.artaura.dto.artwork.ArtWorkUpdateDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class ArtWorkService {

    @Autowired
    private ArtWorkDAO artWorkDAO;

    @Autowired
    private CentralizedUploadService centralizedUploadService;

    public void createArtWork(Long artistId, ArtWorkCreateDTO dto, MultipartFile imageFile) throws IOException {
        if (imageFile != null && !imageFile.isEmpty()) {
            // Use centralized upload service for artwork images
            String imageUrl = centralizedUploadService.saveArtworkImage(imageFile, artistId);
            dto.setImageUrl(imageUrl);
        }
        artWorkDAO.saveArtWork(artistId, dto);
    }

    public void deleteArtWork(Long artworkId) {
        artWorkDAO.deleteArtWorkById(artworkId);
    }

    public void updateArtWork(ArtWorkUpdateDTO dto, MultipartFile imageFile) throws IOException {
        if (imageFile != null && !imageFile.isEmpty()) {
            // Use centralized upload service for artwork images
            String imageUrl = centralizedUploadService.saveArtworkImage(imageFile, dto.getArtworkId());
            dto.setImageUrl(imageUrl);
        }
        artWorkDAO.updateArtWork(dto);
    }

    public List<ArtWorkResponseDTO> getArtWorksByArtist(Long artistId) {
        return artWorkDAO.getArtWorksByArtist(artistId);
    }

    public ArtWorkResponseDTO getArtWorkById(Long artworkId) {
        return artWorkDAO.getArtWorkById(artworkId);
    }
}
