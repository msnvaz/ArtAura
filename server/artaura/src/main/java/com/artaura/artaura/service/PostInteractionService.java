package com.artaura.artaura.service;

import com.artaura.artaura.dao.PostInteractionDAO;
import com.artaura.artaura.dto.post.PostLikeDTO;
import com.artaura.artaura.dto.post.PostCommentDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostInteractionService {

    @Autowired
    private PostInteractionDAO postInteractionDAO;

    // Like operations
    public boolean toggleLike(Long postId, Long userId, String userType) {
        boolean isCurrentlyLiked = postInteractionDAO.isPostLikedByUser(postId, userId, userType);
        if (isCurrentlyLiked) {
            return postInteractionDAO.unlikePost(postId, userId, userType);
        } else {
            return postInteractionDAO.likePost(postId, userId, userType);
        }
    }

    public boolean isPostLikedByUser(Long postId, Long userId, String userType) {
        return postInteractionDAO.isPostLikedByUser(postId, userId, userType);
    }

    public int getLikesCount(Long postId) {
        return postInteractionDAO.getLikesCount(postId);
    }

    public List<PostLikeDTO> getPostLikes(Long postId) {
        return postInteractionDAO.getPostLikes(postId);
    }

    // Comment operations
    public PostCommentDTO addComment(Long postId, Long userId, String userType, String commentText) {
        return postInteractionDAO.addComment(postId, userId, userType, commentText, null);
    }

    public PostCommentDTO addReply(Long postId, Long userId, String userType, String commentText, Long parentCommentId) {
        return postInteractionDAO.addComment(postId, userId, userType, commentText, parentCommentId);
    }

    public boolean deleteComment(Long commentId, Long userId, String userType) {
        return postInteractionDAO.deleteComment(commentId, userId, userType);
    }

    public boolean updateComment(Long commentId, Long userId, String userType, String newCommentText) {
        return postInteractionDAO.updateComment(commentId, userId, userType, newCommentText);
    }

    public List<PostCommentDTO> getPostComments(Long postId) {
        return postInteractionDAO.getPostComments(postId);
    }

    public int getCommentsCount(Long postId) {
        return postInteractionDAO.getCommentsCount(postId);
    }

    public PostCommentDTO getCommentById(Long commentId) {
        return postInteractionDAO.getCommentById(commentId);
    }
}
