package com.artaura.artaura.dto.commission;

import java.util.List;

public class CommissionRequestDTO {

    private Long id;
    private Long artistId;
    private Long buyerId;
    private String name;
    private String email;
    private String phone;
    private String title;
    private String artworkType;
    private String style;
    private String dimensions;
    private String budget; // Changed to String to match buyer's structure
    private String deadline; // Changed to String to match buyer's structure
    private String additionalNotes;
    private String urgency;
    private String status;
    private String submittedAt; // Changed to String to match buyer's structure
    private List<String> referenceImages;

    // Default constructor
    public CommissionRequestDTO() {
    }

    // Constructor with all fields
    public CommissionRequestDTO(Long id, Long artistId, Long buyerId, String name, String email,
            String phone, String title, String artworkType, String style,
            String dimensions, String budget, String deadline,
            String additionalNotes, String urgency, String status,
            String submittedAt, List<String> referenceImages) {
        this.id = id;
        this.artistId = artistId;
        this.buyerId = buyerId;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.title = title;
        this.artworkType = artworkType;
        this.style = style;
        this.dimensions = dimensions;
        this.budget = budget;
        this.deadline = deadline;
        this.additionalNotes = additionalNotes;
        this.urgency = urgency;
        this.status = status;
        this.submittedAt = submittedAt;
        this.referenceImages = referenceImages;
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

    public String getBudget() {
        return budget;
    }

    public void setBudget(String budget) {
        this.budget = budget;
    }

    public String getDeadline() {
        return deadline;
    }

    public void setDeadline(String deadline) {
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

    public String getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(String submittedAt) {
        this.submittedAt = submittedAt;
    }

    public List<String> getReferenceImages() {
        return referenceImages;
    }

    public void setReferenceImages(List<String> referenceImages) {
        this.referenceImages = referenceImages;
    }
}
