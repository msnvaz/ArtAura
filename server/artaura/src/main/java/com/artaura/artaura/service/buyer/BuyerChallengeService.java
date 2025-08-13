package com.artaura.artaura.service.buyer;

import com.artaura.artaura.dao.buyer.BuyerChallengeDAO;
import com.artaura.artaura.dto.buyer.ChallengeDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class BuyerChallengeService {
    @Autowired
    private BuyerChallengeDAO challengeDAO;

    private String toIsoString(Object value) {
        if (value == null) return null;
        if (value instanceof java.sql.Timestamp) return ((java.sql.Timestamp) value).toInstant().toString();
        if (value instanceof java.time.OffsetDateTime) return ((java.time.OffsetDateTime) value).toString();
        if (value instanceof java.time.LocalDateTime) return ((java.time.LocalDateTime) value).toString();
        if (value instanceof String) return (String) value;
        throw new IllegalArgumentException("Unsupported datetime type: " + value.getClass());
    }

    public List<ChallengeDTO> getActiveChallenges() {
        List<Map<String, Object>> rawList = challengeDAO.findActiveChallenges();
        List<ChallengeDTO> dtoList = new ArrayList<>();
        for (Map<String, Object> row : rawList) {
            ChallengeDTO dto = new ChallengeDTO(
                row.get("id") != null ? ((Number)row.get("id")).longValue() : null,
                (String) row.get("title"),
                (String) row.get("description"),
                (String) row.get("category"),
                toIsoString(row.get("publish_date_time")),
                toIsoString(row.get("deadline_date_time")),
                (String) row.get("status")
            );
            dtoList.add(dto);
        }
        return dtoList;
    }

    public Optional<ChallengeDTO> getChallengeById(Long id) {
        // TODO: Implement logic to fetch challenge by ID
        return Optional.empty(); // Replace with actual DB call
    }

    public List<ChallengeDTO> getAllChallenges() {
        // TODO: Implement logic to fetch all challenges
        return new ArrayList<>(); // Replace with actual DB call
    }

    public List<ChallengeDTO> getChallengesByCategory(String category) {
        // TODO: Implement logic to fetch challenges by category
        return new ArrayList<>(); // Replace with actual DB call
    }

    public List<ChallengeDTO> getChallengesByStatus(String status) {
        // TODO: Implement logic to fetch challenges by status
        return new ArrayList<>(); // Replace with actual DB call
    }
}
