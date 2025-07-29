
package com.artaura.artaura.service.moderator;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.artaura.artaura.dao.moderator.ChallengeDAO;
import com.artaura.artaura.dto.moderator.ChallengeDTO;
import com.artaura.artaura.dto.moderator.ChallengeListDTO;

@Service
public class ChallengeService {
    @Autowired
    private ChallengeDAO challengeDAO;

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
}