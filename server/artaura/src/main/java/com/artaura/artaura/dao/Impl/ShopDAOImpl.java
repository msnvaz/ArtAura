package com.artaura.artaura.dao.Impl;

import com.artaura.artaura.dao.ShopDAO;
import com.artaura.artaura.dto.shop.ShopDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.util.List;

@Repository
public class ShopDAOImpl implements ShopDAO {

    @Autowired
    private JdbcTemplate jdbc;

    @Override
    public ShopDTO findById(Long shopId) {
        String sql = "SELECT * FROM shops WHERE shop_id = ?";
        return jdbc.queryForObject(sql, (rs, rowNum) -> mapShop(rs), shopId);
    }

    @Override
    public ShopDTO findByEmail(String email) {
        String sql = "SELECT * FROM shops WHERE email = ?";
        return jdbc.queryForObject(sql, (rs, rowNum) -> mapShop(rs), email);
    }

    @Override
    public ShopDTO findByUserId(Long userId) {
        // In this system, userId for shops IS the shop_id (from authentication)
        String sql = "SELECT * FROM shops WHERE shop_id = ?";
        try {
            return jdbc.queryForObject(sql, (rs, rowNum) -> mapShop(rs), userId);
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            // Return null if no shop is found for the user
            return null;
        }
    }

    @Override
    public void updateShop(Long shopId, ShopDTO shop) {
        String sql = "UPDATE shops SET shop_name=?, owner_name=?, email=?, contact_no=?, business_type=?, business_license=?, tax_id=?, description=? WHERE shop_id=?";
        jdbc.update(sql,
                shop.getShopName(),
                shop.getOwnerName(),
                shop.getEmail(),
                shop.getContactNo(),
                shop.getBusinessType(),
                shop.getBusinessLicense(),
                shop.getTaxId(),
                shop.getDescription(),
                shopId);
    }

    @Override
    public void deleteShop(Long shopId) {
        String sql = "DELETE FROM shops WHERE shop_id = ?";
        int rowsAffected = jdbc.update(sql, shopId);
        if (rowsAffected == 0) {
            throw new RuntimeException("Shop not found with ID: " + shopId);
        }
        System.out.println("🗑️ ShopDAOImpl: Deleted shop with ID: " + shopId);
    }

    @Override
    public List<ShopDTO> findAll() {
        String sql = "SELECT shop_id, shop_name, owner_name, email, contact_no, business_type, "
                + "business_license, tax_id, description, status, agreed_terms, created_at "
                + "FROM shops WHERE status = 'active' ORDER BY shop_name";
        return jdbc.query(sql, (rs, rowNum) -> mapShop(rs));
    }

    private ShopDTO mapShop(ResultSet rs) throws java.sql.SQLException {
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
        shop.setStatus(rs.getString("status"));
        shop.setAgreedTerms(rs.getBoolean("agreed_terms"));
        shop.setCreatedAt(rs.getTimestamp("created_at"));
        return shop;
    }
}
