package com.artaura.artaura.dao.Impl.artist;

import com.artaura.artaura.dao.artist.ChallengeParticipationDAO;
import com.artaura.artaura.dto.artist.ChallengeParticipationDTO;
import com.artaura.artaura.dto.moderator.ChallengeDTO;
import com.artaura.artaura.entity.ChallengeParticipant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public class ChallengeParticipationDAOImpl implements ChallengeParticipationDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // RowMapper for Challenge
    private final RowMapper<ChallengeDTO> challengeRowMapper = (rs, rowNum) -> {
        ChallengeDTO challenge = new ChallengeDTO();
        challenge.setId(rs.getInt("id"));
        challenge.setTitle(rs.getString("title"));
        challenge.setCategory(rs.getString("category"));
        challenge.setPublishDateTime(rs.getString("publish_date_time"));
        challenge.setDeadlineDateTime(rs.getString("deadline_date_time"));
        challenge.setDescription(rs.getString("description"));
        challenge.setMaxParticipants(rs.getInt("max_participants"));
        challenge.setRewards(rs.getString("rewards"));
        challenge.setRequestSponsorship(rs.getBoolean("request_sponsorship"));
        return challenge;
    };

    // RowMapper for Challenge Participation
    private final RowMapper<ChallengeParticipationDTO> participationRowMapper = (rs, rowNum) -> {
        ChallengeParticipationDTO participation = new ChallengeParticipationDTO();
        participation.setId(rs.getLong("id"));
        participation.setChallengeId(rs.getLong("challenge_id"));
        participation.setChallengeTitle(rs.getString("challenge_title"));
        participation.setChallengeDescription(rs.getString("challenge_description"));
        participation.setArtworkTitle(rs.getString("artwork_title"));
        participation.setArtworkDescription(rs.getString("artwork_description"));
        participation.setArtworkImagePath(rs.getString("artwork_image_path"));
        participation.setSubmissionDate(rs.getString("submission_date"));
        participation.setStatus(rs.getString("status"));
        participation.setRating(rs.getDouble("rating"));
        participation.setDeadlineDateTime(rs.getString("deadline_date_time"));
        participation.setMaxParticipants(rs.getInt("max_participants"));
        participation.setRewards(rs.getString("rewards"));
        return participation;
    };

    @Override
    public List<ChallengeDTO> getActiveChallenges() {
        String sql = """
            SELECT id, title, category, publish_date_time, deadline_date_time, 
                   description, max_participants, rewards, request_sponsorship
            FROM challenges 
            WHERE status = 'active' AND deadline_date_time > NOW()
            ORDER BY deadline_date_time ASC
        """;

        return jdbcTemplate.query(sql, challengeRowMapper);
    }

    @Override
    public List<ChallengeParticipationDTO> getArtistParticipations(Long artistId) {
        String sql = """
            SELECT cp.id, cp.challenge_id, c.title as challenge_title, 
                   c.description as challenge_description, 
                   cp.artwork_title, cp.artwork_description, cp.artwork_image_path,
                   cp.submission_date, cp.status, cp.rating,
                   c.deadline_date_time, c.max_participants, c.rewards
            FROM challenge_participants cp
            JOIN challenges c ON cp.challenge_id = c.id
            WHERE cp.artist_id = ?
            ORDER BY cp.submission_date DESC
        """;

        return jdbcTemplate.query(sql, participationRowMapper, artistId);
    }

    @Override
    public Long submitParticipation(ChallengeParticipant participation) {
        String sql = """
            INSERT INTO challenge_participants 
            (challenge_id, artist_id, artwork_title, artwork_description, artwork_image_path, status)
            VALUES (?, ?, ?, ?, ?, 'submitted')
        """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, participation.getChallengeId());
            ps.setLong(2, participation.getArtistId());
            ps.setString(3, participation.getArtworkTitle());
            ps.setString(4, participation.getArtworkDescription());
            ps.setString(5, participation.getArtworkImagePath());
            return ps;
        }, keyHolder);

        return keyHolder.getKey().longValue();
    }

    @Override
    public boolean hasArtistParticipated(Long challengeId, Long artistId) {
        String sql = """
            SELECT COUNT(*) FROM challenge_participants 
            WHERE challenge_id = ? AND artist_id = ?
        """;

        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, challengeId, artistId);
        return count != null && count > 0;
    }

    @Override
    public ChallengeDTO getChallengeById(Long challengeId) {
        String sql = """
            SELECT id, title, category, publish_date_time, deadline_date_time, 
                   description, max_participants, rewards, request_sponsorship
            FROM challenges 
            WHERE id = ? AND status = 'active'
        """;

        try {
            return jdbcTemplate.queryForObject(sql, challengeRowMapper, challengeId);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Override
    public boolean updateParticipationStatus(Long participationId, String status) {
        String sql = "UPDATE challenge_participants SET status = ?, updated_at = NOW() WHERE id = ?";

        int rowsUpdated = jdbcTemplate.update(sql, status, participationId);
        return rowsUpdated > 0;
    }
}
