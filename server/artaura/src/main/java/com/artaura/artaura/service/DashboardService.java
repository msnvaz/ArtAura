package com.artaura.artaura.service;

import com.artaura.artaura.dto.dashboard.DashboardStatsDTO;

public interface DashboardService {

    /**
     * Get dashboard statistics for a specific shop
     * 
     * @param shopId The shop ID
     * @return DashboardStatsDTO containing all statistics
     */
    DashboardStatsDTO getDashboardStats(Long shopId);
}
