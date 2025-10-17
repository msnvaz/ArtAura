package com.artaura.artaura.dto.buyer;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class ReviewCreateRequest {
    @NotNull
    private Long artistId;
    @NotNull
    private Long buyerId;
    @NotNull
    @Min(1)
    @Max(5)
    private Integer rating;
    private String comment;
    @NotNull
    private Long orderId;

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
}