package com.artaura.artaura.dao.buyer;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface BuyerChallengeDAO {
    /**
     * Find all challenges with active status
     * @return List of active challenges
     */
    List<Map<String, Object>> findActiveChallenges();

    /**
     * Find challenge by ID
     * @param id Challenge ID
     * @return Challenge if found
     */
    Optional<Map<String, Object>> findById(Long id);

    /**
     * Find all challenges
     * @return List of all challenges
     */
    List<Map<String, Object>> findAll();

    /**
     * Find challenges by category
     * @param category Challenge category
     * @return List of challenges in the category
     */
    List<Map<String, Object>> findByCategory(String category);

    /**
     * Find challenges by status
     * @param status Challenge status
     * @return List of challenges with the given status
     */
    List<Map<String, Object>> findByStatus(String status);
}
