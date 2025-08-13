package com.artaura.artaura.dao.Impl.buyer;
import com.artaura.artaura.dao.buyer.BArtistDAO;
import com.artaura.artaura.dto.buyer.ArtistListDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class BArtistDAOImpl implements BArtistDAO {
    @Autowired
    private JdbcTemplate jdbc;
    @Override
    public List<ArtistListDTO> getAllArtistsForList() {
        String sql = "SELECT artist_id AS id, CONCAT(first_name, ' ', last_name) AS name, specialization, bio, rate, total_followers, total_sales, avatar_url, location FROM artists";
        return jdbc.query(sql, (rs, rowNum) -> new ArtistListDTO(
                rs.getLong("id"),
                rs.getString("name"),
                rs.getString("specialization"),
                rs.getString("bio"),
                rs.getDouble("rate"),
                rs.getInt("total_followers"),
                rs.getInt("total_sales"),
                rs.getString("avatar_url"),
                rs.getString("location")
        ));
    }
}
