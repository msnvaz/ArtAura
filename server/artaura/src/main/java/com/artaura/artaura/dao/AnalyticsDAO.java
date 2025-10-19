package com.artaura.artaura.dao;

import com.artaura.artaura.dto.analytics.AnalyticsDTO;
import java.util.List;

public interface AnalyticsDAO {
    
    /**
     * Get metrics summary for a shop
     */
    AnalyticsDTO.MetricsSummary getMetricsSummary(Long shopId, String period);
    
    /**
     * Get sales data points (monthly/weekly aggregation)
     */
    List<AnalyticsDTO.SalesDataPoint> getSalesData(Long shopId, String period);
    
    /**
     * Get top selling products
     */
    List<AnalyticsDTO.TopProduct> getTopProducts(Long shopId, int limit);
    
    /**
     * Get recent orders
     */
    List<AnalyticsDTO.RecentOrder> getRecentOrders(Long shopId, int limit);
}
