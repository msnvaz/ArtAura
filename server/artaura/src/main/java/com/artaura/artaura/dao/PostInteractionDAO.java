package com.artaura.artaura.dao;

import com.artaura.artaura.dto.post.PostLikeDTO;
import com.artaura.artaura.dto.post.PostCommentDTO;
import java.util.List;

public interface PostInteractionDAO {
    
    // Like operations
    boolean likePost(Long postId, Long userId, String userType);
    boolean unlikePost(Long postId, Long userId, String userType);
    boolean isPostLikedByUser(Long postId, Long userId, String userType);
    int getLikesCount(Long postId);
    List<PostLikeDTO> getPostLikes(Long postId);
    
    // Comment operations
    PostCommentDTO addComment(Long postId, Long userId, String userType, String commentText, Long parentCommentId);
    boolean deleteComment(Long commentId, Long userId, String userType);
    boolean updateComment(Long commentId, Long userId, String userType, String newCommentText);
    List<PostCommentDTO> getPostComments(Long postId);
    int getCommentsCount(Long postId);
    PostCommentDTO getCommentById(Long commentId);
}
