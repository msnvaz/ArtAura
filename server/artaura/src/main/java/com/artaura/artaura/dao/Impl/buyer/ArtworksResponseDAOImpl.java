package com.artaura.artaura.dao.Impl.buyer;

import com.artaura.artaura.dao.buyer.ArtworkResponse;
import com.artaura.artaura.dto.buyer.ArtworksResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ArtworksResponseDAOImpl implements ArtworkResponse {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public List<ArtworksResponse> findAvailableArtworksWithArtist() {
        String sql = "SELECT a.artwork_id, a.title, a.medium, a.size, a.year, a.price, a.description, a.category, a.tags, a.image_url, a.likes_count, " +
                "ar.artist_id, CONCAT(ar.first_name, ' ', ar.last_name) AS artist_name, ar.avatar_url " +
                "FROM artworks a JOIN artists ar ON a.artist_id = ar.artist_id " +
                "WHERE a.status = 'Available'";

        RowMapper<ArtworksResponse> rowMapper = (rs, rowNum) -> {
            ArtworksResponse resp = new ArtworksResponse();
            resp.setArtworkId(rs.getLong("artwork_id"));
            resp.setTitle(rs.getString("title"));
            resp.setMedium(rs.getString("medium"));
            resp.setSize(rs.getString("size"));
            resp.setYear(rs.getInt("year"));
            resp.setPrice(rs.getDouble("price"));
            resp.setDescription(rs.getString("description"));
            resp.setCategory(rs.getString("category"));
            resp.setTags(rs.getString("tags"));
            resp.setImageUrl(rs.getString("image_url"));
            resp.setLikesCount(rs.getInt("likes_count"));
            resp.setArtistId(rs.getLong("artist_id"));
            resp.setArtistName(rs.getString("artist_name"));
            resp.setArtistAvatarUrl(rs.getString("avatar_url"));
            return resp;
        };
        return jdbcTemplate.query(sql, rowMapper);
    }
}
