package com.artaura.artaura.dao.Impl;

import com.artaura.artaura.dao.AdminOverviewDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Repository
public class AdminOverviewDAOImpl implements AdminOverviewDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public Map<String, Object> getOverviewStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        try {
            // Get user statistics
            Map<String, Integer> userStats = getUserStatistics();
            stats.putAll(userStats);
            
            // Get financial statistics
            Map<String, Object> financialStats = getFinancialStatistics();
            stats.putAll(financialStats);
            
            // Get moderation statistics
            Map<String, Integer> moderationStats = getModerationStatistics();
            stats.putAll(moderationStats);
            
        } catch (Exception e) {
            // Return default values if queries fail
            stats.put("totalUsers", 0);
            stats.put("totalArtists", 0);
            stats.put("activeArtists", 0);
            stats.put("totalBuyers", 0);
            stats.put("totalModerators", 0);
            stats.put("totalRevenue", BigDecimal.ZERO);
            stats.put("platformFees", BigDecimal.ZERO);
            stats.put("pendingVerifications", 0);
            stats.put("pendingShops", 0);
        }
        
        return stats;
    }

    @Override
    public Map<String, Integer> getUserStatistics() {
        Map<String, Integer> userStats = new HashMap<>();
        
        try {
            // Count all artists
            String artistQuery = "SELECT COUNT(*) FROM artists";
            Integer totalArtists = jdbcTemplate.queryForObject(artistQuery, Integer.class);
            userStats.put("totalArtists", totalArtists != null ? totalArtists : 0);
            
            // Count active artists
            String activeArtistsQuery = "SELECT COUNT(*) FROM artists WHERE status = 'Active'";
            Integer activeArtists = jdbcTemplate.queryForObject(activeArtistsQuery, Integer.class);
            userStats.put("activeArtists", activeArtists != null ? activeArtists : 0);
            
            // Count all buyers
            String buyersQuery = "SELECT COUNT(*) FROM buyers";
            Integer totalBuyers = jdbcTemplate.queryForObject(buyersQuery, Integer.class);
            userStats.put("totalBuyers", totalBuyers != null ? totalBuyers : 0);
            
            // Count all moderators
            String moderatorsQuery = "SELECT COUNT(*) FROM moderators";
            Integer totalModerators = jdbcTemplate.queryForObject(moderatorsQuery, Integer.class);
            userStats.put("totalModerators", totalModerators != null ? totalModerators : 0);

            // Count all shops
            Integer totalShops = 0;
            try {
                String shopsQuery = "SELECT COUNT(*) FROM shops";
                totalShops = jdbcTemplate.queryForObject(shopsQuery, Integer.class);
                userStats.put("totalShops", totalShops != null ? totalShops : 0);
            } catch (Exception e) {
                // Handle case where shops table might not exist or query fails
                userStats.put("totalShops", 0);
            }

            // Calculate total users (all artists + all buyers + all moderators)
            int totalUsers = userStats.get("totalArtists") + userStats.get("totalBuyers") + userStats.get("totalModerators") + userStats.get("totalShops");
            userStats.put("totalUsers", totalUsers);
            
            // Debug logging
            System.out.println("Artists: " + userStats.get("totalArtists"));
            System.out.println("Buyers: " + userStats.get("totalBuyers")); 
            System.out.println("Moderators: " + userStats.get("totalModerators"));
            System.out.println("Total Users: " + totalUsers);
            
        } catch (Exception e) {
            userStats.put("totalUsers", 0);
            userStats.put("totalArtists", 0);
            userStats.put("activeArtists", 0);
            userStats.put("totalBuyers", 0);
            userStats.put("totalModerators", 0);
            userStats.put("totalShops", 0);
        }
        
        return userStats;
    }

    @Override
    public Map<String, Object> getFinancialStatistics() {
        Map<String, Object> financialStats = new HashMap<>();
        
        try {
            // Calculate total revenue from paid transactions
            String revenueQuery = """
                SELECT COALESCE(SUM(amount), 0) as total_revenue
                FROM payment 
                WHERE status = 'paid'
                """;
            BigDecimal totalRevenue = jdbcTemplate.queryForObject(revenueQuery, BigDecimal.class);
            financialStats.put("totalRevenue", totalRevenue != null ? totalRevenue : BigDecimal.ZERO);
            
            // Calculate total platform fees - sum ALL fee_amount from platform_fees table
            String platformFeesQuery = """
                SELECT COALESCE(SUM(fee_amount), 0) as total_platform_fees
                FROM platform_fees
                """;
            BigDecimal platformFees = jdbcTemplate.queryForObject(platformFeesQuery, BigDecimal.class);
            financialStats.put("platformFees", platformFees != null ? platformFees : BigDecimal.ZERO);
            
            // Debug log to see what we're getting
            System.out.println("Platform Fees Query Result: " + platformFees);
            
            // Count total transactions
            String transactionsQuery = "SELECT COUNT(*) FROM payment";
            Integer totalTransactions = jdbcTemplate.queryForObject(transactionsQuery, Integer.class);
            financialStats.put("totalTransactions", totalTransactions != null ? totalTransactions : 0);
            
            // Count pending payments (escrow)
            String pendingPaymentsQuery = "SELECT COUNT(*) FROM payment WHERE status = 'escrow'";
            Integer pendingPayments = jdbcTemplate.queryForObject(pendingPaymentsQuery, Integer.class);
            financialStats.put("pendingPayments", pendingPayments != null ? pendingPayments : 0);
            
        } catch (Exception e) {
            System.out.println("Error in getFinancialStatistics: " + e.getMessage());
            financialStats.put("totalRevenue", BigDecimal.ZERO);
            financialStats.put("platformFees", BigDecimal.ZERO);
            financialStats.put("totalTransactions", 0);
            financialStats.put("pendingPayments", 0);
        }
        
        return financialStats;
    }

    @Override
    public Map<String, Integer> getModerationStatistics() {
        Map<String, Integer> moderationStats = new HashMap<>();
        
        try {
            // Count pending artist verifications
            String pendingArtistsQuery = "SELECT COUNT(*) FROM artists WHERE status = 'Pending'";
            Integer pendingArtists = jdbcTemplate.queryForObject(pendingArtistsQuery, Integer.class);
            
            // Count pending shop verifications (if shops table exists)
            Integer pendingShops = 0;
            try {
                String pendingShopsQuery = "SELECT COUNT(*) FROM shops WHERE status = 'Pending'";
                pendingShops = jdbcTemplate.queryForObject(pendingShopsQuery, Integer.class);
            } catch (Exception e) {
                // Table might not exist, ignore
            }
            
            moderationStats.put("pendingVerifications", pendingArtists != null ? pendingArtists : 0);
            moderationStats.put("pendingShops", pendingShops);
            
        } catch (Exception e) {
            moderationStats.put("pendingVerifications", 0);
            moderationStats.put("pendingShops", 0);
        }
        
        return moderationStats;
    }
}