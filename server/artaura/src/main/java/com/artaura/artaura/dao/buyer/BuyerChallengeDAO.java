package com.artaura.artaura.dao.buyer;

import com.artaura.artaura.dto.buyer.ChallengeSubmissionDTO;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface BuyerChallengeDAO {
    /**
     * Find all challenges with active status
     * @return List of active challenges
     */
    List<Map<String, Object>> findActiveChallenges();

    /**
     * Find challenge by ID
     * @param id Challenge ID
     * @return Challenge if found
     */
    Optional<Map<String, Object>> findById(Long id);

    /**
     * Find all challenges
     * @return List of all challenges
     */
    List<Map<String, Object>> findAll();

    /**
     * Find challenges by category
     * @param category Challenge category
     * @return List of challenges in the category
     */
    List<Map<String, Object>> findByCategory(String category);

    /**
     * Find challenges by status
     * @param status Challenge status
     * @return List of challenges with the given status
     */
    List<Map<String, Object>> findByStatus(String status);

    /**
     * Get participant count for a challenge (count of distinct artist_ids)
     * @param challengeId Challenge ID
     * @return Number of unique participants
     */
    int getParticipantCount(Long challengeId);

    /**
     * Get submission count for a challenge (total submissions)
     * @param challengeId Challenge ID
     * @return Total number of submissions
     */
    int getSubmissionCount(Long challengeId);

    /**
     * Get all submissions for a specific challenge
     * @param challengeId Challenge ID
     * @param userId User ID for vote status
     * @param userType User type for vote status
     * @return List of submissions
     */
    List<ChallengeSubmissionDTO> getSubmissionsByChallenge(Integer challengeId, Long userId, String userType);

    /**
     * Get submissions for a challenge with sorting
     * @param challengeId Challenge ID
     * @param userId User ID for vote status
     * @param userType User type for vote status
     * @param sortBy Sort criteria (newest, oldest, mostvoted)
     * @return List of sorted submissions
     */
    List<ChallengeSubmissionDTO> getSubmissionsByChallengeWithSort(Integer challengeId, Long userId, String userType, String sortBy);

    /**
     * Toggle vote for a submission (add vote if not voted, remove if already voted)
     * @param submissionId Submission ID
     * @param userId User ID
     * @return true if vote was added, false if vote was removed
     */
    boolean toggleVote(Long submissionId, Long userId);

    /**
     * Check if user has voted for a submission
     * @param submissionId Submission ID
     * @param userId User ID
     * @return true if user has voted, false otherwise
     */
    boolean hasUserVoted(Long submissionId, Long userId);

    /**
     * Get total vote count for a submission
     * @param submissionId Submission ID
     * @return Total vote count
     */
    int getSubmissionVoteCount(Long submissionId);
}
