package com.artaura.artaura.dao;

import com.artaura.artaura.dto.dashboard.DashboardStatsDTO;

public interface DashboardDAO {

    /**
     * Get dashboard statistics for a specific shop
     * 
     * @param shopId The shop ID
     * @return DashboardStatsDTO containing all statistics
     */
    DashboardStatsDTO getDashboardStats(Long shopId);

    /**
     * Get total revenue from approved orders
     * 
     * @param shopId The shop ID
     * @return Total revenue
     */
    java.math.BigDecimal getTotalRevenue(Long shopId);

    /**
     * Get monthly orders count for current month
     * 
     * @param shopId The shop ID
     * @return Number of orders in current month
     */
    Integer getMonthlyOrdersCount(Long shopId);

    /**
     * Get products in stock count
     * 
     * @param shopId The shop ID
     * @return Number of products in stock
     */
    Integer getProductsInStockCount(Long shopId);

    /**
     * Get today's orders count
     * 
     * @param shopId The shop ID
     * @return Number of orders today
     */
    Integer getTodayOrdersCount(Long shopId);

    /**
     * Get today's revenue
     * 
     * @param shopId The shop ID
     * @return Revenue for today
     */
    java.math.BigDecimal getTodayRevenue(Long shopId);

    /**
     * Get today's new customers count
     * 
     * @param shopId The shop ID
     * @return Number of new customers today
     */
    Integer getTodayNewCustomersCount(Long shopId);
}
