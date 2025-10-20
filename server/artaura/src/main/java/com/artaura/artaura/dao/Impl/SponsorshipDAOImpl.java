package com.artaura.artaura.dao.Impl;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import com.artaura.artaura.dao.SponsorshipDAO;
import com.artaura.artaura.dto.sponsorship.ChallengeForSponsorshipDTO;
import com.artaura.artaura.dto.sponsorship.SponsorshipOfferDTO;

@Repository
public class SponsorshipDAOImpl implements SponsorshipDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public List<ChallengeForSponsorshipDTO> getActiveChallengesRequestingSponsorship() {
        String sql = "SELECT c.id, c.title, c.category, c.publish_date_time, c.deadline_date_time, " +
                "c.description, c.max_participants, c.rewards, c.sponsorship, c.status " +
                "FROM challenges c " +
                "WHERE (c.status = 'active' OR c.status = 'draft') AND c.sponsorship = 'pending' " +
                "ORDER BY c.deadline_date_time DESC";

        return jdbcTemplate.query(sql, this::mapChallengeForSponsorship);
    }

    @Override
    public Long createSponsorshipOffer(SponsorshipOfferDTO offer) {
        String sql = "INSERT INTO sponsorship_offers (challenge_id, shop_id, discount_code, discount_percentage, status) " +
                "VALUES (?, ?, ?, ?, 'pending')";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, offer.getChallengeId());
            ps.setLong(2, offer.getShopId());
            ps.setString(3, offer.getDiscountCode());
            ps.setInt(4, offer.getDiscountPercentage());
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        if (key == null) {
            throw new RuntimeException("Failed to get generated key for sponsorship offer");
        }

        // Update challenge sponsorship status to 'active' and status to 'active'
        updateChallengeToSponsored(offer.getChallengeId());

        return key.longValue();
    }

    @Override
    public List<SponsorshipOfferDTO> getSponsorshipOffersByShop(Long shopId) {
        String sql = "SELECT so.id, so.challenge_id, so.shop_id, c.title as challenge_title, " +
                "s.shop_name, s.email as shop_email, s.contact_no as shop_contact_no, " +
                "s.description as shop_description, s.owner_name as shop_owner_name, " +
                "so.discount_code, so.discount_percentage, so.status, so.created_at " +
                "FROM sponsorship_offers so " +
                "JOIN challenges c ON so.challenge_id = c.id " +
                "JOIN shops s ON so.shop_id = s.shop_id " +
                "WHERE so.shop_id = ? " +
                "ORDER BY so.created_at DESC";

        return jdbcTemplate.query(sql, this::mapSponsorshipOffer, shopId);
    }

    @Override
    public List<SponsorshipOfferDTO> getSponsorshipOffersByChallenge(Long challengeId) {
        String sql = "SELECT so.id, so.challenge_id, so.shop_id, c.title as challenge_title, " +
                "s.shop_name, s.email as shop_email, s.contact_no as shop_contact_no, " +
                "s.description as shop_description, s.owner_name as shop_owner_name, " +
                "so.discount_code, so.discount_percentage, so.status, so.created_at " +
                "FROM sponsorship_offers so " +
                "JOIN challenges c ON so.challenge_id = c.id " +
                "JOIN shops s ON so.shop_id = s.shop_id " +
                "WHERE so.challenge_id = ? " +
                "ORDER BY so.created_at DESC";

        return jdbcTemplate.query(sql, this::mapSponsorshipOffer, challengeId);
    }

    @Override
    public SponsorshipOfferDTO getSponsorshipOfferById(Long offerId) {
        String sql = "SELECT so.id, so.challenge_id, so.shop_id, c.title as challenge_title, " +
                "s.shop_name, s.email as shop_email, s.contact_no as shop_contact_no, " +
                "s.description as shop_description, s.owner_name as shop_owner_name, " +
                "so.discount_code, so.discount_percentage, so.status, so.created_at " +
                "FROM sponsorship_offers so " +
                "JOIN challenges c ON so.challenge_id = c.id " +
                "JOIN shops s ON so.shop_id = s.shop_id " +
                "WHERE so.id = ?";

        return jdbcTemplate.queryForObject(sql, this::mapSponsorshipOffer, offerId);
    }

    @Override
    public boolean hasShopSponsoredChallenge(Long shopId, Long challengeId) {
        String sql = "SELECT COUNT(*) FROM sponsorship_offers WHERE shop_id = ? AND challenge_id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, shopId, challengeId);
        return count != null && count > 0;
    }

    @Override
    public void updateChallengeToSponsored(Long challengeId) {
        String sql = "UPDATE challenges SET sponsorship = 'active', status = 'active' WHERE id = ? AND sponsorship = 'pending'";
        jdbcTemplate.update(sql, challengeId);
        System.out.println("✅ Updated challenge " + challengeId + " to sponsored and active status");
    }

    @Override
    public void deleteSponsorshipOffer(Long offerId) {
        // First, get the challenge_id to update it back to requesting sponsorship
        String getChallengeSql = "SELECT challenge_id FROM sponsorship_offers WHERE id = ?";
        Long challengeId = jdbcTemplate.queryForObject(getChallengeSql, Long.class, offerId);

        // Delete the offer
        String deleteSql = "DELETE FROM sponsorship_offers WHERE id = ?";
        int rows = jdbcTemplate.update(deleteSql, offerId);

        if (rows == 0) {
            throw new RuntimeException("Sponsorship offer not found");
        }

        // Check if challenge has any other sponsors
        if (challengeId != null) {
            String countSql = "SELECT COUNT(*) FROM sponsorship_offers WHERE challenge_id = ?";
            Integer count = jdbcTemplate.queryForObject(countSql, Integer.class, challengeId);

            // If no more sponsors, set back to pending
            if (count != null && count == 0) {
                String updateSql = "UPDATE challenges SET sponsorship = 'pending' WHERE id = ?";
                jdbcTemplate.update(updateSql, challengeId);
                System.out.println("✅ Updated challenge " + challengeId + " back to requesting sponsorship");
            }
        }
    }

    @Override
    public String generateDiscountCode(String shopName, String challengeTitle) {
        // Create discount code from shop name + random string
        String shopPrefix = shopName.replaceAll("[^A-Za-z0-9]", "").toUpperCase();
        if (shopPrefix.length() > 8) {
            shopPrefix = shopPrefix.substring(0, 8);
        }

        // Add random string
        String randomPart = UUID.randomUUID().toString().replaceAll("-", "").substring(0, 6).toUpperCase();

        String discountCode = shopPrefix + randomPart;

        // Check if code already exists
        String checkSql = "SELECT COUNT(*) FROM sponsorship_offers WHERE discount_code = ?";
        Integer count = jdbcTemplate.queryForObject(checkSql, Integer.class, discountCode);

        // If exists, add another random character
        if (count != null && count > 0) {
            discountCode = discountCode + ((int) (Math.random() * 10));
        }

        return discountCode;
    }

    @Override
    public void updateSponsorshipStatus(Long offerId, String status) {
        String sql = "UPDATE sponsorship_offers SET status = ? WHERE id = ?";
        int rows = jdbcTemplate.update(sql, status, offerId);
        
        if (rows == 0) {
            throw new RuntimeException("Sponsorship offer not found with ID: " + offerId);
        }
        
        System.out.println("✅ Updated sponsorship offer " + offerId + " status to: " + status);
    }

    // Helper method to map ResultSet to ChallengeForSponsorshipDTO
    private ChallengeForSponsorshipDTO mapChallengeForSponsorship(ResultSet rs, int rowNum) throws SQLException {
        ChallengeForSponsorshipDTO dto = new ChallengeForSponsorshipDTO();
        dto.setId(rs.getLong("id"));
        dto.setTitle(rs.getString("title"));
        dto.setCategory(rs.getString("category"));

        Timestamp publishTimestamp = rs.getTimestamp("publish_date_time");
        if (publishTimestamp != null) {
            dto.setPublishDateTime(publishTimestamp.toLocalDateTime());
        }

        Timestamp deadlineTimestamp = rs.getTimestamp("deadline_date_time");
        if (deadlineTimestamp != null) {
            dto.setDeadlineDateTime(deadlineTimestamp.toLocalDateTime());
        }

        dto.setDescription(rs.getString("description"));
        dto.setMaxParticipants(rs.getInt("max_participants"));
        dto.setRewards(rs.getString("rewards"));
        dto.setSponsorship(rs.getString("sponsorship"));
        dto.setStatus(rs.getString("status"));
        // Set current_participants to 0 since we're not counting submissions for
        // sponsorship
        dto.setCurrentParticipants(0);

        return dto;
    }

    // Helper method to map ResultSet to SponsorshipOfferDTO
    private SponsorshipOfferDTO mapSponsorshipOffer(ResultSet rs, int rowNum) throws SQLException {
        SponsorshipOfferDTO dto = new SponsorshipOfferDTO();
        dto.setId(rs.getLong("id"));
        dto.setChallengeId(rs.getLong("challenge_id"));
        dto.setShopId(rs.getLong("shop_id"));
        dto.setChallengeTitle(rs.getString("challenge_title"));
        dto.setShopName(rs.getString("shop_name"));
        dto.setShopEmail(rs.getString("shop_email"));
        dto.setShopContactNo(rs.getString("shop_contact_no"));
        dto.setShopDescription(rs.getString("shop_description"));
        dto.setShopOwnerName(rs.getString("shop_owner_name"));
        dto.setDiscountCode(rs.getString("discount_code"));
        dto.setDiscountPercentage(rs.getInt("discount_percentage"));
        dto.setStatus(rs.getString("status"));

        Timestamp createdTimestamp = rs.getTimestamp("created_at");
        if (createdTimestamp != null) {
            dto.setCreatedAt(createdTimestamp.toLocalDateTime());
        }

        return dto;
    }
}
