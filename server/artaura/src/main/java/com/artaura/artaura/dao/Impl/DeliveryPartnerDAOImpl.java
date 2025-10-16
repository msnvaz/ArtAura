package com.artaura.artaura.dao.Impl;

import com.artaura.artaura.dao.DeliveryPartnerDAO;
import com.artaura.artaura.dto.auth.LoginUserDataDTO;
import com.artaura.artaura.dto.auth.DeliveryPartnerDTO;
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

    private RowMapper<DeliveryPartnerDTO> deliveryPartnerRowMapper = (rs, rowNum) -> {
        return new DeliveryPartnerDTO(
            rs.getLong("partner_id"),
            rs.getString("email"),
            rs.getString("password"),
            rs.getString("partner_name")
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

    @Override
    public Optional<DeliveryPartnerDTO> findByEmailWithName(String email) {
        try {
            String sql = "SELECT partner_id, email, password, partner_name FROM delivery_partners WHERE email = ?";
            DeliveryPartnerDTO deliveryPartner = jdbc.queryForObject(sql, deliveryPartnerRowMapper, email);
            return Optional.of(deliveryPartner);
        } catch (Exception e) {
            System.out.println("🔍 DeliveryPartnerDAO: No delivery partner found for email: " + email);
            return Optional.empty();
        }
    }

    @Override
    public Optional<DeliveryPartnerDTO> findByUserId(Long userId) {
        try {
            String sql = "SELECT partner_id, email, password, partner_name FROM delivery_partners WHERE partner_id = ?";
            DeliveryPartnerDTO deliveryPartner = jdbc.queryForObject(sql, deliveryPartnerRowMapper, userId);
            return Optional.of(deliveryPartner);
        } catch (Exception e) {
            System.out.println("🔍 DeliveryPartnerDAO: No delivery partner found for userId: " + userId);
            return Optional.empty();
        }
    }
}