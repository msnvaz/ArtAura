package com.artaura.artaura.service;

import com.artaura.artaura.dao.AdminOverviewDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AdminOverviewService {

    @Autowired
    private AdminOverviewDAO adminOverviewDAO;

    /**
     * Get comprehensive overview statistics for admin dashboard
     * @return Map containing all overview statistics
     */
    public Map<String, Object> getOverviewStatistics() {
        return adminOverviewDAO.getOverviewStatistics();
    }

    /**
     * Get user statistics breakdown
     * @return Map with user counts by type
     */
    public Map<String, Integer> getUserStatistics() {
        return adminOverviewDAO.getUserStatistics();
    }

    /**
     * Get financial statistics including platform fees
     * @return Map with financial data
     */
    public Map<String, Object> getFinancialStatistics() {
        return adminOverviewDAO.getFinancialStatistics();
    }

    /**
     * Get moderation statistics
     * @return Map with pending items count
     */
    public Map<String, Integer> getModerationStatistics() {
        return adminOverviewDAO.getModerationStatistics();
    }
}