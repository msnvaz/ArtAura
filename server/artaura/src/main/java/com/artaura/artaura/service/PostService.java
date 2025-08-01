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

    public void createPost(int userId, String role, PostCreateDTO postDTO) {
        postDAO.savePost(userId, role, postDTO);
    }


    public void deletePost(Long postId) {
        postDAO.deletePostById(postId);
    }


    public PostResponseDTO updatePost(PostUpdateDTO dto, MultipartFile imageFile) throws IOException {
        if (imageFile != null && !imageFile.isEmpty()) {
            String folder = "uploads";
            String filename = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
            Path uploadPath = Paths.get(folder);
            Files.createDirectories(uploadPath);
            Path filePath = uploadPath.resolve(filename);
            Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            dto.setImage("/uploads/" + filename);
        }

        postDAO.updatePost(dto);
        return postDAO.getPostById(dto.getPostId()); // ✅ return the updated post
    }

    public List<PostResponseDTO> getPostsByUser(String role, Long userId) {
        return postDAO.getPostsByUser(role, userId);
    }
}

