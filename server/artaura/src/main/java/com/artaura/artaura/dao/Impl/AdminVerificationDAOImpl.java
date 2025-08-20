package com.artaura.artaura.dao.Impl;

import com.artaura.artaura.dao.AdminVerificationDAO;
import com.artaura.artaura.dto.admin.VerificationRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
public class AdminVerificationDAOImpl implements AdminVerificationDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public List<VerificationRequestDTO> getAllVerificationRequests() {
        List<VerificationRequestDTO> requests = new ArrayList<>();
        
        // Get artist verification requests (removed WHERE nic_image_url IS NOT NULL)
        String artistSql = """
            SELECT 
                artist_id,
                'artist' as user_type,
                first_name,
                last_name,
                email,
                nic,
                nic_image_url,
                contactNo,
                specialization,
                created_at as join_date,
                status,
                created_at as submission_date
            FROM artists
            """;
        
        List<VerificationRequestDTO> artistRequests = jdbcTemplate.query(artistSql, new ArtistVerificationRowMapper());
        requests.addAll(artistRequests);
        
        // Get shop verification requests (removed WHERE nic_image_url IS NOT NULL)
        String shopSql = """
            SELECT 
                shop_id,
                'shop' as user_type,
                shop_name,
                owner_name,
                nic as owner_nic,
                email,
                nic_image_url,
                tax_id,
                business_license,
                business_type,
                contact_no,
                description,
                created_at,
                status,
                created_at as submission_date
            FROM shops
            """;
        
        List<VerificationRequestDTO> shopRequests = jdbcTemplate.query(shopSql, new ShopVerificationRowMapper());
        requests.addAll(shopRequests);
        
        return requests;
    }

    @Override
    public List<VerificationRequestDTO> getFilteredVerificationRequests(Map<String, Object> filters) {
        // Implementation for filtered requests
        List<VerificationRequestDTO> allRequests = getAllVerificationRequests();
        
        String status = (String) filters.get("status");
        String userType = (String) filters.get("userType");
        String search = (String) filters.get("search");
        
        return allRequests.stream()
            .filter(request -> status == null || request.getStatus().equalsIgnoreCase(status))
            .filter(request -> userType == null || request.getUserType().equalsIgnoreCase(userType))
            .filter(request -> search == null || 
                (request.getUserType().equals("artist") && 
                 (request.getFirstName().toLowerCase().contains(search.toLowerCase()) ||
                  request.getLastName().toLowerCase().contains(search.toLowerCase()) ||
                  request.getEmail().toLowerCase().contains(search.toLowerCase()) ||
                  request.getNic().toLowerCase().contains(search.toLowerCase()))) ||
                (request.getUserType().equals("shop") &&
                 (request.getShopName().toLowerCase().contains(search.toLowerCase()) ||
                  request.getOwnerName().toLowerCase().contains(search.toLowerCase()) ||
                  request.getEmail().toLowerCase().contains(search.toLowerCase()) ||
                  request.getTaxId().toLowerCase().contains(search.toLowerCase()))))
            .toList();
    }

    @Override
    public boolean updateVerificationStatus(String requestId, String userType, String status) {
        try {
            String[] parts = requestId.split("-");
            Long id = Long.parseLong(parts[1]);
            
            String sql;
            if ("artist".equals(userType)) {
                sql = "UPDATE artists SET status = ? WHERE artist_id = ?";
            } else {
                sql = "UPDATE shops SET status = ? WHERE shop_id = ?";
            }
            
            int rowsAffected = jdbcTemplate.update(sql, status, id);
            return rowsAffected > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean updateVerificationStatus(String requestId, String userType, String status, String rejectionReason) {
        // For now, just update status. You can extend this to store rejection reason in a separate table
        return updateVerificationStatus(requestId, userType, status);
    }

    @Override
    public int getTotalVerificationRequestsCount() {
        String artistCountSql = "SELECT COUNT(*) FROM artists";
        String shopCountSql = "SELECT COUNT(*) FROM shops";
        
        Integer artistCount = jdbcTemplate.queryForObject(artistCountSql, Integer.class);
        Integer shopCount = jdbcTemplate.queryForObject(shopCountSql, Integer.class);
        
        return (artistCount != null ? artistCount : 0) + (shopCount != null ? shopCount : 0);
    }

    @Override
    public int getPendingVerificationRequestsCount() {
        String artistCountSql = "SELECT COUNT(*) FROM artists WHERE status = 'Pending'";
        String shopCountSql = "SELECT COUNT(*) FROM shops WHERE status = 'Pending'";
        
        Integer artistCount = jdbcTemplate.queryForObject(artistCountSql, Integer.class);
        Integer shopCount = jdbcTemplate.queryForObject(shopCountSql, Integer.class);
        
        return (artistCount != null ? artistCount : 0) + (shopCount != null ? shopCount : 0);
    }

    @Override
    public int getVerifiedRequestsCount() {
        String artistCountSql = "SELECT COUNT(*) FROM artists WHERE status = 'Active'";
        String shopCountSql = "SELECT COUNT(*) FROM shops WHERE status = 'Active'";
        
        Integer artistCount = jdbcTemplate.queryForObject(artistCountSql, Integer.class);
        Integer shopCount = jdbcTemplate.queryForObject(shopCountSql, Integer.class);
        
        return (artistCount != null ? artistCount : 0) + (shopCount != null ? shopCount : 0);
    }

    @Override
    public int getRejectedRequestsCount() {
        String artistCountSql = "SELECT COUNT(*) FROM artists WHERE status = 'Suspended'";
        String shopCountSql = "SELECT COUNT(*) FROM shops WHERE status = 'Suspended'";
        
        Integer artistCount = jdbcTemplate.queryForObject(artistCountSql, Integer.class);
        Integer shopCount = jdbcTemplate.queryForObject(shopCountSql, Integer.class);
        
        return (artistCount != null ? artistCount : 0) + (shopCount != null ? shopCount : 0);
    }

    private static class ArtistVerificationRowMapper implements RowMapper<VerificationRequestDTO> {
        @Override
        public VerificationRequestDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            VerificationRequestDTO dto = new VerificationRequestDTO();
            // Create unique ID with prefix
            dto.setId("ART-" + rs.getLong("artist_id"));
            dto.setUserType(rs.getString("user_type"));
            dto.setArtistId(rs.getLong("artist_id"));
            dto.setFirstName(rs.getString("first_name"));
            dto.setLastName(rs.getString("last_name"));
            dto.setEmail(rs.getString("email"));
            dto.setNic(rs.getString("nic"));
            dto.setNicImageUrl(rs.getString("nic_image_url"));
            dto.setContactNo(rs.getString("contactNo"));
            dto.setSpecialization(rs.getString("specialization"));
            
            // Handle timestamp conversion
            java.sql.Timestamp joinTimestamp = rs.getTimestamp("join_date");
            if (joinTimestamp != null) {
                dto.setJoinDate(joinTimestamp.toLocalDateTime());
            }
            
            java.sql.Timestamp submissionTimestamp = rs.getTimestamp("submission_date");
            if (submissionTimestamp != null) {
                dto.setSubmissionDate(submissionTimestamp.toLocalDateTime());
            }
            
            String status = rs.getString("status");
            if ("Active".equals(status)) {
                dto.setStatus("verified");
            } else if ("Pending".equals(status)) {
                dto.setStatus("pending");
            } else if ("Suspended".equals(status)) {
                dto.setStatus("rejected");
            }
            
            return dto;
        }
    }

    private static class ShopVerificationRowMapper implements RowMapper<VerificationRequestDTO> {
        @Override
        public VerificationRequestDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            VerificationRequestDTO dto = new VerificationRequestDTO();
            // Create unique ID with prefix
            dto.setId("SHP-" + rs.getLong("shop_id"));
            dto.setUserType(rs.getString("user_type"));
            dto.setShopId(rs.getLong("shop_id"));
            dto.setShopName(rs.getString("shop_name"));
            dto.setOwnerName(rs.getString("owner_name"));
            dto.setOwnerNic(rs.getString("owner_nic"));
            dto.setEmail(rs.getString("email"));
            dto.setNicImageUrl(rs.getString("nic_image_url"));
            dto.setTaxId(rs.getString("tax_id"));
            dto.setBusinessLicense(rs.getString("business_license"));
            dto.setBusinessType(rs.getString("business_type"));
            dto.setContactNo(rs.getString("contact_no"));
            dto.setDescription(rs.getString("description"));
            
            // Handle timestamp conversion
            java.sql.Timestamp createdTimestamp = rs.getTimestamp("created_at");
            if (createdTimestamp != null) {
                dto.setCreatedAt(createdTimestamp.toLocalDateTime());
            }
            
            java.sql.Timestamp submissionTimestamp = rs.getTimestamp("submission_date");
            if (submissionTimestamp != null) {
                dto.setSubmissionDate(submissionTimestamp.toLocalDateTime());
            }
            
            String status = rs.getString("status");
            if ("Active".equals(status)) {
                dto.setStatus("verified");
            } else if ("Pending".equals(status)) {
                dto.setStatus("pending");
            } else if ("Suspended".equals(status)) {
                dto.setStatus("rejected");
            }
            
            return dto;
        }
    }
}
    

