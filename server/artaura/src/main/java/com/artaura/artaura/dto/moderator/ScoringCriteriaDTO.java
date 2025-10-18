package com.artaura.artaura.dto.moderator;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

/**
 * DTO for challenge scoring criteria
 * Represents the weight percentages for different scoring metrics
 * Total weight should always equal 100%
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ScoringCriteriaDTO {
    private int likesWeight;
    private int commentsWeight;
    private int shareWeight;

    /**
     * Validates that the total weight equals 100%
     * @return true if valid, false otherwise
     */
    public boolean isValid() {
        return (likesWeight + commentsWeight + shareWeight) == 100;
    }

    /**
     * Gets the total weight percentage
     * @return sum of all weights
     */
    public int getTotalWeight() {
        return likesWeight + commentsWeight + shareWeight;
    }
}
