package com.artaura.artaura.service.moderator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.artaura.artaura.dao.moderator.ChallengeDAO;

@Service
public class ChallengeStatusScheduler {
    
    @Autowired
    private ChallengeDAO challengeDAO;

    /**
     * Automatically update challenge status to 'completed' when deadline passes.
     * Runs every hour (3600000 milliseconds = 1 hour).
     * You can adjust the schedule using cron expression or fixed rate.
     */
    @Scheduled(fixedRate = 3600000) // Runs every 1 hour
    public void updateExpiredChallenges() {
        try {
            int updatedCount = challengeDAO.updateExpiredChallenges();
            if (updatedCount > 0) {
                System.out.println("Challenge Status Update: " + updatedCount + 
                                 " challenge(s) automatically marked as completed");
            }
        } catch (Exception e) {
            System.err.println("Error updating expired challenges: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
