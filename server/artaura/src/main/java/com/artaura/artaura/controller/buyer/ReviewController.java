package com.artaura.artaura.controller.buyer;

import com.artaura.artaura.dto.buyer.ReviewCreateRequest;
import com.artaura.artaura.dto.buyer.ReviewResponse;
import com.artaura.artaura.service.buyer.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody ReviewCreateRequest request) {
        try {
            ReviewResponse response = reviewService.createReview(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException ex) {
            // Return the actual error message instead of a hardcoded duplicate review message
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ex.getMessage());
        }
    }
}