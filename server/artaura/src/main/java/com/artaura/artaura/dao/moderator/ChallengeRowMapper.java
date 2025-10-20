package com.artaura.artaura.dao.moderator;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.artaura.artaura.dto.moderator.ChallengeListDTO;

public class ChallengeRowMapper implements RowMapper<ChallengeListDTO> {
    @Override
    public ChallengeListDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
        ChallengeListDTO challenge = new ChallengeListDTO();
        challenge.setId(rs.getInt("id"));
        challenge.setTitle(rs.getString("title"));
        challenge.setCategory(rs.getString("category"));
        challenge.setPublishDateTime(rs.getTimestamp("publish_date_time") != null ? rs.getTimestamp("publish_date_time").toString() : null);
        challenge.setDeadlineDateTime(rs.getTimestamp("deadline_date_time") != null ? rs.getTimestamp("deadline_date_time").toString() : null);
        challenge.setDescription(rs.getString("description"));
        challenge.setMaxParticipants(rs.getInt("max_participants"));
        challenge.setRewards(rs.getString("rewards"));
        // Note: sponsorship_request column doesn't exist in database - defaulting to false
        challenge.setRequestSponsorship(false);
        challenge.setSponsorship(rs.getString("sponsorship")); // Get sponsorship status from database
        challenge.setStatus(rs.getString("status"));
        challenge.setModeratorId(rs.getInt("moderator_id"));
        
        // Get participant count if available in result set
        try {
            challenge.setParticipantCount(rs.getInt("participant_count"));
        } catch (SQLException e) {
            challenge.setParticipantCount(0);
        }
        
        // Get discount code if available in result set
        try {
            challenge.setDiscountCode(rs.getString("discount_code"));
        } catch (SQLException e) {
            challenge.setDiscountCode(null);
        }
        
        // Fixed marks scoring - weight columns still in DB but will be removed
        // Each Like = +10 marks, Each Dislike = -5 marks, Minimum score = 0
        // Note: likes_weight, comments_weight, share_weight columns exist but are not used
        
        return challenge;
    }
}
