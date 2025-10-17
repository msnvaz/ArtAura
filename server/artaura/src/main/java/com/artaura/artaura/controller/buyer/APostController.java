package com.artaura.artaura.controller.buyer;


import com.artaura.artaura.dto.buyer.APostResponseDTO;
import com.artaura.artaura.service.buyer.APostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/aposts")
public class APostController {
    @Autowired
    private APostService postService;

    @GetMapping("/all")
    public ResponseEntity<List<APostResponseDTO>> getAllPosts() {
        List<APostResponseDTO> posts = postService.getAllPostsSortedByTime();
        return ResponseEntity.ok(posts);
    }

    @MessageMapping("/like")
    @SendTo("/topic/likes")
    public APostResponseDTO likePost(@RequestBody Long postId) {
        return postService.likePost(postId);
    }

    @PostMapping("/toggle-like")
    public ResponseEntity<Void> toggleLike(@RequestBody Map<String, Long> payload) {
        Long postId = payload.get("postId");
        Long userId = payload.get("userId");
        System.out.println("Received postId: " + postId);
        postService.toggleLike(postId, userId);
        return ResponseEntity.ok().build();
    }
}
