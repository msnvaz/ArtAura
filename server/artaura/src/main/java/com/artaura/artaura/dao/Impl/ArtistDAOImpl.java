package com.artaura.artaura.dao;

import com.artaura.artaura.dto.signup.ArtistSignupRequest;
import com.artaura.artaura.dto.auth.LoginUserDataDTO;
import com.artaura.artaura.dto.artist.ArtistProfileResponseDTO;
import com.artaura.artaura.dto.artist.ArtistProfileUpdateDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public class ArtistDAOImpl implements ArtistDAO {

    @Autowired
    private JdbcTemplate jdbc;

    public boolean emailExists(String email) {
        String sql = "SELECT COUNT(*) FROM artists WHERE email = ?";
        Integer count = jdbc.queryForObject(sql, Integer.class, email);
        return count != null && count > 0;
    }

    @Override
    public void save(ArtistSignupRequest req, String hashedPassword) {

        String sql = "INSERT INTO artists (first_name, last_name, email, contactNo, password, nic, agreed_terms, specialization) "
                + "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        jdbc.update(sql,
                req.getFirstName(),
                req.getLastName(),
                req.getEmail(),
                req.getContactNo(),
                hashedPassword,
                req.getNic(),
                req.isAgreedTerms(),
                req.getSpecialization() // assuming this is your specialization field
        );
    }

    @Override
    public Optional<LoginUserDataDTO> findByEmail(String email) {
        try {
            String sql = "SELECT artist_id, email, password FROM artists WHERE email = ?";
            LoginUserDataDTO loginUser = jdbc.queryForObject(sql, (rs, rowNum) -> {
                LoginUserDataDTO dto = new LoginUserDataDTO();
                dto.setUserId(rs.getLong("artist_id"));
                dto.setEmail(rs.getString("email"));
                dto.setPassword(rs.getString("password"));
                return dto;
            }, email);
            return Optional.ofNullable(loginUser);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<ArtistProfileResponseDTO> getProfile(Long artistId) {
        try {
            String sql = """
                SELECT 
                    a.artist_id,
                    a.first_name,
                    a.last_name,
                    a.email,
                    a.contactNo,
                    a.bio,
                    a.location,
                    a.website,
                    a.instagram,
                    a.twitter,
                    a.avatar_url,
                    a.cover_image_url,
                    a.join_date,
                    a.total_views,
                    a.total_followers,
                    a.total_sales,
                    a.specialization,
                    COUNT(aw.artwork_id) as artworks_count
                FROM artists a
                LEFT JOIN artworks aw ON a.artist_id = aw.artist_id
                WHERE a.artist_id = ?
                GROUP BY a.artist_id
                """;

            ArtistProfileResponseDTO profile = jdbc.queryForObject(sql, (rs, rowNum) -> {
                ArtistProfileResponseDTO dto = new ArtistProfileResponseDTO();
                dto.setArtistId(rs.getLong("artist_id"));
                dto.setFirstName(rs.getString("first_name"));
                dto.setLastName(rs.getString("last_name"));
                dto.setEmail(rs.getString("email"));
                dto.setContactNo(rs.getString("contactNo"));
                dto.setBio(rs.getString("bio"));
                dto.setLocation(rs.getString("location"));
                dto.setWebsite(rs.getString("website"));
                dto.setInstagram(rs.getString("instagram"));
                dto.setTwitter(rs.getString("twitter"));
                dto.setAvatarUrl(rs.getString("avatar_url"));
                dto.setCoverImageUrl(rs.getString("cover_image_url"));

                // Handle LocalDateTime conversion
                java.sql.Timestamp joinTimestamp = rs.getTimestamp("join_date");
                if (joinTimestamp != null) {
                    dto.setJoinDate(joinTimestamp.toLocalDateTime());
                }

                dto.setTotalViews(rs.getInt("total_views"));
                dto.setTotalFollowers(rs.getInt("total_followers"));
                dto.setTotalSales(rs.getInt("total_sales"));
                dto.setSpecialization(rs.getString("specialization"));
                dto.setArtworksCount(rs.getInt("artworks_count"));

                return dto;
            }, artistId);

            return Optional.ofNullable(profile);
        } catch (Exception e) {
            e.printStackTrace(); // For debugging
            return Optional.empty();
        }
    }

    @Override
    public void updateProfile(Long artistId, ArtistProfileUpdateDTO updateDTO) {
        String sql = """
            UPDATE artists 
            SET first_name = ?, 
                last_name = ?, 
                bio = ?, 
                location = ?, 
                website = ?, 
                instagram = ?, 
                twitter = ?, 
                contactNo = ?
            WHERE artist_id = ?
            """;

        jdbc.update(sql,
                updateDTO.getFirstName(),
                updateDTO.getLastName(),
                updateDTO.getBio(),
                updateDTO.getLocation(),
                updateDTO.getWebsite(),
                updateDTO.getInstagram(),
                updateDTO.getTwitter(),
                updateDTO.getContactNo(),
                artistId
        );
    }

    @Override
    public void updateAvatarUrl(Long artistId, String avatarUrl) {
        String sql = "UPDATE artists SET avatar_url = ? WHERE artist_id = ?";
        jdbc.update(sql, avatarUrl, artistId);
    }

    @Override
    public void updateCoverImageUrl(Long artistId, String coverImageUrl) {
        String sql = "UPDATE artists SET cover_image_url = ? WHERE artist_id = ?";
        jdbc.update(sql, coverImageUrl, artistId);
    }
}
