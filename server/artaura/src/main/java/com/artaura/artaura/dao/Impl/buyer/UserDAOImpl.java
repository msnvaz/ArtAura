package com.artaura.artaura.dao.Impl.buyer;

import com.artaura.artaura.dao.buyer.UserDAO;
import com.artaura.artaura.dto.exhibition.UserProfileDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.sql.ResultSet;

@Repository
public class UserDAOImpl implements UserDAO {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public UserProfileDTO getUserProfileById(Long userId) {
        String sql = "SELECT b.buyer_id, b.first_name, b.last_name, b.contactNo, b.email, b.bio, a.city, a.country, a.state, a.street_address, a.zip_code, b.image FROM buyers b LEFT JOIN addresses a ON b.buyer_id = a.buyer_id WHERE b.buyer_id = ?";
        return jdbcTemplate.query(sql, new Object[]{userId}, rs -> {
            if (rs.next()) {
                String name = rs.getString("first_name") + " " + rs.getString("last_name");
                UserProfileDTO dto = new UserProfileDTO();
                dto.setUserId(rs.getLong("buyer_id"));
                dto.setName(name);
                dto.setContactNo(rs.getString("contactNo"));
                dto.setEmail(rs.getString("email"));
                dto.setBio(rs.getString("bio"));
                dto.setCity(rs.getString("city"));
                dto.setCountry(rs.getString("country"));
                dto.setState(rs.getString("state"));
                dto.setStreetAddress(rs.getString("street_address"));
                dto.setZipCode(rs.getString("zip_code"));
                dto.setImage(rs.getString("image"));
                return dto;
            }
            return null;
        });
    }

    @Override
    public int updateUserProfile(Long userId, UserProfileDTO updatedProfile) {
        UserProfileDTO existing = getUserProfileById(userId);
        String firstName = updatedProfile.getName() != null && updatedProfile.getName().contains(" ") ? updatedProfile.getName().split(" ")[0] : (existing.getName() != null && existing.getName().contains(" ") ? existing.getName().split(" ")[0] : "");
        String lastName = updatedProfile.getName() != null && updatedProfile.getName().contains(" ") ? updatedProfile.getName().substring(updatedProfile.getName().indexOf(' ') + 1) : (existing.getName() != null && existing.getName().contains(" ") ? existing.getName().substring(existing.getName().indexOf(' ') + 1) : "");
        String contactNo = updatedProfile.getContactNo() != null ? updatedProfile.getContactNo() : existing.getContactNo();
        String email = updatedProfile.getEmail() != null ? updatedProfile.getEmail() : existing.getEmail();
        String bio = updatedProfile.getBio() != null ? updatedProfile.getBio() : existing.getBio();
        String image = updatedProfile.getImage() != null && !updatedProfile.getImage().isEmpty() ? updatedProfile.getImage() : existing.getImage();
        String city = updatedProfile.getCity() != null ? updatedProfile.getCity() : existing.getCity();
        String country = updatedProfile.getCountry() != null ? updatedProfile.getCountry() : existing.getCountry();
        String state = updatedProfile.getState() != null ? updatedProfile.getState() : existing.getState();
        String streetAddress = updatedProfile.getStreetAddress() != null ? updatedProfile.getStreetAddress() : existing.getStreetAddress();
        String zipCode = updatedProfile.getZipCode() != null ? updatedProfile.getZipCode() : existing.getZipCode();

        String sql = "UPDATE buyers SET first_name = ?, last_name = ?, contactNo = ?, email = ?, bio = ?, image = ? WHERE buyer_id = ?";
        int buyerRows = jdbcTemplate.update(sql,
            firstName,
            lastName,
            contactNo,
            email,
            bio,
            image,
            userId
        );
        String addressSql = "UPDATE addresses SET city = ?, country = ?, state = ?, street_address = ?, zip_code = ? WHERE buyer_id = ?";
        int addressRows = jdbcTemplate.update(addressSql,
            city,
            country,
            state,
            streetAddress,
            zipCode,
            userId
        );
        return buyerRows + addressRows;
    }

    @Override
    public String getPasswordById(Long userId) {
        String sql = "SELECT password FROM buyers WHERE buyer_id = ?";
        return jdbcTemplate.queryForObject(sql, String.class, userId);
    }

    @Override
    public void updatePassword(Long userId, String hashedPassword) {
        String sql = "UPDATE buyers SET password = ? WHERE buyer_id = ?";
        jdbcTemplate.update(sql, hashedPassword, userId);
    }

    @Override
    public int deactivateAccount(Long userId) {
        String sql = "UPDATE buyers SET status = 'Deactivated' WHERE buyer_id = ?";
        return jdbcTemplate.update(sql, userId);
    }
}
