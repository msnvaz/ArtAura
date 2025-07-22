package com.artaura.artaura.dao.Impl;

import com.artaura.artaura.dao.BuyerDAO;
import com.artaura.artaura.dto.signup.BuyerSignupRequest;
import com.artaura.artaura.dto.auth.LoginUserDataDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Optional;

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

        String sql = "INSERT INTO buyers (first_name, last_name, email, contactNo, password, agreed_terms,status) " +
                "VALUES (?, ?, ?, ?, ?, ?,?)";

        jdbc.update(sql,
                req.getFirstName(),
                req.getLastName(),
                req.getEmail(),
                req.getContactNo(),
                hashedPassword,                      // use hashedPassword, not raw password
                req.isAgreedTerms(),                // assuming it's a boolean
                "Active"                            // Add the status parameter
        );
    }

    @Override
    public Optional<LoginUserDataDTO> findByEmail(String email) {
        try {
            String sql = "SELECT buyer_id, email, password FROM buyers WHERE email = ?";
            LoginUserDataDTO data = jdbc.queryForObject(sql, (rs, rowNum) ->
                    new LoginUserDataDTO(
                            rs.getLong("buyer_id"),
                            rs.getString("email"),
                            rs.getString("password")
                    ), email
            );
            return Optional.ofNullable(data);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public JdbcTemplate getJdbc() {
        return jdbc;
    }
}

