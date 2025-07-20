package com.artaura.artaura.service;

import com.artaura.artaura.dao.ArtistDAO;
import com.artaura.artaura.dto.signup.ArtistSignupRequest;
import com.artaura.artaura.dto.artist.ArtistProfileResponseDTO;
import com.artaura.artaura.dto.artist.ArtistProfileUpdateDTO;
import com.artaura.artaura.exception.CustomException;
import com.artaura.artaura.util.PasswordEncoderUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
public class ArtistService {

    @Autowired
    private ArtistDAO artistDAO;

    @Autowired
    private PasswordEncoderUtil encoder;

    @Autowired
    private ImageUploadService imageUploadService;

    public void register(ArtistSignupRequest req) {
        if (artistDAO.emailExists(req.getEmail())) {
            throw new CustomException("Email is already in use", HttpStatus.CONFLICT);
        }

        String hashedPassword = encoder.encode(req.getPassword());
        artistDAO.save(req, hashedPassword);
    }

    public Optional<ArtistProfileResponseDTO> getProfile(Long artistId) {
        return artistDAO.getProfile(artistId);
    }

    public void updateProfile(Long artistId, ArtistProfileUpdateDTO updateDTO) {
        // Validate that the artist exists
        Optional<ArtistProfileResponseDTO> existingProfile = artistDAO.getProfile(artistId);
        if (existingProfile.isEmpty()) {
            throw new CustomException("Artist not found", HttpStatus.NOT_FOUND);
        }

        artistDAO.updateProfile(artistId, updateDTO);
    }

    public String updateAvatarImage(Long artistId, MultipartFile imageFile) throws IOException {
        // Validate artist exists
        Optional<ArtistProfileResponseDTO> existingProfile = artistDAO.getProfile(artistId);
        if (existingProfile.isEmpty()) {
            throw new CustomException("Artist not found", HttpStatus.NOT_FOUND);
        }

        // Validate image file
        if (!imageUploadService.isValidImageFile(imageFile)) {
            throw new CustomException("Invalid image file type. Only JPEG, PNG, GIF, and WebP are allowed.", HttpStatus.BAD_REQUEST);
        }

        if (!imageUploadService.isFileSizeValid(imageFile)) {
            throw new CustomException("File size too large. Maximum size is 5MB.", HttpStatus.BAD_REQUEST);
        }

        // Delete old avatar if exists
        String oldAvatarUrl = existingProfile.get().getAvatarUrl();
        if (oldAvatarUrl != null && !oldAvatarUrl.isEmpty()) {
            imageUploadService.deleteImage(oldAvatarUrl);
        }

        // Save new image
        String newImageUrl = imageUploadService.saveImage(imageFile, "avatar", artistId);

        // Update database
        artistDAO.updateAvatarUrl(artistId, newImageUrl);

        return newImageUrl;
    }

    public String updateCoverImage(Long artistId, MultipartFile imageFile) throws IOException {
        // Validate artist exists
        Optional<ArtistProfileResponseDTO> existingProfile = artistDAO.getProfile(artistId);
        if (existingProfile.isEmpty()) {
            throw new CustomException("Artist not found", HttpStatus.NOT_FOUND);
        }

        // Validate image file
        if (!imageUploadService.isValidImageFile(imageFile)) {
            throw new CustomException("Invalid image file type. Only JPEG, PNG, GIF, and WebP are allowed.", HttpStatus.BAD_REQUEST);
        }

        if (!imageUploadService.isFileSizeValid(imageFile)) {
            throw new CustomException("File size too large. Maximum size is 5MB.", HttpStatus.BAD_REQUEST);
        }

        // Delete old cover image if exists
        String oldCoverUrl = existingProfile.get().getCoverImageUrl();
        if (oldCoverUrl != null && !oldCoverUrl.isEmpty()) {
            imageUploadService.deleteImage(oldCoverUrl);
        }

        // Save new image
        String newImageUrl = imageUploadService.saveImage(imageFile, "cover", artistId);

        // Update database
        artistDAO.updateCoverImageUrl(artistId, newImageUrl);

        return newImageUrl;
    }
}