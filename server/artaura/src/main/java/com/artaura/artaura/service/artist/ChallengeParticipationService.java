package com.artaura.artaura.service.artist;

import com.artaura.artaura.dao.artist.ChallengeParticipationDAO;
import com.artaura.artaura.dto.artist.ChallengeParticipationDTO;
import com.artaura.artaura.dto.moderator.ChallengeDTO;
import com.artaura.artaura.entity.ChallengeParticipant;
import com.artaura.artaura.service.CentralizedUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChallengeParticipationService {

    @Autowired
    private ChallengeParticipationDAO challengeParticipationDAO;

    @Autowired
    private CentralizedUploadService uploadService;

    public List<ChallengeDTO> getActiveChallenges() {
        return challengeParticipationDAO.getActiveChallenges();
    }

    public List<ChallengeParticipationDTO> getArtistParticipations(Long artistId) {
        return challengeParticipationDAO.getArtistParticipations(artistId);
    }

    public Long submitParticipation(Long challengeId, Long artistId, String artworkTitle,
            String artworkDescription, MultipartFile artworkImage) throws Exception {

        // Check if artist has already participated
        if (challengeParticipationDAO.hasArtistParticipated(challengeId, artistId)) {
            throw new IllegalStateException("Artist has already participated in this challenge");
        }

        // Validate challenge exists and is active
        ChallengeDTO challenge = challengeParticipationDAO.getChallengeById(challengeId);
        if (challenge == null) {
            throw new IllegalArgumentException("Challenge not found or not active");
        }

        // Upload artwork image to challenges folder
        String imagePath = uploadService.saveImageToPublicUploads(artworkImage, "challenges", "challenge_" + challengeId + "_artist_" + artistId);

        // Create participation entity
        ChallengeParticipant participation = new ChallengeParticipant();
        participation.setChallengeId(challengeId);
        participation.setArtistId(artistId);
        participation.setArtworkTitle(artworkTitle);
        participation.setArtworkDescription(artworkDescription);
        participation.setArtworkImagePath(imagePath);
        participation.setSubmissionDate(LocalDateTime.now());
        participation.setStatus("submitted");

        return challengeParticipationDAO.submitParticipation(participation);
    }

    public boolean checkParticipation(Long challengeId, Long artistId) {
        return challengeParticipationDAO.hasArtistParticipated(challengeId, artistId);
    }

    public ChallengeDTO getChallengeDetails(Long challengeId) {
        return challengeParticipationDAO.getChallengeById(challengeId);
    }
}
