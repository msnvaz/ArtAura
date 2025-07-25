package com.artaura.artaura.dao.moderator;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.artaura.artaura.dto.moderator.ChallengeDTO;
import com.artaura.artaura.dto.moderator.ChallengeListDTO;

@Repository
public class ChallengeDAOImpl implements ChallengeDAO {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void insertChallenge(ChallengeDTO challenge, String moderatorId) {
        // Determine request_sponsorship and status
        boolean requestSponsorship = challenge.getSponsorshipRequest() != null;
        int requestSponsorshipValue = requestSponsorship ? 1 : 0;
        String status = requestSponsorship ? "draft" : "active";

        String sql = "INSERT INTO challenges (title, category, publish_date_time, deadline_date_time, description, max_participants, rewards, sponsorship_type, sponsorship_message, request_sponsorship, status, moderator_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String sponsorshipType = null;
        String sponsorshipMessage = null;
        if (requestSponsorship) {
            sponsorshipType = challenge.getSponsorshipRequest().getType();
            sponsorshipMessage = challenge.getSponsorshipRequest().getMessage();
        }
        jdbcTemplate.update(sql,
            challenge.getTitle(),
            challenge.getCategory(),
            challenge.getPublishDateTime(),
            challenge.getDeadlineDateTime(),
            challenge.getDescription(),
            challenge.getMaxParticipants(),
            challenge.getRewards(),
            sponsorshipType,
            sponsorshipMessage,
            requestSponsorshipValue,
            status,
            moderatorId
        );
    }
    @Override
    public List<ChallengeListDTO> getAllChallenges() {
        String sql = "SELECT * FROM challenges ORDER BY publish_date_time DESC";
        return jdbcTemplate.query(sql, new ChallengeRowMapper());
    }
}
