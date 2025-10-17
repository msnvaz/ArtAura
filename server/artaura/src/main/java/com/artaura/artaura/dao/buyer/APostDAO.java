package com.artaura.artaura.dao.buyer;

import com.artaura.artaura.dto.buyer.APostResponseDTO;
import com.artaura.artaura.dto.post.PostResponseDTO;

import java.util.List;

public interface APostDAO {
    List<APostResponseDTO> getAllPostsSortedByTime();
    void incrementLikes(Long postId);
    APostResponseDTO getPostById(Long postId);
    void toggleLike(Long postId, Long userId);
}
