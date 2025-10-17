package com.artaura.artaura.dao.Impl;

import com.artaura.artaura.dao.PostInteractionDAO;
import com.artaura.artaura.dto.post.PostLikeDTO;
import com.artaura.artaura.dto.post.PostCommentDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Repository
public class PostInteractionDAOImpl implements PostInteractionDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public boolean likePost(Long postId, Long userId, String userType) {
        try {
            String sql = "INSERT INTO post_likes (post_id, user_id, user_type) VALUES (?, ?, ?)";
            int rowsAffected = jdbcTemplate.update(sql, postId, userId, userType);
            return rowsAffected > 0;
        } catch (Exception e) {
            // Handle duplicate key exception (user already liked)
            return false;
        }
    }

    @Override
    public boolean unlikePost(Long postId, Long userId, String userType) {
        try {
            String sql = "DELETE FROM post_likes WHERE post_id = ? AND user_id = ? AND user_type = ?";
            int rowsAffected = jdbcTemplate.update(sql, postId, userId, userType);
            return rowsAffected > 0;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public boolean isPostLikedByUser(Long postId, Long userId, String userType) {
        try {
            String sql = "SELECT COUNT(*) FROM post_likes WHERE post_id = ? AND user_id = ? AND user_type = ?";
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, postId, userId, userType);
            return count != null && count > 0;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public int getLikesCount(Long postId) {
        try {
            String sql = "SELECT COUNT(*) FROM post_likes WHERE post_id = ?";
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, postId);
            return count != null ? count : 0;
        } catch (Exception e) {
            return 0;
        }
    }

    @Override
    public List<PostLikeDTO> getPostLikes(Long postId) {
        try {
            String sql = """
                SELECT pl.id, pl.post_id, pl.user_id, pl.user_type, pl.created_at,
                       CASE 
                           WHEN pl.user_type = 'ARTIST' THEN CONCAT(a.first_name, ' ', a.last_name)
                           WHEN pl.user_type = 'BUYER' THEN CONCAT(b.first_name, ' ', b.last_name)
                       END as user_name,
                       CASE 
                           WHEN pl.user_type = 'ARTIST' THEN a.avatar_url
                           WHEN pl.user_type = 'BUYER' THEN b.avatar_url
                       END as user_avatar
                FROM post_likes pl
                LEFT JOIN artists a ON pl.user_id = a.artist_id AND pl.user_type = 'ARTIST'
                LEFT JOIN buyers b ON pl.user_id = b.buyer_id AND pl.user_type = 'BUYER'
                WHERE pl.post_id = ?
                ORDER BY pl.created_at DESC
                """;

            return jdbcTemplate.query(sql, (rs, rowNum) -> {
                PostLikeDTO dto = new PostLikeDTO();
                dto.setId(rs.getLong("id"));
                dto.setPostId(rs.getLong("post_id"));
                dto.setUserId(rs.getLong("user_id"));
                dto.setUserType(rs.getString("user_type"));
                
                Timestamp timestamp = rs.getTimestamp("created_at");
                if (timestamp != null) {
                    dto.setCreatedAt(timestamp.toLocalDateTime());
                }
                
                dto.setUserName(rs.getString("user_name"));
                dto.setUserAvatar(rs.getString("user_avatar"));
                
                return dto;
            }, postId);
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    @Override
    public PostCommentDTO addComment(Long postId, Long userId, String userType, String commentText, Long parentCommentId) {
        try {
            String sql = "INSERT INTO post_comments (post_id, user_id, user_type, comment_text, parent_comment_id) VALUES (?, ?, ?, ?, ?)";
            jdbcTemplate.update(sql, postId, userId, userType, commentText, parentCommentId);
            
            // Get the inserted comment ID
            String getIdSql = "SELECT LAST_INSERT_ID()";
            Long commentId = jdbcTemplate.queryForObject(getIdSql, Long.class);
            
            // Return the full comment details
            return getCommentById(commentId);
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public boolean deleteComment(Long commentId, Long userId, String userType) {
        try {
            String sql = "DELETE FROM post_comments WHERE id = ? AND user_id = ? AND user_type = ?";
            int rowsAffected = jdbcTemplate.update(sql, commentId, userId, userType);
            return rowsAffected > 0;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public boolean updateComment(Long commentId, Long userId, String userType, String newCommentText) {
        try {
            String sql = "UPDATE post_comments SET comment_text = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ? AND user_type = ?";
            int rowsAffected = jdbcTemplate.update(sql, newCommentText, commentId, userId, userType);
            return rowsAffected > 0;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public List<PostCommentDTO> getPostComments(Long postId) {
        try {
            String sql = """
                SELECT pc.id, pc.post_id, pc.user_id, pc.user_type, pc.comment_text, 
                       pc.parent_comment_id, pc.created_at, pc.updated_at,
                       CASE 
                           WHEN pc.user_type = 'ARTIST' THEN CONCAT(a.first_name, ' ', a.last_name)
                           WHEN pc.user_type = 'BUYER' THEN CONCAT(b.first_name, ' ', b.last_name)
                       END as user_name,
                       CASE 
                           WHEN pc.user_type = 'ARTIST' THEN a.avatar_url
                           WHEN pc.user_type = 'BUYER' THEN b.avatar_url
                       END as user_avatar
                FROM post_comments pc
                LEFT JOIN artists a ON pc.user_id = a.artist_id AND pc.user_type = 'ARTIST'
                LEFT JOIN buyers b ON pc.user_id = b.buyer_id AND pc.user_type = 'BUYER'
                WHERE pc.post_id = ?
                ORDER BY pc.created_at ASC
                """;

            List<PostCommentDTO> allComments = jdbcTemplate.query(sql, (rs, rowNum) -> {
                PostCommentDTO dto = new PostCommentDTO();
                dto.setId(rs.getLong("id"));
                dto.setPostId(rs.getLong("post_id"));
                dto.setUserId(rs.getLong("user_id"));
                dto.setUserType(rs.getString("user_type"));
                dto.setCommentText(rs.getString("comment_text"));
                
                Long parentId = rs.getLong("parent_comment_id");
                dto.setParentCommentId(rs.wasNull() ? null : parentId);
                
                Timestamp createdAt = rs.getTimestamp("created_at");
                if (createdAt != null) {
                    dto.setCreatedAt(createdAt.toLocalDateTime());
                }
                
                Timestamp updatedAt = rs.getTimestamp("updated_at");
                if (updatedAt != null) {
                    dto.setUpdatedAt(updatedAt.toLocalDateTime());
                }
                
                dto.setUserName(rs.getString("user_name"));
                dto.setUserAvatar(rs.getString("user_avatar"));
                
                return dto;
            }, postId);

            // Organize comments into parent-child structure
            return organizeComments(allComments);
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }

    @Override
    public int getCommentsCount(Long postId) {
        try {
            String sql = "SELECT COUNT(*) FROM post_comments WHERE post_id = ?";
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, postId);
            return count != null ? count : 0;
        } catch (Exception e) {
            return 0;
        }
    }

    @Override
    public PostCommentDTO getCommentById(Long commentId) {
        try {
            String sql = """
                SELECT pc.id, pc.post_id, pc.user_id, pc.user_type, pc.comment_text, 
                       pc.parent_comment_id, pc.created_at, pc.updated_at,
                       CASE 
                           WHEN pc.user_type = 'ARTIST' THEN CONCAT(a.first_name, ' ', a.last_name)
                           WHEN pc.user_type = 'BUYER' THEN CONCAT(b.first_name, ' ', b.last_name)
                       END as user_name,
                       CASE 
                           WHEN pc.user_type = 'ARTIST' THEN a.avatar_url
                           WHEN pc.user_type = 'BUYER' THEN b.avatar_url
                       END as user_avatar
                FROM post_comments pc
                LEFT JOIN artists a ON pc.user_id = a.artist_id AND pc.user_type = 'ARTIST'
                LEFT JOIN buyers b ON pc.user_id = b.buyer_id AND pc.user_type = 'BUYER'
                WHERE pc.id = ?
                """;

            return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
                PostCommentDTO dto = new PostCommentDTO();
                dto.setId(rs.getLong("id"));
                dto.setPostId(rs.getLong("post_id"));
                dto.setUserId(rs.getLong("user_id"));
                dto.setUserType(rs.getString("user_type"));
                dto.setCommentText(rs.getString("comment_text"));
                
                Long parentId = rs.getLong("parent_comment_id");
                dto.setParentCommentId(rs.wasNull() ? null : parentId);
                
                Timestamp createdAt = rs.getTimestamp("created_at");
                if (createdAt != null) {
                    dto.setCreatedAt(createdAt.toLocalDateTime());
                }
                
                Timestamp updatedAt = rs.getTimestamp("updated_at");
                if (updatedAt != null) {
                    dto.setUpdatedAt(updatedAt.toLocalDateTime());
                }
                
                dto.setUserName(rs.getString("user_name"));
                dto.setUserAvatar(rs.getString("user_avatar"));
                
                return dto;
            }, commentId);
        } catch (Exception e) {
            return null;
        }
    }

    private List<PostCommentDTO> organizeComments(List<PostCommentDTO> allComments) {
        List<PostCommentDTO> parentComments = new ArrayList<>();
        
        // Separate parent comments and replies
        for (PostCommentDTO comment : allComments) {
            if (comment.getParentCommentId() == null) {
                // This is a parent comment
                comment.setReplies(new ArrayList<>());
                parentComments.add(comment);
            }
        }
        
        // Add replies to their parent comments
        for (PostCommentDTO comment : allComments) {
            if (comment.getParentCommentId() != null) {
                // This is a reply, find its parent
                for (PostCommentDTO parent : parentComments) {
                    if (parent.getId().equals(comment.getParentCommentId())) {
                        parent.getReplies().add(comment);
                        break;
                    }
                }
            }
        }
        
        return parentComments;
    }
}
