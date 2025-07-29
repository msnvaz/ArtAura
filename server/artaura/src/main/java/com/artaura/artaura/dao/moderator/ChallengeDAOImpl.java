
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
    public void deleteChallenge(int challengeId) {
        String sql = "DELETE FROM challenges WHERE id = ?";
        jdbcTemplate.update(sql, challengeId);
    }

    @Override
    public void insertChallenge(ChallengeDTO challenge, String moderatorId) {
        // Determine request_sponsorship and status
        boolean requestSponsorship = challenge.isRequestSponsorship();
        int requestSponsorshipValue = requestSponsorship ? 1 : 0;
        String status = requestSponsorship ? "draft" : "active";

        String sql = "INSERT INTO challenges (title, category, publish_date_time, deadline_date_time, description, max_participants, rewards, request_sponsorship, status, moderator_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
            challenge.getTitle(),
            challenge.getCategory(),
            challenge.getPublishDateTime(),
            challenge.getDeadlineDateTime(),
            challenge.getDescription(),
            challenge.getMaxParticipants(),
            challenge.getRewards(),
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

    @Override
    public void updateChallenge(ChallengeDTO challenge, String moderatorId) {
        String sql = "UPDATE challenges SET title=?, category=?, deadline_date_time=?, description=?, max_participants=?, rewards=?, request_sponsorship=? WHERE id=? AND moderator_id=?";
        jdbcTemplate.update(sql,
            challenge.getTitle(),
            challenge.getCategory(),
            challenge.getDeadlineDateTime(),
            challenge.getDescription(),
            challenge.getMaxParticipants(),
            challenge.getRewards(),
            challenge.isRequestSponsorship() ? 1 : 0,
            challenge.getId(),
            moderatorId
        );
    }
}
