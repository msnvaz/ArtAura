package com.artaura.artaura.dao.impl;

import com.artaura.artaura.dao.impl.BuyerDAO;
import com.artaura.artaura.dto.ArtistSignupRequest;
import com.artaura.artaura.dto.BuyerSignupRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;

@Repository
public class BuyerDAOImpl implements BuyerDAO {

    @Autowired
    private JdbcTemplate jdbc;

    public boolean emailExists(String email) {
        String sql = "SELECT COUNT(*) FROM buyers WHERE email = ?";
        Integer count = jdbc.queryForObject(sql, Integer.class, email);
        return count != null && count > 0;
    }

    @Override
    public void save(BuyerSignupRequest req, String hashedPassword) {

        String sql = "INSERT INTO buyers (first_name, last_name, email, contactNo, password, agreed_terms) " +
                "VALUES (?, ?, ?, ?, ?, ?)";

        jdbc.update(sql,
                req.getFirstName(),
                req.getLastName(),
                req.getEmail(),
                req.getContactNo(),
                hashedPassword,                      // use hashedPassword, not raw password
                req.isAgreedTerms()                 // assuming it's a boolean
        );
    }

    @Override
    public BuyerSignupRequest findByEmail(String email) {
        try {
            return jdbc.queryForObject(
                    "SELECT * FROM buyers WHERE email = ?",
                    (ResultSet rs, int rowNum) -> {
                        BuyerSignupRequest a = new BuyerSignupRequest();
                        a.setEmail(rs.getString("email"));
                        a.setFirstName(rs.getString("first_name"));
                        a.setLastName(rs.getString("last_name"));
                        a.setPassword(rs.getString("password"));
                        a.setContactNo(rs.getString("contactNo"));
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

