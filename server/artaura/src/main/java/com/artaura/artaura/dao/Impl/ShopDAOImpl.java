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

    // This is the method being called from AuthController
    @Override
    public ShopDTO getShopByEmail(String email) {
        String sql = "SELECT * FROM shops WHERE email = ?";

        try {
            System.out.println("🗃️ Executing query: " + sql + " with email: " + email);

            ShopDTO shop = jdbcTemplate.queryForObject(sql, new Object[] { email }, (rs, rowNum) -> {
                ShopDTO shopDto = new ShopDTO();
                shopDto.setShopId(rs.getLong("shop_id"));
                // Check if user_id column exists, if not handle gracefully
                try {
                    shopDto.setUserId(rs.getLong("user_id"));
                } catch (SQLException e) {
                    System.out.println("⚠️ user_id column not found, setting to null");
                    shopDto.setUserId(null);
                }
                shopDto.setShopName(rs.getString("shop_name"));
                shopDto.setOwnerName(rs.getString("owner_name"));
                shopDto.setEmail(rs.getString("email"));
                shopDto.setContactNo(rs.getString("contact_no"));
                shopDto.setBusinessType(rs.getString("business_type"));
                shopDto.setBusinessLicense(rs.getString("business_license"));
                shopDto.setTaxId(rs.getString("tax_id"));
                shopDto.setDescription(rs.getString("description"));
                shopDto.setStatus(rs.getString("status"));
                shopDto.setAgreedTerms(rs.getBoolean("agreed_terms"));
                shopDto.setCreatedAt(rs.getTimestamp("created_at"));
                return shopDto;
            });

            System.out.println("✅ Shop found by email: " + shop.getShopName() + " (Shop ID: " + shop.getShopId() + ")");
            return shop;

        } catch (Exception e) {
            System.out.println("❌ Error fetching shop by email " + email + ": " + e.getMessage());
            return null;
        }
    }

    @Override
    public ShopDTO getShopByUserId(Long userId) {
        String sql = "SELECT * FROM shops WHERE user_id = ?";

        try {
            System.out.println("🗃️ Executing query: " + sql + " with userId: " + userId);

            ShopDTO shop = jdbcTemplate.queryForObject(sql, new Object[] { userId }, (rs, rowNum) -> {
                ShopDTO shopDto = new ShopDTO();
                shopDto.setShopId(rs.getLong("shop_id"));
                shopDto.setUserId(rs.getLong("user_id"));
                shopDto.setShopName(rs.getString("shop_name"));
                shopDto.setOwnerName(rs.getString("owner_name"));
                shopDto.setEmail(rs.getString("email"));
                shopDto.setContactNo(rs.getString("contact_no"));
                shopDto.setBusinessType(rs.getString("business_type"));
                shopDto.setBusinessLicense(rs.getString("business_license"));
                shopDto.setTaxId(rs.getString("tax_id"));
                shopDto.setDescription(rs.getString("description"));
                shopDto.setStatus(rs.getString("status"));
                shopDto.setAgreedTerms(rs.getBoolean("agreed_terms"));
                shopDto.setCreatedAt(rs.getTimestamp("created_at"));
                return shopDto;
            });

            System.out.println("✅ Shop found: " + shop.getShopName() + " (Shop ID: " + shop.getShopId() + ", User ID: "
                    + shop.getUserId() + ")");
            return shop;

        } catch (Exception e) {
            System.out.println("❌ Error fetching shop by userId " + userId + ": " + e.getMessage());
            return null;
        }
    }

    @Override
    public ShopDTO getShopById(Long shopId) {
        String sql = "SELECT * FROM shops WHERE shop_id = ?";

        try {
            return jdbcTemplate.queryForObject(sql, new Object[] { shopId }, (rs, rowNum) -> {
                ShopDTO shop = new ShopDTO();
                shop.setShopId(rs.getLong("shop_id"));
                // Handle user_id gracefully
                try {
                    shop.setUserId(rs.getLong("user_id"));
                } catch (SQLException e) {
                    shop.setUserId(null);
                }
                shop.setShopName(rs.getString("shop_name"));
                shop.setOwnerName(rs.getString("owner_name"));
                shop.setEmail(rs.getString("email"));
                shop.setContactNo(rs.getString("contact_no"));
                shop.setBusinessType(rs.getString("business_type"));
                shop.setBusinessLicense(rs.getString("business_license"));
                shop.setTaxId(rs.getString("tax_id"));
                shop.setDescription(rs.getString("description"));
                shop.setStatus(rs.getString("status"));
                shop.setAgreedTerms(rs.getBoolean("agreed_terms"));
                shop.setCreatedAt(rs.getTimestamp("created_at"));
                return shop;
            });
        } catch (Exception e) {
            System.out.println("Error fetching shop by ID: " + e.getMessage());
            return null;
        }
    }

    // Updated ShopRowMapper to handle user_id
    private static class ShopRowMapper implements RowMapper<ShopDTO> {
        @Override
        public ShopDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            ShopDTO shop = new ShopDTO();

            shop.setShopId(rs.getLong("shop_id"));
            shop.setShopName(rs.getString("shop_name"));
            shop.setOwnerName(rs.getString("owner_name"));
            shop.setEmail(rs.getString("email"));
            shop.setContactNo(rs.getString("contact_no"));
            shop.setBusinessType(rs.getString("business_type"));
            shop.setBusinessLicense(rs.getString("business_license"));
            shop.setTaxId(rs.getString("tax_id"));
            shop.setDescription(rs.getString("description"));
            shop.setAgreedTerms(rs.getBoolean("agreed_terms"));
            shop.setStatus(rs.getString("status"));

            // Handle user_id gracefully
            try {
                shop.setUserId(rs.getLong("user_id"));
            } catch (SQLException e) {
                shop.setUserId(null);
            }

            // Handle created_at timestamp
            if (rs.getTimestamp("created_at") != null) {
                shop.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            }

            return shop;
        }
    }
}