package com.artaura.artaura.dao.Impl;

import com.artaura.artaura.dao.AchievementDAO;
import com.artaura.artaura.dto.achievement.AchievementCreateDTO;
import com.artaura.artaura.dto.achievement.AchievementResponseDTO;
import com.artaura.artaura.dto.achievement.AchievementUpdateDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public class AchievementDAOImpl implements AchievementDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<AchievementResponseDTO> achievementRowMapper = new RowMapper<AchievementResponseDTO>() {
        @Override
        public AchievementResponseDTO mapRow(ResultSet rs, int rowNum) throws SQLException {
            AchievementResponseDTO dto = new AchievementResponseDTO();
            dto.setAchievementId(rs.getLong("achievement_id"));
            dto.setArtistId(rs.getLong("artist_id"));
            dto.setTitle(rs.getString("title"));
            dto.setType(rs.getString("type"));
            dto.setAchievementDate(rs.getDate("achievement_date").toLocalDate());
            dto.setPrize(rs.getString("prize"));
            dto.setDescription(rs.getString("description"));
            dto.setIconType(rs.getString("icon_type"));
            dto.setColorScheme(rs.getString("color_scheme"));
            dto.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            return dto;
        }
    };

    @Override
    public void saveAchievement(AchievementCreateDTO dto) {
        String sql = "INSERT INTO achievements (artist_id, title, type, achievement_date, prize, description, icon_type, color_scheme, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                dto.getArtistId(),
                dto.getTitle(),
                dto.getType(),
                dto.getAchievementDate(),
                dto.getPrize(),
                dto.getDescription(),
                dto.getIconType(),
                dto.getColorScheme(),
                dto.getCreatedAt() != null ? dto.getCreatedAt() : LocalDateTime.now()
        );
    }

    @Override
    public void deleteAchievementById(Long achievementId) {
        String sql = "DELETE FROM achievements WHERE achievement_id = ?";
        jdbcTemplate.update(sql, achievementId);
    }

    @Override
    public void updateAchievement(AchievementUpdateDTO dto) {
        String sql = "UPDATE achievements SET title = ?, type = ?, achievement_date = ?, prize = ?, description = ?, icon_type = ?, color_scheme = ? WHERE achievement_id = ?";
        jdbcTemplate.update(sql,
                dto.getTitle(),
                dto.getType(),
                dto.getAchievementDate(),
                dto.getPrize(),
                dto.getDescription(),
                dto.getIconType(),
                dto.getColorScheme(),
                dto.getAchievementId()
        );
    }

    @Override
    public List<AchievementResponseDTO> getAchievementsByArtist(Long artistId) {
        String sql = "SELECT * FROM achievements WHERE artist_id = ? ORDER BY achievement_date DESC";
        return jdbcTemplate.query(sql, achievementRowMapper, artistId);
    }

    @Override
    public AchievementResponseDTO getAchievementById(Long achievementId) {
        String sql = "SELECT * FROM achievements WHERE achievement_id = ?";
        List<AchievementResponseDTO> results = jdbcTemplate.query(sql, achievementRowMapper, achievementId);
        return results.isEmpty() ? null : results.get(0);
    }
}