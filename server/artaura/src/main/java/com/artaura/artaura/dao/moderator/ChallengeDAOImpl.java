
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
        
        // Clean and validate the deadline datetime
        String formattedDeadline = challenge.getDeadlineDateTime();
        if (formattedDeadline != null && !formattedDeadline.trim().isEmpty()) {
            // Remove any extra whitespace
            formattedDeadline = formattedDeadline.trim();
            
            // Log the received datetime for debugging
            System.out.println("Received datetime: '" + formattedDeadline + "'");
            
            // Check if we have a valid datetime string before processing
            if (formattedDeadline.length() < 10) {
                System.err.println("Datetime string too short: '" + formattedDeadline + "'");
                throw new IllegalArgumentException("Invalid datetime format: datetime string is too short");
            }
            
            // If it contains 'T', convert to MySQL format
            if (formattedDeadline.contains("T")) {
                formattedDeadline = formattedDeadline.replace("T", " ");
            }
            
            // Only remove non-essential characters, but preserve the structure
            formattedDeadline = formattedDeadline.replaceAll("[^\\d\\-\\s:]", "");
            
            // Check if we still have a valid string after cleaning
            if (formattedDeadline.length() < 19) {
                System.err.println("Datetime string too short after cleaning: '" + formattedDeadline + "'");
                throw new IllegalArgumentException("Invalid datetime format: datetime becomes invalid after cleaning");
            }
            
            // Ensure proper format: YYYY-MM-DD HH:MM:SS
            if (formattedDeadline.matches("\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2}")) {
                System.out.println("Valid datetime format: '" + formattedDeadline + "'");
            } else {
                System.err.println("Invalid datetime format: '" + formattedDeadline + "'");
                throw new IllegalArgumentException("Invalid datetime format: " + formattedDeadline + " (expected: YYYY-MM-DD HH:MM:SS)");
            }
        } else {
            System.err.println("Null or empty datetime received");
            throw new IllegalArgumentException("Deadline datetime cannot be null or empty");
        }
        
        jdbcTemplate.update(sql,
            challenge.getTitle(),
            challenge.getCategory(),
            formattedDeadline,
            challenge.getDescription(),
            challenge.getMaxParticipants(),
            challenge.getRewards(),
            challenge.isRequestSponsorship() ? 1 : 0,
            challenge.getId(),
            moderatorId
        );
    }
}
