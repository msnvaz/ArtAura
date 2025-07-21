package com.artaura.artaura.service;

import com.artaura.artaura.dao.ArtWorkDAO;
import com.artaura.artaura.dto.artwork.ArtWorkCreateDTO;
import com.artaura.artaura.dto.artwork.ArtWorkResponseDTO;
import com.artaura.artaura.dto.artwork.ArtWorkUpdateDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@Service
public class ArtWorkService {

    @Autowired
    private ArtWorkDAO artWorkDAO;

    public void createArtWork(Long artistId, ArtWorkCreateDTO dto, MultipartFile imageFile) throws IOException {
        if (imageFile != null && !imageFile.isEmpty()) {
            String filename = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();

            // Use same logic as WebConfig to find correct upload directory
            String currentDir = System.getProperty("user.dir");
            String serverDir = currentDir.endsWith("artaura")
                    ? currentDir.substring(0, currentDir.lastIndexOf("artaura"))
                    : currentDir + "/";
            Path uploadPath = Paths.get(serverDir + "uploads");

            Files.createDirectories(uploadPath);
            Path filePath = uploadPath.resolve(filename);
            Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            dto.setImageUrl("/uploads/" + filename);
        }
        artWorkDAO.saveArtWork(artistId, dto);
    }

    public void deleteArtWork(Long artworkId) {
        artWorkDAO.deleteArtWorkById(artworkId);
    }

    public void updateArtWork(ArtWorkUpdateDTO dto, MultipartFile imageFile) throws IOException {
        if (imageFile != null && !imageFile.isEmpty()) {
            String filename = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();

            // Use same logic as WebConfig to find correct upload directory
            String currentDir = System.getProperty("user.dir");
            String serverDir = currentDir.endsWith("artaura")
                    ? currentDir.substring(0, currentDir.lastIndexOf("artaura"))
                    : currentDir + "/";
            Path uploadPath = Paths.get(serverDir + "uploads");

            Files.createDirectories(uploadPath);
            Path filePath = uploadPath.resolve(filename);
            Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            dto.setImageUrl("/uploads/" + filename);
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
