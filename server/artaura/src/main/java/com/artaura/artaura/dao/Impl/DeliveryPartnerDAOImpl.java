package com.artaura.artaura.dao.Impl;

import com.artaura.artaura.dao.DeliveryPartnerDAO;
import com.artaura.artaura.dto.auth.LoginUserDataDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class DeliveryPartnerDAOImpl implements DeliveryPartnerDAO {

    @Autowired
    private JdbcTemplate jdbc;

    private RowMapper<LoginUserDataDTO> rowMapper = (rs, rowNum) -> {
        return new LoginUserDataDTO(
            rs.getLong("partner_id"),
            rs.getString("email"),
            rs.getString("password")
        );
    };

    @Override
    public Optional<LoginUserDataDTO> findByEmail(String email) {
        try {
            String sql = "SELECT partner_id, email, password FROM delivery_partners WHERE email = ?";
            LoginUserDataDTO user = jdbc.queryForObject(sql, rowMapper, email);
            return Optional.of(user);
        } catch (Exception e) {
            System.out.println("🔍 DeliveryPartnerDAO: No delivery partner found for email: " + email);
            return Optional.empty();
        }
    }
}