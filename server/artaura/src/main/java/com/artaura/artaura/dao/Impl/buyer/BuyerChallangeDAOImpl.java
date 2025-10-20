package com.artaura.artaura.dao.Impl.buyer;

import com.artaura.artaura.dao.buyer.BuyerChallengeDAO;
import com.artaura.artaura.dto.buyer.ChallengeSubmissionDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class BuyerChallangeDAOImpl implements BuyerChallengeDAO {
    @Autowired
    private JdbcTemplate jdbcTemplate;

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
        sql.append("SELECT cp.*, ");
        sql.append("CONCAT(COALESCE(a.first_name, ''), ' ', COALESCE(a.last_name, '')) as artist_name, ");
        sql.append("a.avatar_url as artist_avatar, ");
        sql.append("COALESCE(a.total_followers, 0) as artist_followers, ");
        sql.append("COALESCE(csv.vote_count, 0) as votes_count, ");
        sql.append("CASE WHEN csv.user_voted IS NOT NULL THEN TRUE ELSE FALSE END as user_has_voted, ");
        // Add like/dislike counts and marks calculation
        sql.append("COALESCE(reactions.likes_count, 0) as likes_count, ");
        sql.append("COALESCE(reactions.dislikes_count, 0) as dislikes_count, ");
        sql.append("reactions.user_reaction, ");
        // Formula: MAX(0, (Likes × 10) - (Dislikes × 5))
        sql.append("GREATEST(0, (COALESCE(reactions.likes_count, 0) * 10) - (COALESCE(reactions.dislikes_count, 0) * 5)) as marks ");
        sql.append("FROM challenge_participants cp ");
        sql.append("JOIN artists a ON cp.artist_id = a.artist_id ");
        sql.append("LEFT JOIN (");
        sql.append("    SELECT submission_id, ");
        sql.append("           COUNT(*) as vote_count, ");
        sql.append("           MAX(CASE WHEN buyer_id = ? THEN 1 END) as user_voted ");
        sql.append("    FROM challenge_submission_votes ");
        sql.append("    GROUP BY submission_id");
        sql.append(") csv ON cp.id = csv.submission_id ");
        // Join reactions table for likes/dislikes
        sql.append("LEFT JOIN (");
        sql.append("    SELECT submission_id, ");
        sql.append("           SUM(CASE WHEN reaction_type = 'like' THEN 1 ELSE 0 END) as likes_count, ");
        sql.append("           SUM(CASE WHEN reaction_type = 'dislike' THEN 1 ELSE 0 END) as dislikes_count, ");
        sql.append("           MAX(CASE WHEN buyer_id = ? THEN reaction_type END) as user_reaction ");
        sql.append("    FROM challenge_submission_reactions ");
        sql.append("    GROUP BY submission_id");
        sql.append(") reactions ON cp.id = reactions.submission_id ");
        sql.append("WHERE cp.challenge_id = ? ");

        // Add sorting
        switch (sortBy.toLowerCase()) {
            case "oldest":
                sql.append("ORDER BY cp.submission_date ASC");
                break;
            case "mostvoted":
                sql.append("ORDER BY votes_count DESC, cp.submission_date DESC");
                break;
            case "topscores":
            case "winners":
                // Sort by marks (highest first), then by submission date
                sql.append("ORDER BY marks DESC, cp.submission_date ASC");
                break;
            case "newest":
            default:
                sql.append("ORDER BY cp.submission_date DESC");
                break;
        }

        if (userId != null) {
            return jdbcTemplate.query(sql.toString(), submissionRowMapper, userId, userId, challengeId);
        } else {
            return jdbcTemplate.query(sql.toString(), submissionRowMapper, 0, 0, challengeId);
        }
    }

    private final RowMapper<ChallengeSubmissionDTO> submissionRowMapper = (rs, rowNum) -> {
        ChallengeSubmissionDTO dto = new ChallengeSubmissionDTO();
        
        // Map challenge_participants table columns - handle nulls properly
        dto.setId(rs.getObject("id") != null ? rs.getLong("id") : null);
        dto.setChallengeId(rs.getObject("challenge_id") != null ? rs.getInt("challenge_id") : null);
        dto.setArtistId(rs.getObject("artist_id") != null ? rs.getLong("artist_id") : null);
        dto.setArtworkTitle(rs.getString("artwork_title"));
        dto.setArtworkDescription(rs.getString("artwork_description"));
        dto.setArtworkImagePath(rs.getString("artwork_image_path"));
        dto.setSubmissionDate(rs.getTimestamp("submission_date") != null ?
                rs.getTimestamp("submission_date").toLocalDateTime() : null);
        dto.setStatus(rs.getString("status"));
        dto.setRating(rs.getObject("rating") != null ? rs.getDouble("rating") : null);
        dto.setJudgeComments(rs.getString("judge_comments"));
        dto.setCreatedAt(rs.getTimestamp("created_at") != null ?
                rs.getTimestamp("created_at").toLocalDateTime() : null);
        dto.setUpdatedAt(rs.getTimestamp("updated_at") != null ?
                rs.getTimestamp("updated_at").toLocalDateTime() : null);

        // Artist information - handle nulls
        dto.setArtistName(rs.getString("artist_name"));
        dto.setArtistAvatar(rs.getString("artist_avatar"));
        dto.setArtistFollowers(rs.getObject("artist_followers") != null ? rs.getInt("artist_followers") : 0);

        // Voting information - handle nulls
        dto.setVotesCount(rs.getObject("votes_count") != null ? rs.getInt("votes_count") : 0);
        dto.setUserHasVoted(rs.getObject("user_has_voted") != null ? rs.getBoolean("user_has_voted") : false);

        // Like/Dislike reaction information
        try {
            dto.setLikesCount(rs.getObject("likes_count") != null ? rs.getInt("likes_count") : 0);
            dto.setDislikesCount(rs.getObject("dislikes_count") != null ? rs.getInt("dislikes_count") : 0);
            dto.setUserReaction(rs.getString("user_reaction")); // "like", "dislike", or null
            // Marks: MAX(0, (Likes × 10) - (Dislikes × 5))
            dto.setMarks(rs.getObject("marks") != null ? rs.getInt("marks") : 0);
        } catch (Exception e) {
            // If columns don't exist in query, set defaults
            dto.setLikesCount(0);
            dto.setDislikesCount(0);
            dto.setUserReaction(null);
            dto.setMarks(0);
        }

        return dto;
    };

    /*
    @Override
    public boolean toggleVote(Long submissionId, Long userId) {
        // This method has been replaced by handleLikeDislike
        throw new UnsupportedOperationException("Voting has been replaced with like/dislike functionality");
    }

    @Override
    public boolean hasUserVoted(Long submissionId, Long userId) {
        // This method has been replaced by getSubmissionLikes
        throw new UnsupportedOperationException("Vote status has been replaced with like/dislike functionality");
    }

    @Override
    public int getSubmissionVoteCount(Long submissionId) {
        // This method has been replaced by getSubmissionLikes
        throw new UnsupportedOperationException("Vote count has been replaced with like/dislike functionality");
    }
    */

    @Override
    public Map<String, Object> handleLikeDislike(Long submissionId, Long userId, String action) {
        try {
            return jdbcTemplate.execute((Connection connection) -> {
                try {
                    connection.setAutoCommit(false);
                    
                    // Check if user has already reacted to this submission
                    String checkSql = "SELECT reaction_type FROM challenge_submission_reactions WHERE submission_id = ? AND buyer_id = ?";
                    PreparedStatement checkStmt = connection.prepareStatement(checkSql);
                    checkStmt.setLong(1, submissionId);
                    checkStmt.setLong(2, userId);
                    ResultSet rs = checkStmt.executeQuery();
                    
                    String existingReaction = null;
                    if (rs.next()) {
                        existingReaction = rs.getString("reaction_type");
                    }
                    
                    String userReaction = null;
                    String message = "";
                    
                    if (existingReaction == null) {
                        // User hasn't reacted - add new reaction
                        String insertSql = "INSERT INTO challenge_submission_reactions (submission_id, buyer_id, reaction_type, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())";
                        PreparedStatement insertStmt = connection.prepareStatement(insertSql);
                        insertStmt.setLong(1, submissionId);
                        insertStmt.setLong(2, userId);
                        insertStmt.setString(3, action);
                        insertStmt.executeUpdate();
                        
                        userReaction = action;
                        message = "Reaction added successfully";
                    } else if (existingReaction.equals(action)) {
                        // User clicked same reaction - remove it
                        String deleteSql = "DELETE FROM challenge_submission_reactions WHERE submission_id = ? AND buyer_id = ?";
                        PreparedStatement deleteStmt = connection.prepareStatement(deleteSql);
                        deleteStmt.setLong(1, submissionId);
                        deleteStmt.setLong(2, userId);
                        deleteStmt.executeUpdate();
                        
                        userReaction = null;
                        message = "Reaction removed successfully";
                    } else {
                        // User clicked different reaction - update it
                        String updateSql = "UPDATE challenge_submission_reactions SET reaction_type = ?, updated_at = NOW() WHERE submission_id = ? AND buyer_id = ?";
                        PreparedStatement updateStmt = connection.prepareStatement(updateSql);
                        updateStmt.setString(1, action);
                        updateStmt.setLong(2, submissionId);
                        updateStmt.setLong(3, userId);
                        updateStmt.executeUpdate();
                        
                        userReaction = action;
                        message = "Reaction updated successfully";
                    }
                    
                    // Get updated counts
                    String countSql = "SELECT " +
                            "SUM(CASE WHEN reaction_type = 'like' THEN 1 ELSE 0 END) as likes, " +
                            "SUM(CASE WHEN reaction_type = 'dislike' THEN 1 ELSE 0 END) as dislikes " +
                            "FROM challenge_submission_reactions WHERE submission_id = ?";
                    PreparedStatement countStmt = connection.prepareStatement(countSql);
                    countStmt.setLong(1, submissionId);
                    ResultSet countRs = countStmt.executeQuery();
                    
                    int likes = 0;
                    int dislikes = 0;
                    if (countRs.next()) {
                        likes = countRs.getInt("likes");
                        dislikes = countRs.getInt("dislikes");
                    }
                    
                    connection.commit();
                    
                    Map<String, Object> result = new java.util.HashMap<>();
                    result.put("success", true);
                    result.put("message", message);
                    result.put("likes", likes);
                    result.put("dislikes", dislikes);
                    result.put("userReaction", userReaction);
                    
                    System.out.println("Like/Dislike operation completed - " + message + " for submission " + submissionId + " by user " + userId);
                    return result;
                    
                } catch (SQLException e) {
                    try {
                        connection.rollback();
                    } catch (SQLException rollbackEx) {
                        System.err.println("Rollback failed: " + rollbackEx.getMessage());
                    }
                    throw new RuntimeException("Database transaction failed", e);
                }
            });
            
        } catch (Exception e) {
            System.err.println("Error in handleLikeDislike: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> errorResult = new java.util.HashMap<>();
            errorResult.put("success", false);
            errorResult.put("message", "Error processing reaction: " + e.getMessage());
            errorResult.put("likes", 0);
            errorResult.put("dislikes", 0);
            errorResult.put("userReaction", null);
            return errorResult;
        }
    }

    @Override
    public Map<String, Object> getSubmissionLikes(Long submissionId, Long userId) {
        try {
            // Get like/dislike counts
            String countSql = "SELECT " +
                    "SUM(CASE WHEN reaction_type = 'like' THEN 1 ELSE 0 END) as likes, " +
                    "SUM(CASE WHEN reaction_type = 'dislike' THEN 1 ELSE 0 END) as dislikes " +
                    "FROM challenge_submission_reactions WHERE submission_id = ?";
            
            Map<String, Object> counts = jdbcTemplate.queryForMap(countSql, submissionId);
            int likes = counts.get("likes") != null ? ((Number) counts.get("likes")).intValue() : 0;
            int dislikes = counts.get("dislikes") != null ? ((Number) counts.get("dislikes")).intValue() : 0;
            
            // Get user's reaction
            String userReactionSql = "SELECT reaction_type FROM challenge_submission_reactions WHERE submission_id = ? AND buyer_id = ?";
            List<String> userReactions = jdbcTemplate.queryForList(userReactionSql, String.class, submissionId, userId);
            String userReaction = userReactions.isEmpty() ? null : userReactions.get(0);
            
            Map<String, Object> result = new java.util.HashMap<>();
            result.put("likes", likes);
            result.put("dislikes", dislikes);
            result.put("userReaction", userReaction);
            
            return result;
            
        } catch (Exception e) {
            System.err.println("Error getting submission likes: " + e.getMessage());
            
            Map<String, Object> errorResult = new java.util.HashMap<>();
            errorResult.put("likes", 0);
            errorResult.put("dislikes", 0);
            errorResult.put("userReaction", null);
            return errorResult;
        }
    }

    @Override
    public int getParticipantCount(Long challengeId) {
        try {
            String sql = "SELECT COUNT(DISTINCT artist_id) FROM challenge_participants WHERE challenge_id = ?";
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, challengeId);
            return count != null ? count : 0;
        } catch (Exception e) {
            System.err.println("Error getting participant count: " + e.getMessage());
            return 0;
        }
    }

    @Override
    public int getSubmissionCount(Long challengeId) {
        try {
            String sql = "SELECT COUNT(*) FROM challenge_participants WHERE challenge_id = ?";
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, challengeId);
            return count != null ? count : 0;
        } catch (Exception e) {
            System.err.println("Error getting submission count: " + e.getMessage());
            return 0;
        }
    }
}
