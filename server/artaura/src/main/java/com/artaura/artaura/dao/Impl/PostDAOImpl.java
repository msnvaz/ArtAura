package com.artaura.artaura.dao.Impl;

import com.artaura.artaura.dao.PostDAO;
import com.artaura.artaura.dto.post.PostCreateDTO;
import com.artaura.artaura.dto.post.PostResponseDTO;
import com.artaura.artaura.dto.post.PostUpdateDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Repository
public class PostDAOImpl implements PostDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void savePost(Long userId, String role, PostCreateDTO postDTO) {
        String sql = "INSERT INTO post (user_id, role, caption, image, location, created_at) "
                + "VALUES (?, ?, ?, ?, ?, ?)";

        // Convert images list to JSON string for database storage
        String imagesJson = null;
        try {
            if (postDTO.getImages() != null && !postDTO.getImages().isEmpty()) {
                imagesJson = objectMapper.writeValueAsString(postDTO.getImages());
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting images to JSON", e);
        }

        jdbcTemplate.update(sql,
                userId, // ✅ passed separately
                role, // ✅ passed separately
                postDTO.getCaption(),
                imagesJson, // ✅ stored as JSON array string
                postDTO.getLocation(),
                LocalDateTime.now() // 🕐 explicitly set current timestamp
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

        if (dto.getImages() != null && !dto.getImages().isEmpty()) {
            if (!first) {
                sql.append(", ");
            }
            sql.append("image = ?");

            // Convert images list to JSON string
            try {
                String imagesJson = objectMapper.writeValueAsString(dto.getImages());
                params.add(imagesJson);
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Error converting images to JSON", e);
            }
            first = false;
        }

        if (dto.getLocation() != null) {
            if (!first) {
                sql.append(", ");
            }
            sql.append("location = ?");
            params.add(dto.getLocation());
        }

        sql.append(" WHERE post_id = ?");
        params.add(dto.getPostId());

        jdbcTemplate.update(sql.toString(), params.toArray());
    }

    @Override
    public List<PostResponseDTO> getPostsByUser(String role, Long userId) {
        String sql = """
            SELECT p.*, 
                   COALESCE(l.likes_count, 0) as likes_count,
                   COALESCE(c.comments_count, 0) as comments_count
            FROM post p
            LEFT JOIN (
                SELECT post_id, COUNT(*) as likes_count 
                FROM post_likes 
                GROUP BY post_id
            ) l ON p.post_id = l.post_id
            LEFT JOIN (
                SELECT post_id, COUNT(*) as comments_count 
                FROM post_comments 
                GROUP BY post_id
            ) c ON p.post_id = c.post_id
            WHERE p.user_id = ? AND p.role = ? 
            ORDER BY p.created_at DESC
            """;

        return jdbcTemplate.query(sql, new Object[]{userId, role}, (rs, rowNum) -> {
            PostResponseDTO post = new PostResponseDTO();
            post.setPost_id(rs.getLong("post_id"));
            post.setCaption(rs.getString("caption"));

            // Convert JSON string back to List<String>
            String imagesJson = rs.getString("image");
            List<String> imagesList = null;
            if (imagesJson != null && !imagesJson.trim().isEmpty()) {
                try {
                    imagesList = objectMapper.readValue(imagesJson, new TypeReference<List<String>>() {
                    });
                } catch (JsonProcessingException e) {
                    // If JSON parsing fails, treat as single image (backward compatibility)
                    imagesList = new ArrayList<>();
                    imagesList.add(imagesJson);
                }
            }
            post.setImages(imagesList != null ? imagesList : new ArrayList<>());

            post.setLocation(rs.getString("location"));
            post.setCreated_at(rs.getTimestamp("created_at").toLocalDateTime());
            // Use the aggregated counts from the separate tables
            post.setLikes(rs.getInt("likes_count"));
            post.setComments(rs.getInt("comments_count"));
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

            // Convert JSON string back to List<String>
            String imagesJson = rs.getString("image");
            List<String> imagesList = null;
            if (imagesJson != null && !imagesJson.trim().isEmpty()) {
                try {
                    imagesList = objectMapper.readValue(imagesJson, new TypeReference<List<String>>() {
                    });
                } catch (JsonProcessingException e) {
                    // If JSON parsing fails, treat as single image (backward compatibility)
                    imagesList = new ArrayList<>();
                    imagesList.add(imagesJson);
                }
            }
            post.setImages(imagesList != null ? imagesList : new ArrayList<>());

            post.setLocation(rs.getString("location"));
            post.setCreated_at(rs.getTimestamp("created_at").toLocalDateTime());
            post.setLikes(rs.getInt("likes"));
            return post;
        });
    }

}
