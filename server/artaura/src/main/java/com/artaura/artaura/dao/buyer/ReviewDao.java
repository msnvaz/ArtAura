package com.artaura.artaura.dao.buyer;

import com.artaura.artaura.dto.buyer.Review;

public interface ReviewDao {
    // Assumes one artist per order, so artistId is at the order level
    boolean existsByArtistBuyerOrder(Long artistId, Long buyerId, Long orderId);
    Long insert(Review review);
    Review findById(Long reviewId);
}
