package com.artaura.artaura.dto.buyer;

import java.time.LocalDateTime;

public class ReviewResponse {
    private Long reviewId;
    private Long artistId;
    private Long buyerId;
    private Integer rating;
    private String comment;
    private Long orderId;
    private LocalDateTime createdAt;

    public ReviewResponse() {}

    public ReviewResponse(Long reviewId, Long artistId, Long buyerId, Integer rating, String comment, Long orderId, LocalDateTime createdAt) {
        this.reviewId = reviewId;
        this.artistId = artistId;
        this.buyerId = buyerId;
        this.rating = rating;
        this.comment = comment;
        this.orderId = orderId;
        this.createdAt = createdAt;
    }

    public Long getReviewId() { return reviewId; }
    public void setReviewId(Long reviewId) { this.reviewId = reviewId; }
    public Long getArtistId() { return artistId; }
    public void setArtistId(Long artistId) { this.artistId = artistId; }
    public Long getBuyerId() { return buyerId; }
    public void setBuyerId(Long buyerId) { this.buyerId = buyerId; }
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
