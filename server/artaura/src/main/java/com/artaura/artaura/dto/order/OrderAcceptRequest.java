package com.artaura.artaura.dto.order;

import java.math.BigDecimal;

public class OrderAcceptRequest {

    private Integer estimatedDays;
    private String artistNotes;
    private BigDecimal revisedBudget; // Optional - if artist wants to suggest different budget

    // Default constructor
    public OrderAcceptRequest() {
    }

    // Constructor with all fields
    public OrderAcceptRequest(Integer estimatedDays, String artistNotes, BigDecimal revisedBudget) {
        this.estimatedDays = estimatedDays;
        this.artistNotes = artistNotes;
        this.revisedBudget = revisedBudget;
    }

    // Getters and Setters
    public Integer getEstimatedDays() {
        return estimatedDays;
    }

    public void setEstimatedDays(Integer estimatedDays) {
        this.estimatedDays = estimatedDays;
    }

    public String getArtistNotes() {
        return artistNotes;
    }

    public void setArtistNotes(String artistNotes) {
        this.artistNotes = artistNotes;
    }

    public BigDecimal getRevisedBudget() {
        return revisedBudget;
    }

    public void setRevisedBudget(BigDecimal revisedBudget) {
        this.revisedBudget = revisedBudget;
    }
}
