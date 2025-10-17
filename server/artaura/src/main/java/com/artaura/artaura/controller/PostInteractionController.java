package com.artaura.artaura.controller;

import com.artaura.artaura.service.PostInteractionService;
import com.artaura.artaura.dto.post.PostLikeDTO;
import com.artaura.artaura.dto.post.PostCommentDTO;
import com.artaura.artaura.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:5173")
public class PostInteractionController {

    @Autowired
    private PostInteractionService postInteractionService;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Toggle like on a post
     */
    @PostMapping("/{postId}/like")
    public ResponseEntity<Map<String, Object>> toggleLike(@PathVariable Long postId,
                                                         @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            Long userId = jwtUtil.extractUserId(token);
            String userType = jwtUtil.extractUserType(token);

            boolean success = postInteractionService.toggleLike(postId, userId, userType);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", success);
            response.put("liked", postInteractionService.isPostLikedByUser(postId, userId, userType));
            response.put("likesCount", postInteractionService.getLikesCount(postId));
            response.put("message", success ? "Like toggled successfully" : "Failed to toggle like");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error toggling like: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get likes for a post
     */
    @GetMapping("/{postId}/likes")
    public ResponseEntity<Map<String, Object>> getPostLikes(@PathVariable Long postId) {
        try {
            List<PostLikeDTO> likes = postInteractionService.getPostLikes(postId);
            int likesCount = postInteractionService.getLikesCount(postId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("likes", likes);
            response.put("likesCount", likesCount);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error fetching likes: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Add a comment to a post
     */
    @PostMapping("/{postId}/comments")
    public ResponseEntity<Map<String, Object>> addComment(@PathVariable Long postId,
                                                         @RequestHeader("Authorization") String authHeader,
                                                         @RequestBody Map<String, Object> requestBody) {
        try {
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            Long userId = jwtUtil.extractUserId(token);
            String userType = jwtUtil.extractUserType(token);
            String commentText = (String) requestBody.get("commentText");
            Long parentCommentId = requestBody.get("parentCommentId") != null ? 
                                  Long.valueOf(requestBody.get("parentCommentId").toString()) : null;

            System.out.println("=== ADD COMMENT DEBUG ===");
            System.out.println("PostId: " + postId);
            System.out.println("UserId: " + userId);
            System.out.println("UserType: " + userType);
            System.out.println("CommentText: " + commentText);
            System.out.println("ParentCommentId: " + parentCommentId);

            if (commentText == null || commentText.trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Comment text is required");
                return ResponseEntity.badRequest().body(response);
            }

            PostCommentDTO comment;
            if (parentCommentId != null) {
                comment = postInteractionService.addReply(postId, userId, userType, commentText.trim(), parentCommentId);
            } else {
                comment = postInteractionService.addComment(postId, userId, userType, commentText.trim());
            }

            Map<String, Object> response = new HashMap<>();
            if (comment != null) {
                response.put("success", true);
                response.put("comment", comment);
                response.put("commentsCount", postInteractionService.getCommentsCount(postId));
                response.put("message", "Comment added successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Failed to add comment");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error adding comment: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get comments for a post
     */
    @GetMapping("/{postId}/comments")
    public ResponseEntity<Map<String, Object>> getPostComments(@PathVariable Long postId) {
        try {
            System.out.println("=== GET COMMENTS DEBUG ===");
            System.out.println("Fetching comments for PostId: " + postId);
            
            List<PostCommentDTO> comments = postInteractionService.getPostComments(postId);
            int commentsCount = postInteractionService.getCommentsCount(postId);

            System.out.println("Found " + comments.size() + " comments");
            System.out.println("Comments count: " + commentsCount);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("comments", comments);
            response.put("commentsCount", commentsCount);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error fetching comments: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Update a comment
     */
    @PutMapping("/comments/{commentId}")
    public ResponseEntity<Map<String, Object>> updateComment(@PathVariable Long commentId,
                                                           @RequestHeader("Authorization") String authHeader,
                                                           @RequestBody Map<String, String> requestBody) {
        try {
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            Long userId = jwtUtil.extractUserId(token);
            String userType = jwtUtil.extractUserType(token);
            String newCommentText = requestBody.get("commentText");

            if (newCommentText == null || newCommentText.trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Comment text is required");
                return ResponseEntity.badRequest().body(response);
            }

            boolean success = postInteractionService.updateComment(commentId, userId, userType, newCommentText.trim());

            Map<String, Object> response = new HashMap<>();
            response.put("success", success);
            response.put("message", success ? "Comment updated successfully" : "Failed to update comment or unauthorized");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error updating comment: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Delete a comment
     */
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Map<String, Object>> deleteComment(@PathVariable Long commentId,
                                                           @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            Long userId = jwtUtil.extractUserId(token);
            String userType = jwtUtil.extractUserType(token);

            boolean success = postInteractionService.deleteComment(commentId, userId, userType);

            Map<String, Object> response = new HashMap<>();
            response.put("success", success);
            response.put("message", success ? "Comment deleted successfully" : "Failed to delete comment or unauthorized");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error deleting comment: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Check if user liked a post (for initial state)
     */
    @GetMapping("/{postId}/like-status")
    public ResponseEntity<Map<String, Object>> getLikeStatus(@PathVariable Long postId,
                                                           @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7); // Remove "Bearer " prefix
            Long userId = jwtUtil.extractUserId(token);
            String userType = jwtUtil.extractUserType(token);

            boolean liked = postInteractionService.isPostLikedByUser(postId, userId, userType);
            int likesCount = postInteractionService.getLikesCount(postId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("liked", liked);
            response.put("likesCount", likesCount);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error fetching like status: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
