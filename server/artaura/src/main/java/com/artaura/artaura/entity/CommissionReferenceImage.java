package com.artaura.artaura.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "commission_reference_images")
public class CommissionReferenceImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "commission_request_id", nullable = false)
    private Long commissionRequestId;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Column(name = "uploaded_at", nullable = false)
    private LocalDateTime uploadedAt;

    // Default constructor
    public CommissionReferenceImage() {
        this.uploadedAt = LocalDateTime.now();
    }

    // Constructor with required fields
    public CommissionReferenceImage(Long commissionRequestId, String imageUrl) {
        this.commissionRequestId = commissionRequestId;
        this.imageUrl = imageUrl;
        this.uploadedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCommissionRequestId() {
        return commissionRequestId;
    }

    public void setCommissionRequestId(Long commissionRequestId) {
        this.commissionRequestId = commissionRequestId;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}
