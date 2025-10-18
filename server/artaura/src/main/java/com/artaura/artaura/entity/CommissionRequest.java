package com.artaura.artaura.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "commission_requests")
public class CommissionRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "artist_id", nullable = false)
    private Long artistId;

    @Column(name = "buyer_id", nullable = false)
    private Long buyerId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "phone")
    private String phone;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "artwork_type")
    private String artworkType;

    @Column(name = "style")
    private String style;

    @Column(name = "dimensions")
    private String dimensions;

    @Column(name = "budget")
    private BigDecimal budget;

    @Column(name = "deadline")
    private LocalDate deadline;

    @Column(name = "additional_notes", columnDefinition = "TEXT")
    private String additionalNotes;

    @Column(name = "urgency")
    private String urgency;

    @Column(name = "status", nullable = false)
    private String status = "PENDING";

    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;

    // Default constructor
    public CommissionRequest() {
        this.submittedAt = LocalDateTime.now();
    }

    // Constructor with required fields
    public CommissionRequest(Long artistId, Long buyerId, String name, String email,
            String title, String status) {
        this.artistId = artistId;
        this.buyerId = buyerId;
        this.name = name;
        this.email = email;
        this.title = title;
        this.status = status;
        this.submittedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getArtistId() {
        return artistId;
    }

    public void setArtistId(Long artistId) {
        this.artistId = artistId;
    }

    public Long getBuyerId() {
        return buyerId;
    }

    public void setBuyerId(Long buyerId) {
        this.buyerId = buyerId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getArtworkType() {
        return artworkType;
    }

    public void setArtworkType(String artworkType) {
        this.artworkType = artworkType;
    }

    public String getStyle() {
        return style;
    }

    public void setStyle(String style) {
        this.style = style;
    }

    public String getDimensions() {
        return dimensions;
    }

    public void setDimensions(String dimensions) {
        this.dimensions = dimensions;
    }

    public BigDecimal getBudget() {
        return budget;
    }

    public void setBudget(BigDecimal budget) {
        this.budget = budget;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public String getAdditionalNotes() {
        return additionalNotes;
    }

    public void setAdditionalNotes(String additionalNotes) {
        this.additionalNotes = additionalNotes;
    }

    public String getUrgency() {
        return urgency;
    }

    public void setUrgency(String urgency) {
        this.urgency = urgency;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }
}
