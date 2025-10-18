package com.artaura.artaura.dao.moderator;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.artaura.artaura.dto.moderator.ChallengeListDTO;
import com.artaura.artaura.dto.moderator.ScoringCriteriaDTO;

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
        challenge.setRequestSponsorship(rs.getInt("request_sponsorship") == 1);
        challenge.setStatus(rs.getString("status"));
        challenge.setModeratorId(rs.getInt("moderator_id"));
        
        // Map scoring criteria
        ScoringCriteriaDTO scoringCriteria = new ScoringCriteriaDTO();
        scoringCriteria.setLikesWeight(rs.getInt("likes_weight"));
        scoringCriteria.setCommentsWeight(rs.getInt("comments_weight"));
        scoringCriteria.setShareWeight(rs.getInt("share_weight"));
        challenge.setScoringCriteria(scoringCriteria);
        
        return challenge;
    }
}
