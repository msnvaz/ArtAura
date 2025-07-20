package com.artaura.artaura.dao.Impl;

import com.artaura.artaura.dao.ArtistDAO;
import com.artaura.artaura.dto.signup.ArtistSignupRequest;
import com.artaura.artaura.dto.auth.LoginUserDataDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

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

        String sql = "INSERT INTO artists (first_name, last_name, email, contactNo, password, nic, agreed_terms, specialization) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        jdbc.update(sql,
                req.getFirstName(),
                req.getLastName(),
                req.getEmail(),
                req.getContactNo(),
                hashedPassword,
                req.getNic(),
                req.isAgreedTerms(),
                req.getSpecialization()   // assuming this is your specialization field
        );
    }

    public JdbcTemplate getJdbc() {
        return jdbc;
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
}
