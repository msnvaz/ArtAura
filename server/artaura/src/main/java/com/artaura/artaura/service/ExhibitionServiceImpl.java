package com.artaura.artaura.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.artaura.artaura.dao.ExhibitionDAO;
import com.artaura.artaura.dto.CreateExhibitionDTO;
import com.artaura.artaura.dto.ExhibitionDTO;

@Service
public class ExhibitionServiceImpl implements ExhibitionService {

    @Autowired
    private ExhibitionDAO exhibitionDAO;

    @Override
    public ExhibitionDTO createExhibition(CreateExhibitionDTO createExhibitionDTO, Integer artistId) {
        return exhibitionDAO.createExhibition(createExhibitionDTO, artistId);
    }

    @Override
    public List<ExhibitionDTO> getExhibitionsByArtistId(Integer artistId) {
        return exhibitionDAO.getExhibitionsByArtistId(artistId);
    }

    @Override
    public ExhibitionDTO getExhibitionById(Integer exhibitionId) {
        return exhibitionDAO.getExhibitionById(exhibitionId).orElse(null);
    }

    @Override
    public ExhibitionDTO updateExhibition(Integer exhibitionId, ExhibitionDTO exhibitionDTO) {
        return exhibitionDAO.updateExhibition(exhibitionId, exhibitionDTO);
    }

    @Override
    public boolean deleteExhibition(Integer exhibitionId) {
        return exhibitionDAO.deleteExhibition(exhibitionId);
    }

    @Override
    public List<ExhibitionDTO> getExhibitionsByStatus(String status) {
        return exhibitionDAO.getExhibitionsByStatus(status);
    }

    @Override
    public List<ExhibitionDTO> getFeaturedExhibitions() {
        return exhibitionDAO.getFeaturedExhibitions();
    }

    @Override
    public Map<String, Object> getExhibitionStatistics(Integer artistId) {
        // Get basic statistics from DAO
        List<ExhibitionDTO> exhibitions = exhibitionDAO.getExhibitionsByArtistId(artistId);

        Map<String, Object> statistics = new HashMap<>();
        statistics.put("totalExhibitions", exhibitions.size());

        // Count exhibitions by status
        long upcomingCount = exhibitions.stream()
                .filter(e -> "upcoming".equalsIgnoreCase(e.getStatus()))
                .count();
        long ongoingCount = exhibitions.stream()
                .filter(e -> "ongoing".equalsIgnoreCase(e.getStatus()))
                .count();
        long completedCount = exhibitions.stream()
                .filter(e -> "completed".equalsIgnoreCase(e.getStatus()))
                .count();

        statistics.put("upcomingExhibitions", upcomingCount);
        statistics.put("ongoingExhibitions", ongoingCount);
        statistics.put("completedExhibitions", completedCount);

        // Calculate total visitors and artworks
        int totalVisitors = exhibitions.stream()
                .mapToInt(e -> e.getTotalVisitors() != null ? e.getTotalVisitors() : 0)
                .sum();
        int totalArtworks = exhibitions.stream()
                .mapToInt(e -> e.getArtworksCount() != null ? e.getArtworksCount() : 0)
                .sum();

        statistics.put("totalVisitors", totalVisitors);
        statistics.put("totalArtworks", totalArtworks);

        return statistics;
    }

    @Override
    public List<ExhibitionDTO> getAllExhibitions() {
        return exhibitionDAO.getAllExhibitions();
    }

    @Override
    public boolean updateExhibitionStatus(Integer exhibitionId, String status, String reason) {
        return exhibitionDAO.updateExhibitionStatus(exhibitionId, status, reason);
    }
}
