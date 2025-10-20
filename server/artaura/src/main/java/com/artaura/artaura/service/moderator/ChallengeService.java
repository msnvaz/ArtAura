
package com.artaura.artaura.service.moderator;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.artaura.artaura.dao.moderator.ChallengeDAO;
import com.artaura.artaura.dto.moderator.ChallengeDTO;
import com.artaura.artaura.dto.moderator.ChallengeListDTO;
import com.artaura.artaura.dto.buyer.ChallengeSubmissionDTO;
import com.artaura.artaura.dao.buyer.BuyerChallengeDAO;

@Service
public class ChallengeService {
    @Autowired
    private ChallengeDAO challengeDAO;

    @Autowired
    private BuyerChallengeDAO buyerChallengeDAO;

    public void deleteChallenge(int challengeId) {
        challengeDAO.deleteChallenge(challengeId);
    }

    public void createChallenge(ChallengeDTO challenge, String moderatorId) {
        challengeDAO.insertChallenge(challenge, moderatorId);
    }

    public List<ChallengeListDTO> getAllChallenges() {
        return challengeDAO.getAllChallenges();
    }

    public void updateChallenge(ChallengeDTO challenge, String moderatorId) {
        challengeDAO.updateChallenge(challenge, moderatorId);
    }

    /**
     * Get winners for a challenge with marks calculated and positions assigned
     * Formula: MAX(0, (Likes × 10) - (Dislikes × 5))
     * Sorted by marks (highest first), positions assigned to top 3
     */
    public List<ChallengeSubmissionDTO> getWinners(Integer challengeId) {
        // Get submissions sorted by marks (topscores)
        List<ChallengeSubmissionDTO> submissions = buyerChallengeDAO.getSubmissionsByChallengeWithSort(
            challengeId, null, "moderator", "topscores"
        );
        
        // Assign positions to top 3
        for (int i = 0; i < submissions.size() && i < 3; i++) {
            submissions.get(i).setPosition(i + 1);
        }
        
        return submissions;
    }

    /**
     * Update sponsorship status for a challenge
     * If sponsorship becomes 'active' and challenge status is 'draft',
     * automatically change challenge status to 'active'
     */
    public void updateSponsorshipStatus(int challengeId, String sponsorshipStatus) {
        challengeDAO.updateSponsorshipStatus(challengeId, sponsorshipStatus);
    }
}