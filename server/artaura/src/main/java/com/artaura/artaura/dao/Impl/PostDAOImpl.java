package com.artaura.artaura.dao.Impl;

import com.artaura.artaura.dao.PostDAO;
import com.artaura.artaura.dto.post.PostCreateDTO;
import com.artaura.artaura.dto.post.PostResponseDTO;
import com.artaura.artaura.dto.post.PostUpdateDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Repository
public class PostDAOImpl implements PostDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void savePost(int userId, String role, PostCreateDTO postDTO) {
        String sql = "INSERT INTO post (user_id, role, caption, image, location) "
                + "VALUES (?, ?, ?, ?, ?)";

        jdbcTemplate.update(sql,
                userId, // ✅ passed separately
                role, // ✅ passed separately
                postDTO.getCaption(),
                postDTO.getImage(), // ✅ should be image path like /uploads/image.jpg
                postDTO.getLocation()// 🕐 sets the current date
        );
    }

    @Override
    public void deletePostById(Long postId) {
        String sql = "DELETE FROM post WHERE post_id = ?";
        jdbcTemplate.update(sql, postId);
    }

    @Override
    public void updatePost(PostUpdateDTO dto) {
        StringBuilder sql = new StringBuilder("UPDATE post SET ");
        List<Object> params = new ArrayList<>();
        boolean first = true;

        if (dto.getCaption() != null) {
            sql.append("caption = ?");
            params.add(dto.getCaption());
            first = false;
        }

        if (dto.getImage() != null) {
            if (!first) {
                sql.append(", ");
            }
            sql.append("image = ?");
            params.add(dto.getImage());
            first = false;
        }

        if (dto.getLocation() != null) {
            if (!first) {
                sql.append(", ");
            }
            sql.append("location = ?");
            params.add(dto.getLocation());
            first = false;
        }

        sql.append(" WHERE post_id = ?");
        params.add(dto.getPostId());

        jdbcTemplate.update(sql.toString(), params.toArray());
    }

    public List<PostResponseDTO> getPostsByUser(String role, Long userId) {
        String sql = "SELECT * FROM post WHERE user_id = ? AND role = ?";

        return jdbcTemplate.query(sql, new Object[]{userId, role}, (rs, rowNum) -> {
            PostResponseDTO post = new PostResponseDTO();
            post.setPost_id(rs.getLong("post_id"));
            post.setCaption(rs.getString("caption"));
            post.setImage(rs.getString("image"));
            post.setLocation(rs.getString("location"));
            post.setCreated_at(rs.getTimestamp("created_at").toLocalDateTime());
            post.setLikes(rs.getInt("likes"));
            return post;
        });
    }

    @Override
    public PostResponseDTO getPostById(Long postId) {
        String sql = "SELECT * FROM post WHERE post_id = ?";
        return jdbcTemplate.queryForObject(sql, new Object[]{postId}, (rs, rowNum) -> {
            PostResponseDTO post = new PostResponseDTO();
            post.setPost_id(rs.getLong("post_id"));
            post.setCaption(rs.getString("caption"));
            post.setImage(rs.getString("image"));
            post.setLocation(rs.getString("location"));
            post.setCreated_at(rs.getTimestamp("created_at").toLocalDateTime());
            post.setLikes(rs.getInt("likes"));
            return post;
        });
    }

}
