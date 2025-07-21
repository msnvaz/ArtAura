package com.artaura.artaura.controller;

import com.artaura.artaura.dao.ArtWorkDAO;
import com.artaura.artaura.dto.artwork.ArtWorkCreateDTO;
import com.artaura.artaura.dto.artwork.ArtWorkResponseDTO;
import com.artaura.artaura.dto.artwork.ArtWorkUpdateDTO;
import com.artaura.artaura.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@RestController
@RequestMapping("/api/artworks")
public class ArtworkController {

    @Autowired
    private ArtWorkDAO artWorkDAO;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/artist/{artistId}")
    public void addArtWork(@PathVariable Long artistId, @RequestBody ArtWorkCreateDTO dto) {
        artWorkDAO.saveArtWork(artistId, dto);
    }

    @PostMapping("/artist/{artistId}/upload")
    public ResponseEntity<ArtWorkResponseDTO> addArtWorkWithImage(
            @PathVariable Long artistId,
            @RequestParam("title") String title,
            @RequestParam("medium") String medium,
            @RequestParam(value = "size", required = false) String size,
            @RequestParam(value = "year", required = false) String year,
            @RequestParam("price") String price,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "tags", required = false) String tags,
            @RequestParam(value = "image", required = false) MultipartFile image,
            HttpServletRequest request
    ) {
        try {
            // 🔐 Extract userId from JWT for additional validation
            String token = request.getHeader("Authorization").substring(7);
            Long userId = jwtUtil.extractUserId(token);

            // Create DTO with form data
            ArtWorkCreateDTO dto = new ArtWorkCreateDTO();
            dto.setArtistId(artistId);
            dto.setTitle(title);
            dto.setMedium(medium);
            dto.setSize(size != null ? size : "");
            dto.setYear(year != null ? year : String.valueOf(java.time.LocalDateTime.now().getYear()));
            dto.setPrice(Double.parseDouble(price));
            dto.setDescription(description != null ? description : "");
            dto.setCategory(category != null ? category : "");
            dto.setTags(tags != null ? tags : "");
            dto.setStatus("Available");
            dto.setLikesCount(0);
            dto.setViewsCount(0);
            dto.setFeatured(false);
            dto.setCreatedAt(java.time.LocalDateTime.now());
            dto.setUpdatedAt(java.time.LocalDateTime.now());

            // 📂 Save image to /uploads/ if provided
            if (image != null && !image.isEmpty()) {
                String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();

                // Use same logic as WebConfig to find correct upload directory
                String currentDir = System.getProperty("user.dir");
                String serverDir = currentDir.endsWith("artaura")
                        ? currentDir.substring(0, currentDir.lastIndexOf("artaura"))
                        : currentDir + "/";
                Path uploadDir = Paths.get(serverDir + "uploads");

                Files.createDirectories(uploadDir); // Create folder if not exist
                Path filePath = uploadDir.resolve(fileName);
                Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                // Store relative path for frontend access
                dto.setImageUrl("/uploads/" + fileName);
            } else {
                dto.setImageUrl("");
            }

            // Save artwork
            artWorkDAO.saveArtWork(artistId, dto);

            // Get the created artwork to return it
            List<ArtWorkResponseDTO> artworks = artWorkDAO.getArtWorksByArtist(artistId);

            // Return the most recently created artwork (should be the first one since we order by created_at DESC)
            if (!artworks.isEmpty()) {
                ArtWorkResponseDTO createdArtwork = artworks.get(0);
                return ResponseEntity.ok(createdArtwork);
            } else {
                return ResponseEntity.status(500).build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/artist/{artistId}")
    public List<ArtWorkResponseDTO> getArtWorksByArtist(@PathVariable Long artistId) {
        System.out.println("DEBUG: Getting artworks for artist " + artistId);
        List<ArtWorkResponseDTO> artworks = artWorkDAO.getArtWorksByArtist(artistId);
        System.out.println("DEBUG: Returned " + artworks.size() + " artworks");
        return artworks;
    }

    @GetMapping("/{artworkId}")
    public ArtWorkResponseDTO getArtWorkById(@PathVariable Long artworkId) {
        return artWorkDAO.getArtWorkById(artworkId);
    }

    @PutMapping("/{artworkId}")
    public void updateArtWork(@PathVariable Long artworkId, @RequestBody ArtWorkUpdateDTO dto) {
        dto.setArtworkId(artworkId);
        artWorkDAO.updateArtWork(dto);
    }

    @DeleteMapping("/{artworkId}")
    public void deleteArtWork(@PathVariable Long artworkId) {
        artWorkDAO.deleteArtWorkById(artworkId);
    }
}
