package com.artaura.artaura.dao.Impl;

import com.artaura.artaura.dao.ShopDAO;
import com.artaura.artaura.dto.shop.ShopDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;

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