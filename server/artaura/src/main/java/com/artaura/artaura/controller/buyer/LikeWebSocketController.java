package com.artaura.artaura.controller.buyer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class LikeWebSocketController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void broadcastLikeUpdate(Long postId, int newLikeCount) {
        messagingTemplate.convertAndSend("/topic/likes", Map.of("postId", postId, "likes", newLikeCount));
    }
}
