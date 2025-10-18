package com.artaura.artaura.service.buyer;

import com.artaura.artaura.dao.Impl.buyer.ReviewDaoImpl;
import com.artaura.artaura.dao.buyer.ReviewDao;
import com.artaura.artaura.dto.buyer.ReviewCreateRequest;
import com.artaura.artaura.dto.buyer.ReviewResponse;
import com.artaura.artaura.dto.buyer.Review;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class ReviewService {
    private final ReviewDao reviewDao;

    public ReviewService(ReviewDao reviewDao) {
        this.reviewDao = reviewDao;
    }

    @Transactional
    public ReviewResponse createReview(ReviewCreateRequest request) {
        // Allow multiple reviews for the same order and artist: removed duplicate check
        Review r = new Review();
        r.setArtistId(request.getArtistId());
        r.setBuyerId(request.getBuyerId());
        r.setRating(request.getRating());
        r.setComment(request.getComment());
        r.setOrderId(request.getOrderId());
        r.setCreatedAt(LocalDateTime.now());

        Long id = reviewDao.insert(r);
        r.setReviewId(id);

        return new ReviewResponse(
                r.getReviewId(),
                r.getArtistId(),
                r.getBuyerId(),
                r.getRating(),
                r.getComment(),
                r.getOrderId(),
                r.getCreatedAt()
        );
    }
}
