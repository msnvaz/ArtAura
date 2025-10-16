package com.artaura.artaura.dao.Impl;

import com.artaura.artaura.dao.DeliveryPartnerDAO;
import com.artaura.artaura.dto.auth.LoginUserDataDTO;
import com.artaura.artaura.dto.auth.DeliveryPartnerDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.Map;
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

    @Override
    public Optional<String> getPartnerNameById(Long partnerId) {
        try {
            String sql = "SELECT partner_name FROM delivery_partners WHERE partner_id = ?";
            String partnerName = jdbc.queryForObject(sql, String.class, partnerId);
            return Optional.ofNullable(partnerName);
        } catch (Exception e) {
            System.out.println("🔍 DeliveryPartnerDAO: No partner name found for ID: " + partnerId);
            return Optional.empty();
        }
    }

    @Override
    public Optional<Map<String, String>> getPartnerProfileById(Long partnerId) {
        try {
            String sql = "SELECT partner_name, email FROM delivery_partners WHERE partner_id = ?";
            Map<String, String> profile = jdbc.queryForObject(sql, (rs, rowNum) -> {
                Map<String, String> map = new HashMap<>();
                map.put("partnerName", rs.getString("partner_name"));
                map.put("email", rs.getString("email"));
                return map;
            }, partnerId);
            return Optional.ofNullable(profile);
        } catch (Exception e) {
            System.out.println("🔍 DeliveryPartnerDAO: No partner profile found for ID: " + partnerId);
            return Optional.empty();
        }
    }

    @Override
    public boolean updatePartnerName(Long partnerId, String newName) {
        try {
            String sql = "UPDATE delivery_partners SET partner_name = ? WHERE partner_id = ?";
            int rowsAffected = jdbc.update(sql, newName, partnerId);
            return rowsAffected > 0;
        } catch (Exception e) {
            System.out.println("❌ DeliveryPartnerDAO: Failed to update partner name for ID: " + partnerId);
            return false;
        }
    }

    @Override
    public boolean updatePartnerPassword(Long partnerId, String hashedPassword) {
        try {
            String sql = "UPDATE delivery_partners SET password = ? WHERE partner_id = ?";
            int rowsAffected = jdbc.update(sql, hashedPassword, partnerId);
            return rowsAffected > 0;
        } catch (Exception e) {
            System.out.println("❌ DeliveryPartnerDAO: Failed to update password for ID: " + partnerId);
            return false;
        }
    }
}