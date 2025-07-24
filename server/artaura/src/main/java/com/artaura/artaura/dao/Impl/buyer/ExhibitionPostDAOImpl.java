package com.artaura.artaura.dao.Impl.buyer;

import com.artaura.artaura.dao.buyer.ExhibitionPostDAO;
import com.artaura.artaura.dto.exhibition.ExhibitionPostDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ExhibitionPostDAOImpl implements ExhibitionPostDAO {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public int save(ExhibitionPostDTO post) {
        String sql = "INSERT INTO exhibitions (title, description, location, category, start_date, end_date, start_time, end_time, organizer, entry_fee, max_participants, contact_email, contact_phone, requirements, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql,
                post.getTitle(),
                post.getDescription(),
                post.getLocation(),
                post.getCategory(),
                post.getStartDate(),
                post.getEndDate(),
                post.getStartTime(),
                post.getEndTime(),
                post.getOrganizer(),
                post.getEntryFee(),
                post.getMaxParticipants(),
                post.getContactEmail(),
                post.getContactPhone(),
                post.getRequirements(),
                post.getCreatedBy(),
                post.getCreatedAt()
        );
    }

    @Override
    public List<ExhibitionPostDTO> getAllExhibitions() {
        String sql = "SELECT * FROM exhibitions";
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            ExhibitionPostDTO exhibition = new ExhibitionPostDTO();
            exhibition.setId(rs.getLong("id"));
            exhibition.setTitle(rs.getString("title"));
            exhibition.setDescription(rs.getString("description"));
            exhibition.setLocation(rs.getString("location"));
            exhibition.setCategory(rs.getString("category"));
            exhibition.setStartDate(rs.getString("start_date"));
            exhibition.setEndDate(rs.getString("end_date"));
            exhibition.setStartTime(rs.getString("start_time"));
            exhibition.setEndTime(rs.getString("end_time"));
            exhibition.setOrganizer(rs.getString("organizer"));
            exhibition.setEntryFee(rs.getString("entry_fee"));
            exhibition.setMaxParticipants(rs.getInt("max_participants"));
            exhibition.setContactEmail(rs.getString("contact_email"));
            exhibition.setContactPhone(rs.getString("contact_phone"));
            exhibition.setRequirements(rs.getString("requirements"));
            exhibition.setCreatedBy(rs.getLong("created_by"));
            exhibition.setCreatedAt(rs.getString("created_at"));
            // If you have any JSON fields, parse them here as needed
            return exhibition;
        });
    }
}
