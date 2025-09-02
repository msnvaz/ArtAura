package com.artaura.artaura.controller.buyer;

import com.artaura.artaura.service.buyer.BuyerChallengeService;
import com.artaura.artaura.dto.buyer.ChallengeDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/buyer/challenges")
public class BuyerChallengeController {
    @Autowired
    private BuyerChallengeService challengeService;

    // Get all active challenges for buyers
    @GetMapping("/active")
    public ResponseEntity<List<ChallengeDTO>> getActiveChallenges() {
        List<ChallengeDTO> challenges = challengeService.getActiveChallenges();
        return ResponseEntity.ok(challenges);
    }
}
