package com.artaura.artaura.dao.Impl;

import com.artaura.artaura.dao.AdminUserDAO;
import com.artaura.artaura.dto.admin.AdminUserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
public class AdminUserDAOImpl implements AdminUserDAO {

    @Autowired
    private JdbcTemplate jdbc;

    private RowMapper<AdminUserDTO> artistMapper = (rs, rowNum) -> {
        AdminUserDTO dto = new AdminUserDTO();
        dto.setUserId(rs.getLong("artist_id"));
        dto.setUserType("artist");
        dto.setEmail(rs.getString("email"));
        dto.setFirstName(rs.getString("first_name"));
        dto.setLastName(rs.getString("last_name"));
        dto.setPassword(rs.getString("password"));
        dto.setStatus(rs.getString("status"));
        dto.setCreatedAt(rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null);
        dto.setAgreedTerms(rs.getBoolean("agreed_terms"));
        dto.setContactNo(rs.getString("contactNo"));
        dto.setBadge(rs.getString("badge"));
        dto.setBio(rs.getString("bio"));
        dto.setNic(rs.getString("nic"));
        dto.setRate(rs.getFloat("rate"));
        dto.setSpecialization(rs.getString("specialization"));
        dto.setLocation(rs.getString("location"));
        dto.setWebsite(rs.getString("website"));
        dto.setInstagram(rs.getString("instagram"));
        dto.setTwitter(rs.getString("twitter"));
        dto.setAvatarUrl(rs.getString("avatar_url"));
        dto.setCoverImageUrl(rs.getString("cover_image_url"));
        dto.setJoinDate(rs.getTimestamp("join_date") != null ? rs.getTimestamp("join_date").toLocalDateTime() : null);
        dto.setTotalViews(rs.getInt("total_views"));
        dto.setTotalFollowers(rs.getInt("total_followers"));
        dto.settotal_artworks(rs.getInt("total_artworks"));
        dto.setTotalSales(rs.getInt("total_sales"));
        dto.setRevenue(rs.getInt("revenue"));
        return dto;
    };

    private RowMapper<AdminUserDTO> buyerMapper = (rs, rowNum) -> {
        AdminUserDTO dto = new AdminUserDTO();
        dto.setUserId(rs.getLong("buyer_id"));
        dto.setUserType("buyer");
        dto.setEmail(rs.getString("email"));
        dto.setFirstName(rs.getString("first_name"));
        dto.setLastName(rs.getString("last_name"));
        dto.setPassword(rs.getString("password"));
        dto.setStatus(rs.getString("status"));
        dto.setCreatedAt(rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null);
        dto.setAgreedTerms(rs.getBoolean("agreed_terms"));
        dto.setContactNo(rs.getString("contactNo"));
        dto.setTotalPurchases(rs.getInt("total_purchases"));
        dto.setSpent(rs.getInt("spent"));
        return dto;
    };

    private RowMapper<AdminUserDTO> moderatorMapper = (rs, rowNum) -> {
        AdminUserDTO dto = new AdminUserDTO();
        dto.setUserId(rs.getLong("moderator_id"));
        dto.setUserType("moderator");
        dto.setEmail(rs.getString("email"));
        dto.setPassword(rs.getString("password"));
        dto.setStatus(rs.getString("status"));
        return dto;
    };

    @Override
    public List<AdminUserDTO> getAllUsers() {
        List<AdminUserDTO> users = new ArrayList<>();
        users.addAll(jdbc.query("SELECT a.*, COUNT(aw_all.artwork_id) AS total_artworks, COUNT(aw_sold.artwork_id) AS total_sales, IFNULL(SUM(aw_sold.price), 0) AS revenue FROM artists a LEFT JOIN artworks aw_all ON a.artist_id = aw_all.artist_id LEFT JOIN artworks aw_sold ON a.artist_id = aw_sold.artist_id AND aw_sold.status = 'Sold' GROUP BY a.artist_id", artistMapper));
        users.addAll(jdbc.query("SELECT b.*, COUNT(p.purchase_id) AS total_purchases, IFNULL(SUM(p.price), 0) AS spent FROM buyers b LEFT JOIN purchases p ON b.buyer_id = p.buyer_id GROUP BY b.buyer_id", buyerMapper));
        users.addAll(jdbc.query("SELECT * FROM moderators", moderatorMapper));
        return users;
    }

    @Override
    public List<AdminUserDTO> getFilteredUsers(Map<String, Object> filters) {
        // TODO: Implement filtering logic
        return new ArrayList<>();
    }

    @Override
    public AdminUserDTO getUserById(Long userId, String userType) {
        // TODO: Implement get by id logic
        return null;
    }

    @Override
    public boolean updateUserStatus(Long userId, String userType, String status) {
        int updated = 0;
        if ("artist".equalsIgnoreCase(userType)) {
            updated = jdbc.update("UPDATE artists SET status = ? WHERE artist_id = ?", status, userId);
        } else if ("buyer".equalsIgnoreCase(userType)) {
            updated = jdbc.update("UPDATE buyers SET status = ? WHERE buyer_id = ?", status, userId);
        } else if ("moderator".equalsIgnoreCase(userType)) {
            updated = jdbc.update("UPDATE moderators SET status = ? WHERE moderator_id = ?", status, userId);
        }
        return updated > 0;
    }

    @Override
    public int getTotalUsersCount() {
        // TODO: Implement total users count logic
        return 0;
    }

    @Override
    public int getTotalArtistsCount() {
        // TODO: Implement total artists count logic
        return 0;
    }

    @Override
    public int getTotalBuyersCount() {
        // TODO: Implement total buyers count logic
        return 0;
    }

    @Override
    public int getTotalModeratorsCount() {
        // TODO: Implement total moderators count logic
        return 0;
    }

    @Override
    public List<AdminUserDTO> getPaginatedUsers(int page, int pageSize) {
        // TODO: Implement pagination logic
        return new ArrayList<>();
    }

    @Override
    public List<AdminUserDTO> getPaginatedFilteredUsers(Map<String, Object> filters, int page, int pageSize) {
        // TODO: Implement paginated filtering logic
        return new ArrayList<>();
    }

    @Override
    public int getFilteredUsersCount(Map<String, Object> filters) {
        // TODO: Implement filtered users count logic
        return 0;
    }
}
