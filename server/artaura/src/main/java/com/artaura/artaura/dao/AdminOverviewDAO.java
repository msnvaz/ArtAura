package com.artaura.artaura.dao;

import java.util.Map;

public interface AdminOverviewDAO {
    /**
     * Get platform overview statistics including users, payments, and fees
     * @return Map containing all overview statistics
     */
    Map<String, Object> getOverviewStatistics();
    
    /**
     * Get total users count by type
     * @return Map with user counts
     */
    Map<String, Integer> getUserStatistics();
    
    /**
     * Get platform fees and payment statistics
     * @return Map with financial statistics
     */
    Map<String, Object> getFinancialStatistics();
    
    /**
     * Get pending reports and moderation statistics
     * @return Map with pending items count
     */
    Map<String, Integer> getModerationStatistics();
}