package com.artaura.artaura.dao.Impl.buyer;

import com.artaura.artaura.dao.buyer.ReviewDao;
import com.artaura.artaura.dto.buyer.Review;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.dao.EmptyResultDataAccessException;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;

@Repository
public class ReviewDaoImpl implements ReviewDao {

    private final JdbcTemplate jdbcTemplate;

    public ReviewDaoImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Review> mapper = (rs, rowNum) -> {
        Review r = new Review();
        r.setReviewId(rs.getLong("review_id"));
        r.setArtistId(rs.getLong("artist_id"));
        r.setBuyerId(rs.getLong("buyer_id"));
        r.setRating(rs.getInt("rating"));
        r.setComment(rs.getString("comment"));
        r.setOrderId(rs.getLong("order_id"));
        Timestamp ts = rs.getTimestamp("created_at");
        r.setCreatedAt(ts != null ? ts.toLocalDateTime() : null);
        return r;
    };

    @Override
    public boolean existsByArtistBuyerOrder(Long artistId, Long buyerId, Long orderId) {
        String sql = "SELECT 1 FROM reviews WHERE artist_id = ? AND buyer_id = ? AND order_id = ? LIMIT 1";
        try {
            jdbcTemplate.queryForObject(sql, Integer.class, artistId, buyerId, orderId);
            return true;
        } catch (EmptyResultDataAccessException ex) {
            return false;
        }
    }

    @Override
    public Long insert(Review review) {
        String sql = "INSERT INTO reviews (artist_id, buyer_id, rating, comment, order_id, created_at) VALUES (?,?,?,?,?,?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        LocalDateTime createdAt = review.getCreatedAt() != null ? review.getCreatedAt() : LocalDateTime.now();

        jdbcTemplate.update(con -> {
            PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, review.getArtistId());
            ps.setLong(2, review.getBuyerId());
            ps.setInt(3, review.getRating());
            ps.setString(4, review.getComment());
            ps.setLong(5, review.getOrderId());
            ps.setTimestamp(6, Timestamp.valueOf(createdAt));
            return ps;
        }, keyHolder);

        Number key = keyHolder.getKey();
        Long reviewId = key != null ? key.longValue() : null;

        // Recalculate and update artist's average rate
        Double avg = jdbcTemplate.queryForObject(
            "SELECT AVG(rating) FROM reviews WHERE artist_id = ?",
            Double.class,
            review.getArtistId()
        );
        jdbcTemplate.update(
            "UPDATE artists SET rate = ? WHERE artist_id = ?",
            avg, review.getArtistId()
        );

        return reviewId;
    }

    @Override
    public Review findById(Long reviewId) {
        String sql = "SELECT review_id, artist_id, buyer_id, rating, comment, order_id, created_at FROM reviews WHERE review_id = ?";
        return jdbcTemplate.queryForObject(sql, mapper, reviewId);
    }
}
