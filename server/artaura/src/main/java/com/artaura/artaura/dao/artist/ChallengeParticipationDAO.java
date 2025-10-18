package com.artaura.artaura.dao.artist;

import com.artaura.artaura.dto.artist.ChallengeParticipationDTO;
import com.artaura.artaura.dto.moderator.ChallengeDTO;
import com.artaura.artaura.entity.ChallengeParticipant;
import java.util.List;

public interface ChallengeParticipationDAO {

    // Get active challenges for artists
    List<ChallengeDTO> getActiveChallenges();

    // Get artist's challenge participations
    List<ChallengeParticipationDTO> getArtistParticipations(Long artistId);

    // Submit challenge participation
    Long submitParticipation(ChallengeParticipant participation);

    // Check if artist has already participated in a challenge
    boolean hasArtistParticipated(Long challengeId, Long artistId);

    // Get challenge details by ID
    ChallengeDTO getChallengeById(Long challengeId);

    // Update participation status
    boolean updateParticipationStatus(Long participationId, String status);
}
