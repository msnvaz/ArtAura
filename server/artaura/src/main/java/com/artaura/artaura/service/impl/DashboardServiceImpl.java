package com.artaura.artaura.service.impl;

import com.artaura.artaura.dao.DashboardDAO;
import com.artaura.artaura.dto.dashboard.DashboardStatsDTO;
import com.artaura.artaura.service.DashboardService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DashboardServiceImpl implements DashboardService {

    private static final Logger logger = LoggerFactory.getLogger(DashboardServiceImpl.class);

    @Autowired
    private DashboardDAO dashboardDAO;

    @Override
    public DashboardStatsDTO getDashboardStats(Long shopId) {
        logger.info("Fetching dashboard stats for shop ID: {}", shopId);

        try {
            DashboardStatsDTO stats = dashboardDAO.getDashboardStats(shopId);
            logger.info("Successfully retrieved dashboard stats for shop: {}", shopId);
            return stats;
        } catch (Exception e) {
            logger.error("Error in DashboardService for shop: {}", shopId, e);
            throw new RuntimeException("Failed to fetch dashboard statistics", e);
        }
    }
}
