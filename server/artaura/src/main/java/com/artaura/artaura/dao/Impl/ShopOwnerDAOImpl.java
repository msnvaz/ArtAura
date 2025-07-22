package com.artaura.artaura.dao.Impl;

import com.artaura.artaura.dao.ShopOwnerDAO;
import com.artaura.artaura.dto.signup.ShopOwnerSignupRequest;
import com.artaura.artaura.dto.auth.LoginUserDataDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;

import java.sql.PreparedStatement;
import java.sql.Statement;

import java.util.Optional;

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
        String shopSql = "INSERT INTO shops (shop_name, owner_name, email, password, contact_no, business_type, description, business_license, tax_id, agreed_terms, status, created_at) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";

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
            ps.setString(11, "Active");
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

    public JdbcTemplate getJdbc() {
        return jdbc;
    }

    @Override
    public Optional<LoginUserDataDTO> findByEmail(String email) {
        try {
            String sql = "SELECT shop_id, email, password FROM shops WHERE email = ?";
            LoginUserDataDTO data = jdbc.queryForObject(sql, (rs, rowNum) ->
                    new LoginUserDataDTO(
                            rs.getLong("shop_id"),
                            rs.getString("email"),
                            rs.getString("password")
                    ), email
            );
            return Optional.ofNullable(data);
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}
