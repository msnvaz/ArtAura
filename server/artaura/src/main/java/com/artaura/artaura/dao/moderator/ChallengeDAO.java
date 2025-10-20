package com.artaura.artaura.dao.moderator;

import java.util.List;

import com.artaura.artaura.dto.moderator.ChallengeDTO;
import com.artaura.artaura.dto.moderator.ChallengeListDTO;

public interface ChallengeDAO {
    void insertChallenge(ChallengeDTO challenge, String moderatorId);
    List<ChallengeListDTO> getAllChallenges();
    void deleteChallenge(int challengeId);
    void updateChallenge(ChallengeDTO challenge, String moderatorId);
    int updateExpiredChallenges();
    void publishChallenge(int challengeId);  // New method to publish draft challenges
    void updateSponsorshipStatus(int challengeId, String sponsorshipStatus); // Update sponsorship and auto-activate draft challenges
}
