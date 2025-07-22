package com.artaura.artaura.service;

import com.artaura.artaura.dao.PostDAO;
import com.artaura.artaura.dto.post.PostCreateDTO;
import com.artaura.artaura.dto.post.PostResponseDTO;
import com.artaura.artaura.dto.post.PostUpdateDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.nio.file.*;

@Service
public class PostService {

    @Autowired
    private PostDAO postDAO;

    public void createPost(Long userId, String role, PostCreateDTO postDTO) {
        postDAO.savePost(userId, role, postDTO);
    }

    public void deletePost(Long postId) {
        postDAO.deletePostById(postId);
    }

    public void updatePost(PostUpdateDTO dto) throws IOException {
        // Image handling is now done in the controller for consistency
        // The DTO already contains the processed image paths
        postDAO.updatePost(dto);
    }

    public List<PostResponseDTO> getPostsByUser(String role, Long userId) {
        return postDAO.getPostsByUser(role, userId);
    }
}
