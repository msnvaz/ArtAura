package com.artaura.artaura.controller;

import com.artaura.artaura.dto.post.PostCreateDTO;
import com.artaura.artaura.dto.post.PostResponseDTO;
import com.artaura.artaura.dto.post.PostUpdateDTO;
import com.artaura.artaura.service.PostService;
import com.artaura.artaura.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private JwtUtil jwtUtil;
    @PostMapping("/create")
    public ResponseEntity<String> createPost(

    @RequestParam("caption") String caption,
            @RequestParam("location") String location,
            @RequestParam("image") MultipartFile image,
            HttpServletRequest request
    ) {
        try {
            // 🔐 Extract userId and role from JWT
            String token = request.getHeader("Authorization").substring(7);
            Long userId = jwtUtil.extractUserId(token);
            String role = jwtUtil.extractRole(token);

            // 📂 Save image to /uploads/
            String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
            Path uploadDir = Paths.get("uploads");
            Files.createDirectories(uploadDir); // Create folder if not exist
            Path filePath = uploadDir.resolve(fileName);
            Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // 🛠️ Build DTO
            PostCreateDTO postDTO = new PostCreateDTO();
            postDTO.setCaption(caption);
            postDTO.setLocation(location);
            postDTO.setImage("/uploads/" + fileName);  // only the path
            postDTO.setUserId(userId.intValue());     // cast to int if needed
            postDTO.setRole(role);

            // 💾 Save post
            postService.createPost(userId.intValue(), role, postDTO);

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
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        try {
            PostUpdateDTO postUpdateDTO = new PostUpdateDTO();
            postUpdateDTO.setPostId(postId);
            postUpdateDTO.setCaption(caption);

            postService.updatePost(postUpdateDTO, image);  // pass both DTO and MultipartFile

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

