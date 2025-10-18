package com.artaura.artaura.dto.artist;

import java.math.BigDecimal;

/**
 * DTO for representing artwork order items from the perspective of artists
 */
public class ArtistArtworkOrderItemDTO {

    private Long itemId;
    private Long orderId;
    private Long artworkId;
    private int quantity;
    private BigDecimal price;
    private String artworkTitle;
    private String artworkMedium;
    private String artworkSize;
    private String artworkImageUrl;

    // Constructors
    public ArtistArtworkOrderItemDTO() {
    }

    public ArtistArtworkOrderItemDTO(Long itemId, Long orderId, Long artworkId,
            int quantity, BigDecimal price, String artworkTitle,
            String artworkMedium, String artworkSize,
            String artworkImageUrl) {
        this.itemId = itemId;
        this.orderId = orderId;
        this.artworkId = artworkId;
        this.quantity = quantity;
        this.price = price;
        this.artworkTitle = artworkTitle;
        this.artworkMedium = artworkMedium;
        this.artworkSize = artworkSize;
        this.artworkImageUrl = artworkImageUrl;
    }

    // Getters and Setters
    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getArtworkId() {
        return artworkId;
    }

    public void setArtworkId(Long artworkId) {
        this.artworkId = artworkId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getArtworkTitle() {
        return artworkTitle;
    }

    public void setArtworkTitle(String artworkTitle) {
        this.artworkTitle = artworkTitle;
    }

    public String getArtworkMedium() {
        return artworkMedium;
    }

    public void setArtworkMedium(String artworkMedium) {
        this.artworkMedium = artworkMedium;
    }

    public String getArtworkSize() {
        return artworkSize;
    }

    public void setArtworkSize(String artworkSize) {
        this.artworkSize = artworkSize;
    }

    public String getArtworkImageUrl() {
        return artworkImageUrl;
    }

    public void setArtworkImageUrl(String artworkImageUrl) {
        this.artworkImageUrl = artworkImageUrl;
    }

    // Helper methods
    public BigDecimal getTotalPrice() {
        if (price != null) {
            return price.multiply(BigDecimal.valueOf(quantity));
        }
        return BigDecimal.ZERO;
    }
}
