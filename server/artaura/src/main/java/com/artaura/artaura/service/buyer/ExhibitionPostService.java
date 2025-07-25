package com.artaura.artaura.service.buyer;

import com.artaura.artaura.dao.buyer.ExhibitionPostDAO;
import com.artaura.artaura.dto.exhibition.ExhibitionPostDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExhibitionPostService {

    @Autowired
    private ExhibitionPostDAO exhibitionPostDAO;

    public void saveExhibition(ExhibitionPostDTO post, Long userId) {
        post.setCreatedBy(userId);
        post.setCreatedAt(java.time.LocalDateTime.now().toString());
        post.setStatus("pending"); // Always set status to pending on creation
        exhibitionPostDAO.save(post);
    }

    public List<ExhibitionPostDTO> getAllExhibitions() {
        return exhibitionPostDAO.getAllExhibitions();
    }

    public List<ExhibitionPostDTO> getExhibitionsByUserId(Long userId) {
        return exhibitionPostDAO.findByCreatedBy(userId);
    }

    public ExhibitionPostDTO updateExhibitionPost(Long postId, ExhibitionPostDTO postDTO, Long userId) {
        // Fetch all posts by user
        List<ExhibitionPostDTO> userPosts = exhibitionPostDAO.findByCreatedBy(userId);
        ExhibitionPostDTO existing = userPosts.stream()
            .filter(p -> p.getId().equals(postId))
            .findFirst()
            .orElse(null);
        if (existing == null || existing.getStatus() == null || !"pending".equalsIgnoreCase(existing.getStatus())) {
            return null; // Only allow update if post belongs to user and is pending
        }
        postDTO.setId(postId);
        postDTO.setCreatedBy(userId); // Ensure ownership
        postDTO.setStatus(existing.getStatus()); // Keep status unchanged
        int updated = exhibitionPostDAO.update(postDTO);
        return updated > 0 ? postDTO : null;
    }

    public boolean deleteExhibitionPost(Long postId, Long userId) {
        // Fetch all posts by user
        List<ExhibitionPostDTO> userPosts = exhibitionPostDAO.findByCreatedBy(userId);
        ExhibitionPostDTO existing = userPosts.stream()
            .filter(p -> p.getId().equals(postId))
            .findFirst()
            .orElse(null);
        if (existing == null || existing.getStatus() == null || !"pending".equalsIgnoreCase(existing.getStatus())) {
            return false; // Only allow delete if post belongs to user and is pending
        }
        int deleted = exhibitionPostDAO.delete(postId);
        return deleted > 0;
    }
}