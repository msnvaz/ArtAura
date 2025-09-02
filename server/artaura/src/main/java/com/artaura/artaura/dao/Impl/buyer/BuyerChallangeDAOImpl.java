package com.artaura.artaura.dao.Impl.buyer;

import com.artaura.artaura.dao.buyer.BuyerChallengeDAO;
import com.artaura.artaura.dto.buyer.ChallengeSubmissionDTO;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class BuyerChallangeDAOImpl implements BuyerChallengeDAO {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public List<Map<String, Object>> findActiveChallenges() {
        String sql = "SELECT * FROM challenges WHERE status = ? ORDER BY publish_date_time DESC";
        return jdbcTemplate.queryForList(sql, "active");
    }

    @Override
    public Optional<Map<String, Object>> findById(Long id) {
        String sql = "SELECT * FROM challenges WHERE id = ?";
        List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, id);
        return result.stream().findFirst();
    }

    @Override
    public List<Map<String, Object>> findAll() {
        String sql = "SELECT * FROM challenges ORDER BY publish_date_time DESC";
        return jdbcTemplate.queryForList(sql);
    }

    @Override
    public List<Map<String, Object>> findByCategory(String category) {
        String sql = "SELECT * FROM challenges WHERE category = ? ORDER BY publish_date_time DESC";
        return jdbcTemplate.queryForList(sql, category);
    }

    @Override
    public List<Map<String, Object>> findByStatus(String status) {
        String sql = "SELECT * FROM challenges WHERE status = ? ORDER BY publish_date_time DESC";
        return jdbcTemplate.queryForList(sql, status);
    }

    @Override
    public List<ChallengeSubmissionDTO> getSubmissionsByChallenge(Integer challengeId, Long userId, String userType) {
        return getSubmissionsByChallengeWithSort(challengeId, userId, userType, "newest");
    }

    @Override
    public List<ChallengeSubmissionDTO> getSubmissionsByChallengeWithSort(Integer challengeId, Long userId, String userType, String sortBy) {
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT cs.*, ");
        sql.append("CONCAT(a.first_name, ' ', a.last_name) as artist_name, ");
        sql.append("a.avatar_url as artist_avatar, ");
        sql.append("a.total_followers as artist_followers, ");
        sql.append("CASE WHEN csv.vote_id IS NOT NULL THEN TRUE ELSE FALSE END as user_has_voted ");
        sql.append("FROM challenge_submissions cs ");
        sql.append("JOIN artists a ON cs.artist_id = a.artist_id ");
        sql.append("LEFT JOIN challenge_submission_votes csv ON cs.submission_id = csv.submission_id ");

        if (userId != null) {
            sql.append("AND csv.buyer_id = ? ");
        }

        sql.append("WHERE cs.challenge_id = ? ");

        // Add sorting
        switch (sortBy.toLowerCase()) {
            case "oldest":
                sql.append("ORDER BY cs.submitted_at ASC");
                break;
            case "mostvoted":
                sql.append("ORDER BY cs.votes_count DESC, cs.submitted_at DESC");
                break;
            case "newest":
            default:
                sql.append("ORDER BY cs.submitted_at DESC");
                break;
        }

        if (userId != null) {
            return jdbcTemplate.query(sql.toString(), submissionRowMapper, userId, challengeId);
        } else {
            return jdbcTemplate.query(sql.toString(), submissionRowMapper, challengeId);
        }
    }

    private final RowMapper<ChallengeSubmissionDTO> submissionRowMapper = new RowMapper<ChallengeSubmissionDTO>() {
        @Override
        public ChallengeSubmissionDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            ChallengeSubmissionDTO dto = new ChallengeSubmissionDTO();
            dto.setSubmissionId(rs.getLong("submission_id"));
            dto.setChallengeId(rs.getInt("challenge_id"));
            dto.setArtistId(rs.getLong("artist_id"));
            dto.setTitle(rs.getString("title"));
            dto.setDescription(rs.getString("description"));
            dto.setImageUrl(rs.getString("image_url"));

            // Parse tags JSON
            String tagsJson = rs.getString("tags");
            try {
                if (tagsJson != null && !tagsJson.trim().isEmpty()) {
                    List<String> tags = objectMapper.readValue(tagsJson, new TypeReference<List<String>>() {});
                    dto.setTags(tags);
                } else {
                    dto.setTags(new ArrayList<>());
                }
            } catch (Exception e) {
                dto.setTags(new ArrayList<>());
            }

            dto.setSoftwareUsed(rs.getString("software_used"));
            dto.setTimeSpent(rs.getString("time_spent"));
            dto.setVotesCount(rs.getInt("votes_count"));
            
            // Set default values for fields not in your schema
            dto.setViewsCount(0);
            dto.setStatus("submitted");
            
            dto.setSubmittedAt(rs.getTimestamp("submitted_at") != null ?
                    rs.getTimestamp("submitted_at").toLocalDateTime() : null);
            dto.setUpdatedAt(rs.getTimestamp("updated_at") != null ?
                    rs.getTimestamp("updated_at").toLocalDateTime() : null);

            // Artist information
            dto.setArtistName(rs.getString("artist_name"));
            dto.setArtistAvatar(rs.getString("artist_avatar"));
            dto.setArtistFollowers(rs.getInt("artist_followers"));

            // User vote status
            dto.setUserHasVoted(rs.getBoolean("user_has_voted"));

            return dto;
        }
    };

    @Override
    public boolean toggleVote(Long submissionId, Long userId) {
        try {
            // Use database transaction to prevent race conditions
            return jdbcTemplate.execute((Connection connection) -> {
                try {
                    // Start transaction
                    connection.setAutoCommit(false);
                    
                    // First, check if user has already voted (with row lock)
                    String checkSql = "SELECT COUNT(*) FROM challenge_submission_votes WHERE submission_id = ? AND buyer_id = ? FOR UPDATE";
                    PreparedStatement checkStmt = connection.prepareStatement(checkSql);
                    checkStmt.setLong(1, submissionId);
                    checkStmt.setLong(2, userId);
                    ResultSet rs = checkStmt.executeQuery();
                    rs.next();
                    boolean hasVoted = rs.getInt(1) > 0;
                    
                    if (hasVoted) {
                        // User has voted - remove the vote
                        String deleteSql = "DELETE FROM challenge_submission_votes WHERE submission_id = ? AND buyer_id = ?";
                        PreparedStatement deleteStmt = connection.prepareStatement(deleteSql);
                        deleteStmt.setLong(1, submissionId);
                        deleteStmt.setLong(2, userId);
                        int deletedRows = deleteStmt.executeUpdate();
                        
                        if (deletedRows > 0) {
                            // Only decrement if we actually deleted a vote
                            String updateCountSql = "UPDATE challenge_submissions SET votes_count = GREATEST(votes_count - 1, 0) WHERE submission_id = ?";
                            PreparedStatement updateStmt = connection.prepareStatement(updateCountSql);
                            updateStmt.setLong(1, submissionId);
                            updateStmt.executeUpdate();
                            
                            connection.commit();
                            System.out.println("Vote removed for submission " + submissionId + " by user " + userId);
                            return false; // Vote removed
                        }
                    } else {
                        // User hasn't voted - add the vote
                        String insertSql = "INSERT INTO challenge_submission_votes (submission_id, buyer_id, voted_at) VALUES (?, ?, NOW())";
                        PreparedStatement insertStmt = connection.prepareStatement(insertSql);
                        insertStmt.setLong(1, submissionId);
                        insertStmt.setLong(2, userId);
                        int insertedRows = insertStmt.executeUpdate();
                        
                        if (insertedRows > 0) {
                            // Only increment if we actually inserted a vote
                            String updateCountSql = "UPDATE challenge_submissions SET votes_count = votes_count + 1 WHERE submission_id = ?";
                            PreparedStatement updateStmt = connection.prepareStatement(updateCountSql);
                            updateStmt.setLong(1, submissionId);
                            updateStmt.executeUpdate();
                            
                            connection.commit();
                            System.out.println("Vote added for submission " + submissionId + " by user " + userId);
                            return true; // Vote added
                        }
                    }
                    
                    connection.commit();
                    return hasVoted; // Return current state if no changes were made
                    
                } catch (Exception e) {
                    connection.rollback();
                    throw new RuntimeException("Transaction failed", e);
                }
            });
            
        } catch (Exception e) {
            System.err.println("Error in toggleVote: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to toggle vote", e);
        }
    }

    @Override
    public boolean hasUserVoted(Long submissionId, Long userId) {
        try {
            String sql = "SELECT COUNT(*) FROM challenge_submission_votes WHERE submission_id = ? AND buyer_id = ?";
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, submissionId, userId);
            return count != null && count > 0;
        } catch (Exception e) {
            System.err.println("Error checking vote status: " + e.getMessage());
            return false;
        }
    }

    @Override
    public int getSubmissionVoteCount(Long submissionId) {
        try {
            // Get count from actual votes table to ensure accuracy
            String countSql = "SELECT COUNT(*) FROM challenge_submission_votes WHERE submission_id = ?";
            Integer actualCount = jdbcTemplate.queryForObject(countSql, Integer.class, submissionId);
            
            // Update the stored count to match actual count
            String updateSql = "UPDATE challenge_submissions SET votes_count = ? WHERE submission_id = ?";
            jdbcTemplate.update(updateSql, actualCount, submissionId);
            
            return actualCount != null ? actualCount : 0;
        } catch (Exception e) {
            System.err.println("Error getting vote count: " + e.getMessage());
            return 0;
        }
    }
}
