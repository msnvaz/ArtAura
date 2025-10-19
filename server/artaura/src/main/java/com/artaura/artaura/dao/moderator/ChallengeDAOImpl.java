
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
        try {
            // Determine status based on sponsorship request:
            // - Request Sponsorship = true → status = "draft" (waiting for shop to sponsor)
            // - Request Sponsorship = false → status = "active" (published immediately to artist feed)
            boolean requestSponsorship = challenge.isRequestSponsorship();
            String status = requestSponsorship ? "draft" : "active";

            // Format datetime strings - replace 'T' with space for MySQL
            String publishDateTime = challenge.getPublishDateTime();
            String deadlineDateTime = challenge.getDeadlineDateTime();
            
            if (publishDateTime != null && publishDateTime.contains("T")) {
                publishDateTime = publishDateTime.replace("T", " ");
            }
            if (deadlineDateTime != null && deadlineDateTime.contains("T")) {
                deadlineDateTime = deadlineDateTime.replace("T", " ");
            }
            
            System.out.println("Inserting challenge with datetime values:");
            System.out.println("Publish: " + publishDateTime);
            System.out.println("Deadline: " + deadlineDateTime);
            System.out.println("Request Sponsorship: " + requestSponsorship);
            System.out.println("Status: " + status + (requestSponsorship ? " (draft - waiting for shop sponsorship)" : " (active - published immediately)"));

            // Fixed marks scoring - weight columns don't exist in database
            // Each Like = +10 marks, Each Dislike = -5 marks, Minimum score = 0
            String sql = "INSERT INTO challenges (title, category, publish_date_time, deadline_date_time, description, max_participants, rewards, status, moderator_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            jdbcTemplate.update(sql,
                challenge.getTitle(),
                challenge.getCategory(),
                publishDateTime,
                deadlineDateTime,
                challenge.getDescription(),
                challenge.getMaxParticipants(),
                challenge.getRewards(),
                status,
                moderatorId
            );
            
            System.out.println("Challenge created successfully with status: " + status);
        } catch (Exception e) {
            System.err.println("Error inserting challenge: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    @Override
    public List<ChallengeListDTO> getAllChallenges() {
        String sql = "SELECT * FROM challenges ORDER BY publish_date_time DESC";
        return jdbcTemplate.query(sql, new ChallengeRowMapper());
    }

    @Override
    public void updateChallenge(ChallengeDTO challenge, String moderatorId) {
        // Fixed marks scoring - weight columns don't exist in database
        String sql = "UPDATE challenges SET title=?, category=?, deadline_date_time=?, description=?, max_participants=?, rewards=? WHERE id=? AND moderator_id=?";
        
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
            challenge.getId(),
            moderatorId
        );
    }

    @Override
    public int updateExpiredChallenges() {
        String sql = "UPDATE challenges SET status = 'completed' " +
                     "WHERE status != 'completed' " +
                     "AND deadline_date_time < NOW()";
        return jdbcTemplate.update(sql);
    }

    @Override
    public void publishChallenge(int challengeId) {
        // Change status from 'draft' to 'active' to make it visible in artist feed
        String sql = "UPDATE challenges SET status = 'active' WHERE id = ? AND status = 'draft'";
        int rowsAffected = jdbcTemplate.update(sql, challengeId);
        
        if (rowsAffected == 0) {
            throw new IllegalStateException("Challenge not found or already published (challenge_id: " + challengeId + ")");
        }
        
        System.out.println("Challenge " + challengeId + " published successfully! Status changed from 'draft' to 'active'");
    }
}
