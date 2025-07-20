package com.artaura.artaura.dao;

import com.artaura.artaura.dto.signup.ArtistSignupRequest;
import com.artaura.artaura.dto.auth.LoginUserDataDTO;
import com.artaura.artaura.dto.artist.ArtistProfileResponseDTO;
import com.artaura.artaura.dto.artist.ArtistProfileUpdateDTO;

import java.util.Optional;

public interface ArtistDAO {

    // ✅ Declare it here
    boolean emailExists(String email);

    void save(ArtistSignupRequest request, String hashedPassword);

    Optional<LoginUserDataDTO> findByEmail(String email);

    // Profile methods
    Optional<ArtistProfileResponseDTO> getProfile(Long artistId);

    void updateProfile(Long artistId, ArtistProfileUpdateDTO updateDTO);

    // Image methods
    void updateAvatarUrl(Long artistId, String avatarUrl);

    void updateCoverImageUrl(Long artistId, String coverImageUrl);
}
