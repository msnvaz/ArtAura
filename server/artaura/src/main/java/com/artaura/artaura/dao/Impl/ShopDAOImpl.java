package com.artaura.artaura.dao.Impl;

import com.artaura.artaura.dao.ShopDAO;
import com.artaura.artaura.dto.shop.ShopDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public class ShopDAOImpl implements ShopDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public ShopDTO findById(Long shopId) {
        String sql = "SELECT * FROM shops WHERE shop_id = ?";
        List<ShopDTO> shops = jdbcTemplate.query(sql, new ShopRowMapper(), shopId);

        if (shops.isEmpty()) {
            throw new RuntimeException("Shop not found with id: " + shopId);
        }

        return shops.get(0);
    }

    @Override
    public ShopDTO findByEmail(String email) {
        String sql = "SELECT * FROM shops WHERE email = ?";
        List<ShopDTO> shops = jdbcTemplate.query(sql, new ShopRowMapper(), email);

        if (shops.isEmpty()) {
            throw new RuntimeException("Shop not found with email: " + email);
        }

        return shops.get(0);
    }

    @Override
    public void updateShop(Long shopId, ShopDTO shop) {
        String sql = "UPDATE shops SET shop_name = ?, owner_name = ?, email = ?, " +
                "contact_no = ?, business_type = ?, business_license = ?, " +
                "tax_id = ?, description = ? WHERE shop_id = ?";

        int rowsAffected = jdbcTemplate.update(sql,
                shop.getShopName(),
                shop.getOwnerName(),
                shop.getEmail(),
                shop.getContactNo(),
                shop.getBusinessType(),
                shop.getBusinessLicense(),
                shop.getTaxId(),
                shop.getDescription(),
                shopId);

        if (rowsAffected == 0) {
            throw new RuntimeException("Shop not found with id: " + shopId);
        }
    }

    private static class ShopRowMapper implements RowMapper<ShopDTO> {
        @Override
        public ShopDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            ShopDTO shop = new ShopDTO();

            // Map database columns to DTO fields
            shop.setShopId(rs.getLong("shop_id")); // shop_id
            shop.setShopName(rs.getString("shop_name")); // shop_name
            shop.setOwnerName(rs.getString("owner_name")); // owner_name
            shop.setEmail(rs.getString("email")); // email
            shop.setContactNo(rs.getString("contact_no")); // contact_no
            shop.setBusinessType(rs.getString("business_type")); // business_type
            shop.setBusinessLicense(rs.getString("business_license")); // business_license
            shop.setTaxId(rs.getString("tax_id")); // tax_id
            shop.setDescription(rs.getString("description")); // description
            shop.setAgreedTerms(rs.getBoolean("agreed_terms")); // agreed_terms
            shop.setStatus(rs.getString("status")); // status

            // Handle created_at timestamp
            if (rs.getTimestamp("created_at") != null) {
                shop.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            }

            return shop;
        }
    }
}