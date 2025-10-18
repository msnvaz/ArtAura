package com.artaura.artaura.dao.impl;

import com.artaura.artaura.dao.DashboardDAO;
import com.artaura.artaura.dto.dashboard.DashboardStatsDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Repository
public class DashboardDAOImpl implements DashboardDAO {

    private static final Logger logger = LoggerFactory.getLogger(DashboardDAOImpl.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public DashboardStatsDTO getDashboardStats(Long shopId) {
        logger.info("===== DASHBOARD STATS DEBUG =====");
        logger.info("Fetching dashboard stats for shop ID: {}", shopId);

        DashboardStatsDTO stats = new DashboardStatsDTO();

        try {
            // Get total revenue
            BigDecimal totalRevenue = getTotalRevenue(shopId);
            stats.setTotalRevenue(totalRevenue);
            logger.info("Total Revenue: {}", totalRevenue);

            // Calculate revenue change (comparing this month to last month)
            String revenueChange = calculateRevenueChange(shopId);
            stats.setRevenueChange(revenueChange);
            logger.info("Revenue Change: {}", revenueChange);

            // Get products in stock
            Integer productsInStock = getProductsInStockCount(shopId);
            stats.setProductsInStock(productsInStock);
            logger.info("Products in Stock: {}", productsInStock);

            // Calculate stock change (placeholder for now)
            stats.setStockChange("+0.0%");

            // Get monthly orders count
            Integer monthlyOrders = getMonthlyOrdersCount(shopId);
            stats.setMonthlyOrders(monthlyOrders);
            logger.info("Monthly Orders: {}", monthlyOrders);

            // Calculate orders change (comparing this month to last month)
            String ordersChange = calculateOrdersChange(shopId);
            stats.setOrdersChange(ordersChange);
            logger.info("Orders Change: {}", ordersChange);

            // Get today's statistics
            Integer todayOrders = getTodayOrdersCount(shopId);
            stats.setTodayOrders(todayOrders);
            logger.info("Today's Orders: {}", todayOrders);

            BigDecimal todayRevenue = getTodayRevenue(shopId);
            stats.setTodayRevenue(todayRevenue);
            logger.info("Today's Revenue: {}", todayRevenue);

            Integer todayNewCustomers = getTodayNewCustomersCount(shopId);
            stats.setTodayNewCustomers(todayNewCustomers);
            logger.info("Today's New Customers: {}", todayNewCustomers);

            logger.info("===== DASHBOARD STATS COMPLETE =====");

        } catch (Exception e) {
            logger.error("Error fetching dashboard stats for shop: {}", shopId, e);
            e.printStackTrace();
            throw e;
        }

        return stats;
    }

    @Override
    public BigDecimal getTotalRevenue(Long shopId) {
        String sql = "SELECT COALESCE(SUM(total), 0) " +
                "FROM shop_orders " +
                "WHERE shop_id = ? AND status = 'approved'";

        logger.debug("Executing SQL for total revenue: {}", sql);
        logger.debug("Parameters: shopId={}", shopId);

        BigDecimal revenue = jdbcTemplate.queryForObject(sql, BigDecimal.class, shopId);
        return revenue != null ? revenue : BigDecimal.ZERO;
    }

    @Override
    public Integer getMonthlyOrdersCount(Long shopId) {
        String sql = "SELECT COUNT(*) " +
                "FROM shop_orders " +
                "WHERE shop_id = ? " +
                "AND status = 'approved' " +
                "AND YEAR(date) = YEAR(CURDATE()) " +
                "AND MONTH(date) = MONTH(CURDATE())";

        logger.debug("Executing SQL for monthly orders: {}", sql);
        logger.debug("Parameters: shopId={}", shopId);

        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, shopId);
        return count != null ? count : 0;
    }

    @Override
    public Integer getProductsInStockCount(Long shopId) {
        String sql = "SELECT COUNT(*) " +
                "FROM products " +
                "WHERE shop_id = ? AND stock > 0";

        logger.debug("Executing SQL for products in stock: {}", sql);
        logger.debug("Parameters: shopId={}", shopId);

        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, shopId);
        return count != null ? count : 0;
    }

    @Override
    public Integer getTodayOrdersCount(Long shopId) {
        String sql = "SELECT COUNT(*) " +
                "FROM shop_orders " +
                "WHERE shop_id = ? " +
                "AND status = 'approved' " +
                "AND DATE(date) = CURDATE()";

        logger.debug("Executing SQL for today's orders: {}", sql);

        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, shopId);
        return count != null ? count : 0;
    }

    @Override
    public BigDecimal getTodayRevenue(Long shopId) {
        String sql = "SELECT COALESCE(SUM(total), 0) " +
                "FROM shop_orders " +
                "WHERE shop_id = ? " +
                "AND status = 'approved' " +
                "AND DATE(date) = CURDATE()";

        logger.debug("Executing SQL for today's revenue: {}", sql);

        BigDecimal revenue = jdbcTemplate.queryForObject(sql, BigDecimal.class, shopId);
        return revenue != null ? revenue : BigDecimal.ZERO;
    }

    @Override
    public Integer getTodayNewCustomersCount(Long shopId) {
        String sql = "SELECT COUNT(DISTINCT artist_id) " +
                "FROM shop_orders " +
                "WHERE shop_id = ? " +
                "AND DATE(date) = CURDATE()";

        logger.debug("Executing SQL for today's new customers: {}", sql);

        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, shopId);
        return count != null ? count : 0;
    }

    /**
     * Calculate revenue change percentage (this month vs last month)
     */
    private String calculateRevenueChange(Long shopId) {
        try {
            // Current month revenue
            String currentMonthSql = "SELECT COALESCE(SUM(total), 0) " +
                    "FROM shop_orders " +
                    "WHERE shop_id = ? " +
                    "AND status = 'approved' " +
                    "AND YEAR(date) = YEAR(CURDATE()) " +
                    "AND MONTH(date) = MONTH(CURDATE())";

            BigDecimal currentMonth = jdbcTemplate.queryForObject(currentMonthSql, BigDecimal.class, shopId);
            currentMonth = currentMonth != null ? currentMonth : BigDecimal.ZERO;

            // Last month revenue
            String lastMonthSql = "SELECT COALESCE(SUM(total), 0) " +
                    "FROM shop_orders " +
                    "WHERE shop_id = ? " +
                    "AND status = 'approved' " +
                    "AND YEAR(date) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) " +
                    "AND MONTH(date) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))";

            BigDecimal lastMonth = jdbcTemplate.queryForObject(lastMonthSql, BigDecimal.class, shopId);
            lastMonth = lastMonth != null ? lastMonth : BigDecimal.ZERO;

            // Calculate percentage change
            if (lastMonth.compareTo(BigDecimal.ZERO) == 0) {
                if (currentMonth.compareTo(BigDecimal.ZERO) > 0) {
                    return "+100.0%";
                }
                return "0.0%";
            }

            BigDecimal change = currentMonth.subtract(lastMonth)
                    .divide(lastMonth, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));

            return (change.compareTo(BigDecimal.ZERO) >= 0 ? "+" : "") +
                    change.setScale(1, RoundingMode.HALF_UP) + "%";

        } catch (Exception e) {
            logger.error("Error calculating revenue change", e);
            return "0.0%";
        }
    }

    /**
     * Calculate orders change percentage (this month vs last month)
     */
    private String calculateOrdersChange(Long shopId) {
        try {
            // Current month orders
            String currentMonthSql = "SELECT COUNT(*) " +
                    "FROM shop_orders " +
                    "WHERE shop_id = ? " +
                    "AND status = 'approved' " +
                    "AND YEAR(date) = YEAR(CURDATE()) " +
                    "AND MONTH(date) = MONTH(CURDATE())";

            Integer currentMonth = jdbcTemplate.queryForObject(currentMonthSql, Integer.class, shopId);
            currentMonth = currentMonth != null ? currentMonth : 0;

            // Last month orders
            String lastMonthSql = "SELECT COUNT(*) " +
                    "FROM shop_orders " +
                    "WHERE shop_id = ? " +
                    "AND status = 'approved' " +
                    "AND YEAR(date) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH)) " +
                    "AND MONTH(date) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))";

            Integer lastMonth = jdbcTemplate.queryForObject(lastMonthSql, Integer.class, shopId);
            lastMonth = lastMonth != null ? lastMonth : 0;

            // Calculate percentage change
            if (lastMonth == 0) {
                if (currentMonth > 0) {
                    return "+100.0%";
                }
                return "0.0%";
            }

            double change = ((double) (currentMonth - lastMonth) / lastMonth) * 100;

            return (change >= 0 ? "+" : "") + String.format("%.1f", change) + "%";

        } catch (Exception e) {
            logger.error("Error calculating orders change", e);
            return "0.0%";
        }
    }
}
