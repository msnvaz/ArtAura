package com.artaura.artaura.dao.Impl.buyer;
import com.artaura.artaura.dao.buyer.BArtistDAO;
import com.artaura.artaura.dto.buyer.ArtistListDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class BArtistDAOImpl implements BArtistDAO {
    @Autowired
    private JdbcTemplate jdbc;
    
    @Override
    public List<ArtistListDTO> getAllArtistsForList() {
        String sql = "SELECT artist_id AS id, CONCAT(first_name, ' ', last_name) AS name, specialization, bio, rate, total_followers, total_sales, avatar_url, location, badge, contactNo, email, cover_image_url, status FROM artists";
        return jdbc.query(sql, (rs, rowNum) -> new ArtistListDTO(
                rs.getLong("id"),
                rs.getString("name"),
                rs.getString("specialization"),
                rs.getString("bio"),
                rs.getDouble("rate"),
                rs.getInt("total_followers"),
                rs.getInt("total_sales"),
                rs.getString("avatar_url"),
                rs.getString("location"),
                rs.getString("badge"),
                rs.getString("contactNo"),
                rs.getString("email"),
                rs.getString("cover_image_url"),
                rs.getString("status")
        ));
    }

    @Override
    @Transactional
    public void followArtist(Long buyerId, Long artistId) {
        // Insert follow relationship
        String insertFollowSql = "INSERT INTO artist_followers (buyer_id, artist_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE followed_at = CURRENT_TIMESTAMP";
        jdbc.update(insertFollowSql, buyerId, artistId);
        
        // Increment follower count
        String incrementSql = "UPDATE artists SET total_followers = total_followers + 1 WHERE artist_id = ?";
        jdbc.update(incrementSql, artistId);
    }

    @Override
    @Transactional
    public void unfollowArtist(Long buyerId, Long artistId) {
        // Remove follow relationship
        String deleteFollowSql = "DELETE FROM artist_followers WHERE buyer_id = ? AND artist_id = ?";
        int rowsAffected = jdbc.update(deleteFollowSql, buyerId, artistId);
        
        // Decrement follower count only if a row was actually deleted
        if (rowsAffected > 0) {
            String decrementSql = "UPDATE artists SET total_followers = GREATEST(0, total_followers - 1) WHERE artist_id = ?";
            jdbc.update(decrementSql, artistId);
        }
    }

    @Override
    public boolean isFollowing(Long buyerId, Long artistId) {
        String sql = "SELECT COUNT(*) FROM artist_followers WHERE buyer_id = ? AND artist_id = ?";
        Integer count = jdbc.queryForObject(sql, Integer.class, buyerId, artistId);
        return count != null && count > 0;
    }

    @Override
    @Deprecated
    public void incrementFollowers(Long artistId) {
        String sql = "UPDATE artists SET total_followers = total_followers + 1 WHERE artist_id = ?";
        jdbc.update(sql, artistId);
    }
}
