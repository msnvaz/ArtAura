package com.artaura.artaura.dao.impl;

import com.artaura.artaura.dao.impl.ShopOwnerDAO;
import com.artaura.artaura.dto.ShopOwnerSignupRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;

import java.sql.PreparedStatement;
import java.sql.Statement;

import java.sql.ResultSet;

@Repository
public class ShopOwnerDAOImpl implements ShopOwnerDAO {

    @Autowired
    private JdbcTemplate jdbc;

    public boolean emailExists(String email) {
        String sql = "SELECT COUNT(*) FROM shops WHERE email = ?";
        Integer count = jdbc.queryForObject(sql, Integer.class, email);
        return count != null && count > 0;
    }

    @Override
    public void save(ShopOwnerSignupRequest req, String hashedPassword) {

        // 2. Insert into shops table
        String shopSql = "INSERT INTO shops (shop_name, owner_name, email, password, contact_no, business_type, description, business_license, tax_id, agreed_terms, created_at) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";

        // Use KeyHolder to retrieve generated shop_id
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbc.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(shopSql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, req.getShopName());
            ps.setString(2, req.getOwnerName());
            ps.setString(3, req.getEmail());
            ps.setString(4, hashedPassword);
            ps.setString(5, req.getContactNo());
            ps.setString(6, req.getBusinessType());
            ps.setString(7, req.getDescription());
            ps.setString(8, req.getBusinessLicense());
            ps.setString(9, req.getTaxId());
            ps.setBoolean(10, req.isAgreedTerms());
            return ps;
        }, keyHolder);

        // 2. Get the generated shop_id
        Number generatedShopId = keyHolder.getKey();
        if (generatedShopId == null) {
            throw new RuntimeException("Failed to retrieve generated shop_id.");
        }

        // 3. Insert into addresses table
        String addressSql = "INSERT INTO addresses (street_address, city, state, zip_code, country, shop_id) VALUES (?, ?, ?, ?, ?, ?)";

        jdbc.update(addressSql,
                req.getStreetAddress(),
                req.getCity(),
                req.getState(),
                req.getZipCode(),
                req.getCountry(),
                generatedShopId.longValue()
        );
    }


    @Override
    public ShopOwnerSignupRequest findByEmail(String email) {
        try {
            return jdbc.queryForObject(
                    "SELECT * FROM shops WHERE email = ?",
                    (ResultSet rs, int rowNum) -> {
                        ShopOwnerSignupRequest a = new ShopOwnerSignupRequest();
                        a.setShopName(rs.getString("shop_name"));
                        a.setOwnerName(rs.getString("owner_name"));
                        a.setEmail(rs.getString("email"));
                        a.setPassword(rs.getString("password"));
                        a.setContactNo(rs.getString("contact_no"));
                        a.setBusinessType(rs.getString("business_type"));
                        a.setDescription(rs.getString("description"));
                        a.setBusinessLicense(rs.getString("business_license"));
                        a.setTaxId(rs.getString("tax_id"));
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
