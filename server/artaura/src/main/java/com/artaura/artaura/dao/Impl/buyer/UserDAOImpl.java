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
        String sql = "SELECT buyer_id, first_name, last_name, contactNo FROM buyers WHERE buyer_id = ?";
        return jdbcTemplate.query(sql, new Object[]{userId}, rs -> {
            if (rs.next()) {
                String name = rs.getString("first_name") + " " + rs.getString("last_name");
                return new UserProfileDTO(
                    rs.getLong("buyer_id"),
                    name,
                    rs.getString("contactNo")
                );
            }
            return null;
        });
    }
}
