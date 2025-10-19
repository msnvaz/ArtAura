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
        sql.append("CASE WHEN csv.user_voted IS NOT NULL THEN TRUE ELSE FALSE END as user_has_voted ");
        sql.append("FROM challenge_participants cp ");
        sql.append("JOIN artists a ON cp.artist_id = a.artist_id ");
        sql.append("LEFT JOIN (");
        sql.append("    SELECT submission_id, ");
        sql.append("           COUNT(*) as vote_count, ");
        sql.append("           MAX(CASE WHEN buyer_id = ? THEN 1 END) as user_voted ");
        sql.append("    FROM challenge_submission_votes ");
        sql.append("    GROUP BY submission_id");
        sql.append(") csv ON cp.id = csv.submission_id ");
        sql.append("WHERE cp.challenge_id = ? ");

        // Add sorting
        switch (sortBy.toLowerCase()) {
            case "oldest":
                sql.append("ORDER BY cp.submission_date ASC");
                break;
            case "mostvoted":
                sql.append("ORDER BY votes_count DESC, cp.submission_date DESC");
                break;
            case "newest":
            default:
                sql.append("ORDER BY cp.submission_date DESC");
                break;
        }

        if (userId != null) {
            return jdbcTemplate.query(sql.toString(), submissionRowMapper, userId, challengeId);
        } else {
            return jdbcTemplate.query(sql.toString(), submissionRowMapper, 0, challengeId);
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

        return dto;
    };

    @Override
    public boolean toggleVote(Long submissionId, Long userId) {
        try {
            return jdbcTemplate.execute((Connection connection) -> {
                try {
                    connection.setAutoCommit(false);
                    
                    // Check if user has already voted for this submission
                    String checkSql = "SELECT COUNT(*) FROM challenge_submission_votes WHERE submission_id = ? AND buyer_id = ?";
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
                            connection.commit();
                            System.out.println("Vote added for submission " + submissionId + " by user " + userId);
                            return true; // Vote added
                        }
                    }
                    
                    connection.commit();
                    return hasVoted; // Return current state if no changes were made
                    
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
            String countSql = "SELECT COUNT(*) FROM challenge_submission_votes WHERE submission_id = ?";
            Integer actualCount = jdbcTemplate.queryForObject(countSql, Integer.class, submissionId);
            
            return actualCount != null ? actualCount : 0;
        } catch (Exception e) {
            System.err.println("Error getting vote count: " + e.getMessage());
            return 0;
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
