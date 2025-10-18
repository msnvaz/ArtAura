package com.artaura.artaura.service;

import com.artaura.artaura.dto.analytics.AnalyticsDTO;

public interface AnalyticsService {
    
    /**
     * Get complete analytics data for a shop
     */
    AnalyticsDTO getAnalytics(Long shopId, String period);
}
