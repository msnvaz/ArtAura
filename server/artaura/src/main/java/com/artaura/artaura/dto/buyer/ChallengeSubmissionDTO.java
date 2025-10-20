package com.artaura.artaura.dto.buyer;

import java.time.LocalDateTime;

public class ChallengeSubmissionDTO {
    // Challenge participants table columns
    private Long id;                        // id from challenge_participants
    private Integer challengeId;            // challenge_id
    private Long artistId;                  // artist_id
    private String artworkTitle;            // artwork_title
    private String artworkDescription;      // artwork_description
    private String artworkImagePath;        // artwork_image_path
    private LocalDateTime submissionDate;   // submission_date
    private String status;                  // status
    private Double rating;                  // rating
    private String judgeComments;          // judge_comments
    private LocalDateTime createdAt;        // created_at
    private LocalDateTime updatedAt;        // updated_at

    // Artist information (joined from artists table)
    private String artistName;
    private String artistAvatar;
    private Integer artistFollowers;

    // Voting information (for compatibility with existing voting system)
    private Integer votesCount;
    private Boolean userHasVoted;

    // Like/Dislike information (for the new reaction system)
    private Integer likesCount;
    private Integer dislikesCount;
    private String userReaction; // "like", "dislike", or null

    // Scoring and Winner information
    private Integer marks; // Calculated: MAX(0, (Likes × 10) - (Dislikes × 5))
    private Integer position; // Winner position: 1, 2, 3, etc. (null if not a winner)

    // Constructors
    public ChallengeSubmissionDTO() {}

    // Getters and Setters for challenge_participants table columns
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getChallengeId() { return challengeId; }
    public void setChallengeId(Integer challengeId) { this.challengeId = challengeId; }

    public Long getArtistId() { return artistId; }
    public void setArtistId(Long artistId) { this.artistId = artistId; }

    public String getArtworkTitle() { return artworkTitle; }
    public void setArtworkTitle(String artworkTitle) { this.artworkTitle = artworkTitle; }

    public String getArtworkDescription() { return artworkDescription; }
    public void setArtworkDescription(String artworkDescription) { this.artworkDescription = artworkDescription; }

    public String getArtworkImagePath() { return artworkImagePath; }
    public void setArtworkImagePath(String artworkImagePath) { this.artworkImagePath = artworkImagePath; }

    public LocalDateTime getSubmissionDate() { return submissionDate; }
    public void setSubmissionDate(LocalDateTime submissionDate) { this.submissionDate = submissionDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public String getJudgeComments() { return judgeComments; }
    public void setJudgeComments(String judgeComments) { this.judgeComments = judgeComments; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Artist information getters and setters
    public String getArtistName() { return artistName; }
    public void setArtistName(String artistName) { this.artistName = artistName; }

    public String getArtistAvatar() { return artistAvatar; }
    public void setArtistAvatar(String artistAvatar) { this.artistAvatar = artistAvatar; }

    public Integer getArtistFollowers() { return artistFollowers; }
    public void setArtistFollowers(Integer artistFollowers) { this.artistFollowers = artistFollowers; }

    // Voting information getters and setters
    public Integer getVotesCount() { return votesCount; }
    public void setVotesCount(Integer votesCount) { this.votesCount = votesCount; }

    public Boolean getUserHasVoted() { return userHasVoted; }
    public void setUserHasVoted(Boolean userHasVoted) { this.userHasVoted = userHasVoted; }

    // Like/Dislike information getters and setters
    public Integer getLikesCount() { return likesCount; }
    public void setLikesCount(Integer likesCount) { this.likesCount = likesCount; }

    public Integer getDislikesCount() { return dislikesCount; }
    public void setDislikesCount(Integer dislikesCount) { this.dislikesCount = dislikesCount; }

    public String getUserReaction() { return userReaction; }
    public void setUserReaction(String userReaction) { this.userReaction = userReaction; }

    // Scoring and Winner information getters and setters
    public Integer getMarks() { return marks; }
    public void setMarks(Integer marks) { this.marks = marks; }

    public Integer getPosition() { return position; }
    public void setPosition(Integer position) { this.position = position; }

    // Legacy compatibility methods for backward compatibility
    public Long getSubmissionId() { return this.id; }
    public void setSubmissionId(Long submissionId) { this.id = submissionId; }

    public String getTitle() { return this.artworkTitle; }
    public void setTitle(String title) { this.artworkTitle = title; }

    public String getDescription() { return this.artworkDescription; }
    public void setDescription(String description) { this.artworkDescription = description; }

    public String getImageUrl() { return this.artworkImagePath; }
    public void setImageUrl(String imageUrl) { this.artworkImagePath = imageUrl; }

    public LocalDateTime getSubmittedAt() { return this.submissionDate; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submissionDate = submittedAt; }
}
