package com.artaura.artaura.dao.impl;

import com.artaura.artaura.dao.impl.ArtistDAO;
import com.artaura.artaura.dto.ArtistSignupRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;

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


    @Override
    public ArtistSignupRequest findByEmail(String email) {
        try {
            return jdbc.queryForObject(
                    "SELECT * FROM artists WHERE email = ?",
                    (ResultSet rs, int rowNum) -> {
                        ArtistSignupRequest a = new ArtistSignupRequest();
                        a.setEmail(rs.getString("email"));
                        a.setFirstName(rs.getString("first_name"));
                        a.setLastName(rs.getString("last_name"));
                        a.setPassword(rs.getString("password"));
                        a.setContactNo(rs.getString("contactNo"));
                        a.setNic(rs.getString("nic"));
                        a.setSpecialization(rs.getString("specialization"));
                        a.setBio(rs.getString("bio"));
                        a.setRate(rs.getFloat("rate"));
                        a.setBadge(rs.getString("badge"));
                        a.setAgreedTerms(rs.getBoolean("agreed_terms"));
                        a.setStreetAddress(rs.getString("street_address"));
                        a.setCity(rs.getString("city"));
                        a.setState(rs.getString("state"));
                        a.setZipCode(rs.getString("zip_code"));
                        a.setCountry(rs.getString("country"));
                        return a;
                    }, email);
        } catch (Exception e) {
            return null;
        }
    }
}
