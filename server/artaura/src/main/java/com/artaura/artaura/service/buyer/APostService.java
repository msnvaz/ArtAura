package com.artaura.artaura.service.buyer;

import com.artaura.artaura.dao.buyer.APostDAO;
import com.artaura.artaura.dto.buyer.APostResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class APostService {
    @Autowired
    private APostDAO postDAO;

    public List<APostResponseDTO> getAllPostsSortedByTime() {
        return postDAO.getAllPostsSortedByTime();
    }

    public APostResponseDTO likePost(Long postId) {
        postDAO.incrementLikes(postId);
        return postDAO.getPostById(postId);
    }

    public void toggleLike(Long postId, Long userId) {
        postDAO.toggleLike(postId, userId);
    }
}
