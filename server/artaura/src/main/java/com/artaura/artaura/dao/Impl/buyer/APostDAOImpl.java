package com.artaura.artaura.dao.Impl.buyer;

import com.artaura.artaura.dao.buyer.APostDAO;
import com.artaura.artaura.dto.buyer.APostResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class APostDAOImpl implements APostDAO {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public List<APostResponseDTO> getAllPostsSortedByTime() {
        String sql = "SELECT p.*, CONCAT(a.first_name, ' ', a.last_name) AS artist_name, a.avatar_url AS artist_avatar " +
                     "FROM post p " +
                     "LEFT JOIN artists a ON p.user_id = a.artist_id " +
                     "ORDER BY p.created_at DESC";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            APostResponseDTO post = new APostResponseDTO();
            post.setPostId(rs.getLong("post_id"));
            post.setUserId(rs.getLong("user_id"));
            post.setImage(rs.getString("image"));
            post.setCaption(rs.getString("caption"));
            post.setLikes(rs.getInt("likes"));
            post.setLocation(rs.getString("location"));
            post.setCreatedAt(rs.getTimestamp("created_at"));
            post.setArtistName(rs.getString("artist_name"));
            post.setArtistAvatar(rs.getString("artist_avatar"));
            return post;
        });
    }

    @Override
    public void incrementLikes(Long postId) {
        String sql = "UPDATE post SET likes = likes + 1 WHERE post_id = ?";
        jdbcTemplate.update(sql, postId);
    }

    @Override
    public APostResponseDTO getPostById(Long postId) {
        String sql = "SELECT * FROM post WHERE post_id = ?";
        return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
            APostResponseDTO post = new APostResponseDTO();
            post.setPostId(rs.getLong("post_id"));
            post.setUserId(rs.getLong("user_id"));
            post.setImage(rs.getString("image"));
            post.setCaption(rs.getString("caption"));
            post.setLikes(rs.getInt("likes"));
            post.setLocation(rs.getString("location"));
            post.setCreatedAt(rs.getTimestamp("created_at"));
            return post;
        }, postId);
    }

    @Override
    public void toggleLike(Long postId, Long userId) {
        // Check if the post exists
        String getLikesSql = "SELECT likes FROM post WHERE post_id = ?";
        Integer currentLikes = jdbcTemplate.query(getLikesSql, new Object[]{postId}, rs -> {
            if (rs.next()) {
                return rs.getInt("likes");
            }
            return null;
        });

        if (currentLikes == null) {
            throw new IllegalArgumentException("Post not found with ID: " + postId);
        }

        // Toggle the likes count
        if (currentLikes > 0) {
            String decrementLikesSql = "UPDATE post SET likes = likes - 1 WHERE post_id = ?";
            jdbcTemplate.update(decrementLikesSql, postId);
        } else {
            String incrementLikesSql = "UPDATE post SET likes = likes + 1 WHERE post_id = ?";
            jdbcTemplate.update(incrementLikesSql, postId);
        }
    }
}
