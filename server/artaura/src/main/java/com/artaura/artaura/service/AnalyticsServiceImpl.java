package com.artaura.artaura.service;

import com.artaura.artaura.dao.AnalyticsDAO;
import com.artaura.artaura.dto.analytics.AnalyticsDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    private static final Logger logger = LoggerFactory.getLogger(AnalyticsServiceImpl.class);

    @Autowired
    private AnalyticsDAO analyticsDAO;

    @Override
    public AnalyticsDTO getAnalytics(Long shopId, String period) {
        logger.info("Fetching analytics for shop: {} with period: {}", shopId, period);
        
        AnalyticsDTO analytics = new AnalyticsDTO();
        
        try {
            // Get metrics summary
            AnalyticsDTO.MetricsSummary metricsSummary = analyticsDAO.getMetricsSummary(shopId, period);
            analytics.setMetricsSummary(metricsSummary);
            
            // Get sales data
            List<AnalyticsDTO.SalesDataPoint> salesData = analyticsDAO.getSalesData(shopId, period);
            analytics.setSalesData(salesData);
            
            // Get top products (top 5)
            List<AnalyticsDTO.TopProduct> topProducts = analyticsDAO.getTopProducts(shopId, 5);
            analytics.setTopProducts(topProducts);
            
            // Get recent orders (last 10)
            List<AnalyticsDTO.RecentOrder> recentOrders = analyticsDAO.getRecentOrders(shopId, 10);
            analytics.setRecentOrders(recentOrders);
            
            logger.info("Successfully fetched analytics for shop: {}", shopId);
            
        } catch (Exception e) {
            logger.error("Error fetching analytics for shop: {}", shopId, e);
            throw new RuntimeException("Failed to fetch analytics data", e);
        }
        
        return analytics;
    }
}
