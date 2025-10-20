package com.artaura.artaura.controller;

import com.artaura.artaura.dto.post.PostCreateDTO;
import com.artaura.artaura.dto.post.PostResponseDTO;
import com.artaura.artaura.dto.post.PostUpdateDTO;
import com.artaura.artaura.service.PostService;
import com.artaura.artaura.service.CentralizedUploadService;
import com.artaura.artaura.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CentralizedUploadService centralizedUploadService;

    @PostMapping("/create")
    public ResponseEntity<String> createPost(
            @RequestParam("caption") String caption,
            @RequestParam("location") String location,
            @RequestParam("images") List<MultipartFile> images, // ✅ Changed to accept multiple images
            HttpServletRequest request
    ) {
        try {
            // 🔐 Extract userId and role from JWT
            String token = request.getHeader("Authorization").substring(7);
            Long userId = jwtUtil.extractUserId(token);
            String role = jwtUtil.extractRole(token);

            // 📂 Save multiple images using CentralizedUploadService
            List<String> imagePaths = new ArrayList<>();
            for (MultipartFile image : images) {
                try {
                    String imagePath = centralizedUploadService.savePostImage(image, userId);
                    imagePaths.add(imagePath);
                } catch (IOException e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("Error saving image: " + e.getMessage());
                }
            }

            // 🛠️ Build DTO
            PostCreateDTO postDTO = new PostCreateDTO();
            postDTO.setCaption(caption);
            postDTO.setLocation(location);
            postDTO.setImages(imagePaths);  // ✅ Set multiple image paths
            postDTO.setUserId(userId);     // Use Long directly
            postDTO.setRole(role);

            // 💾 Save post
            postService.createPost(userId, role, postDTO);

            return ResponseEntity.status(HttpStatus.CREATED).body("Post created successfully!");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating post: " + e.getMessage());
        }
    }

    // Delete post
    @DeleteMapping("/{postId}")
    public ResponseEntity<String> deletePost(@PathVariable Long postId) {
        postService.deletePost(postId);
        return ResponseEntity.ok("Post deleted successfully!");
    }

    // Update post
    @PutMapping("/{postId}")
    public ResponseEntity<String> updatePost(
            @PathVariable Long postId,
            @RequestPart("caption") String caption,
            @RequestPart(value = "location", required = false) String location,
            @RequestPart(value = "images", required = false) List<MultipartFile> images // ✅ Multiple images
    ) {
        try {
            PostUpdateDTO postUpdateDTO = new PostUpdateDTO();
            postUpdateDTO.setPostId(postId);
            postUpdateDTO.setCaption(caption);
            postUpdateDTO.setLocation(location);

            // Handle multiple images if provided
            if (images != null && !images.isEmpty()) {
                List<String> imagePaths = new ArrayList<>();
                for (MultipartFile image : images) {
                    try {
                        String imagePath = centralizedUploadService.savePostImage(image, 1L); // Using 1L as dummy userId for updates
                        imagePaths.add(imagePath);
                    } catch (IOException e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("Error saving image: " + e.getMessage());
                    }
                }
                postUpdateDTO.setImages(imagePaths);
            }

            postService.updatePost(postUpdateDTO);  // ✅ Just pass the DTO

            return ResponseEntity.ok("Post updated successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating post: " + e.getMessage());
        }
    }

    @GetMapping("/{role}/{userId}")
    public ResponseEntity<List<PostResponseDTO>> getPostsByUser(
            @PathVariable String role,
            @PathVariable Long userId) {

        List<PostResponseDTO> posts = postService.getPostsByUser(role, userId);
        return ResponseEntity.ok(posts);
    }
}
