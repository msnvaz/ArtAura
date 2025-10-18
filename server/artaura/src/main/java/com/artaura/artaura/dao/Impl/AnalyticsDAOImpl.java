package com.artaura.artaura.dao.Impl;

import com.artaura.artaura.dao.AnalyticsDAO;
import com.artaura.artaura.dto.analytics.AnalyticsDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Repository
public class AnalyticsDAOImpl implements AnalyticsDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public AnalyticsDTO.MetricsSummary getMetricsSummary(Long shopId, String period) {
        String dateCondition = getDateCondition(period);

        String sql = "SELECT " +
                "COALESCE(SUM(total), 0) as totalRevenue, " +
                "COUNT(*) as totalOrders, " +
                "COUNT(DISTINCT artist_id) as totalCustomers, " +
                "COALESCE(AVG(total), 0) as avgOrderValue " +
                "FROM shop_orders " +
                "WHERE shop_id = ? AND status = 'approved' " + dateCondition;

        System.out.println("===== ANALYTICS DEBUG =====");
        System.out.println("SQL Query: " + sql);
        System.out.println("Shop ID: " + shopId);
        System.out.println("Period: " + period);

        try {
            AnalyticsDTO.MetricsSummary summary = jdbcTemplate.queryForObject(sql,
                    (rs, rowNum) -> {
                        AnalyticsDTO.MetricsSummary s = new AnalyticsDTO.MetricsSummary();
                        s.setTotalRevenue(rs.getBigDecimal("totalRevenue"));
                        s.setTotalOrders(rs.getInt("totalOrders"));
                        s.setTotalCustomers(rs.getInt("totalCustomers"));
                        s.setAvgOrderValue(rs.getBigDecimal("avgOrderValue"));

                        System.out.println("RESULTS FROM DATABASE:");
                        System.out.println("  Total Revenue: " + s.getTotalRevenue());
                        System.out.println("  Total Orders: " + s.getTotalOrders());
                        System.out.println("  Total Customers: " + s.getTotalCustomers());
                        System.out.println("  Avg Order Value: " + s.getAvgOrderValue());

                        return s;
                    }, shopId);

            // Calculate percentage changes (comparing with previous period)
            if (summary != null) {
                calculateChanges(summary, shopId, period);
            }

            System.out.println("===== END ANALYTICS DEBUG =====");
            return summary;
        } catch (Exception e) {
            System.err.println("ERROR in getMetricsSummary: " + e.getMessage());
            e.printStackTrace();

            // Return empty summary if no data
            AnalyticsDTO.MetricsSummary emptySummary = new AnalyticsDTO.MetricsSummary();
            emptySummary.setTotalRevenue(BigDecimal.ZERO);
            emptySummary.setTotalOrders(0);
            emptySummary.setTotalCustomers(0);
            emptySummary.setAvgOrderValue(BigDecimal.ZERO);
            emptySummary.setRevenueChange("0.0%");
            emptySummary.setOrdersChange("0.0%");
            emptySummary.setCustomersChange("0.0%");
            emptySummary.setAvgOrderValueChange("0.0%");

            System.out.println("Returning empty summary due to error");
            return emptySummary;
        }
    }

    @Override
    public List<AnalyticsDTO.SalesDataPoint> getSalesData(Long shopId, String period) {
        String sql;

        if (period.equals("12months")) {
            // Get monthly data for last 12 months
            sql = "SELECT " +
                    "DATE_FORMAT(date, '%b') as month, " +
                    "COALESCE(SUM(total), 0) as revenue, " +
                    "COUNT(*) as orders, " +
                    "COUNT(DISTINCT artist_id) as customers " +
                    "FROM shop_orders " +
                    "WHERE shop_id = ? AND status = 'approved' " +
                    "AND date >= DATE_SUB(NOW(), INTERVAL 12 MONTH) " +
                    "GROUP BY MONTH(date), DATE_FORMAT(date, '%b') " +
                    "ORDER BY MONTH(date)";
        } else {
            // Get data for last 6 months by default
            sql = "SELECT " +
                    "DATE_FORMAT(date, '%b') as month, " +
                    "COALESCE(SUM(total), 0) as revenue, " +
                    "COUNT(*) as orders, " +
                    "COUNT(DISTINCT artist_id) as customers " +
                    "FROM shop_orders " +
                    "WHERE shop_id = ? AND status = 'approved' " +
                    "AND date >= DATE_SUB(NOW(), INTERVAL 6 MONTH) " +
                    "GROUP BY MONTH(date), DATE_FORMAT(date, '%b') " +
                    "ORDER BY MONTH(date)";
        }

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            AnalyticsDTO.SalesDataPoint dataPoint = new AnalyticsDTO.SalesDataPoint();
            dataPoint.setMonth(rs.getString("month"));
            dataPoint.setRevenue(rs.getBigDecimal("revenue"));
            dataPoint.setOrders(rs.getInt("orders"));
            dataPoint.setCustomers(rs.getInt("customers"));
            return dataPoint;
        }, shopId);
    }

    @Override
    public List<AnalyticsDTO.TopProduct> getTopProducts(Long shopId, int limit) {
        String sql = "SELECT " +
                "p.id, " +
                "p.name, " +
                "p.category, " +
                "COALESCE(p.sales, 0) as sales, " +
                "COALESCE(p.sales * p.price, 0) as revenue " +
                "FROM products p " +
                "WHERE p.shop_id = ? " +
                "ORDER BY p.sales DESC, revenue DESC " +
                "LIMIT ?";

        List<AnalyticsDTO.TopProduct> products = jdbcTemplate.query(sql,
                (rs, rowNum) -> {
                    AnalyticsDTO.TopProduct product = new AnalyticsDTO.TopProduct();
                    product.setId(rs.getLong("id"));
                    product.setName(rs.getString("name"));
                    product.setCategory(rs.getString("category"));
                    product.setSales(rs.getInt("sales"));
                    product.setRevenue(rs.getBigDecimal("revenue"));
                    return product;
                }, shopId, limit);

        // Calculate growth for each product (comparing last 30 days with previous 30
        // days)
        for (AnalyticsDTO.TopProduct product : products) {
            Double growth = calculateProductGrowth(product.getId());
            product.setGrowth(growth);
        }

        return products;
    }

    @Override
    public List<AnalyticsDTO.RecentOrder> getRecentOrders(Long shopId, int limit) {
        String sql = "SELECT " +
                "order_id, " +
                "artist_id, " +
                "total, " +
                "status, " +
                "date, " +
                "items " +
                "FROM shop_orders " +
                "WHERE shop_id = ? " +
                "ORDER BY date DESC " +
                "LIMIT ?";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            AnalyticsDTO.RecentOrder order = new AnalyticsDTO.RecentOrder();
            order.setId(String.valueOf(rs.getLong("order_id")));
            order.setCustomer("Artist #" + rs.getLong("artist_id"));
            order.setAmount(rs.getBigDecimal("total"));
            order.setStatus(rs.getString("status"));

            // Format date
            LocalDateTime orderDate = rs.getTimestamp("date").toLocalDateTime();
            order.setDate(orderDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));

            // Count items from items JSON
            String orderItems = rs.getString("items");
            int itemCount = countItemsInJson(orderItems);
            order.setItems(itemCount);

            return order;
        }, shopId, limit);
    }

    // Helper methods

    private String getDateCondition(String period) {
        switch (period) {
            case "7days":
                return "AND date >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
            case "30days":
                return "AND date >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
            case "90days":
                return "AND date >= DATE_SUB(NOW(), INTERVAL 90 DAY)";
            case "12months":
                return "AND date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)";
            default:
                return "AND date >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
        }
    }

    private void calculateChanges(AnalyticsDTO.MetricsSummary summary, Long shopId, String period) {
        try {
            // Get previous period data for comparison
            String previousDateCondition = getPreviousDateCondition(period);

            String sql = "SELECT " +
                    "COALESCE(SUM(total), 0) as prevRevenue, " +
                    "COUNT(*) as prevOrders, " +
                    "COUNT(DISTINCT artist_id) as prevCustomers, " +
                    "COALESCE(AVG(total), 0) as prevAvgOrderValue " +
                    "FROM shop_orders " +
                    "WHERE shop_id = ? AND status = 'approved' " + previousDateCondition;

            jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
                BigDecimal prevRevenue = rs.getBigDecimal("prevRevenue");
                Integer prevOrders = rs.getInt("prevOrders");
                Integer prevCustomers = rs.getInt("prevCustomers");
                BigDecimal prevAvgOrderValue = rs.getBigDecimal("prevAvgOrderValue");

                // Calculate percentage changes
                summary.setRevenueChange(calculatePercentageChange(prevRevenue, summary.getTotalRevenue()));
                summary.setOrdersChange(calculatePercentageChange(prevOrders, summary.getTotalOrders()));
                summary.setCustomersChange(calculatePercentageChange(prevCustomers, summary.getTotalCustomers()));
                summary.setAvgOrderValueChange(
                        calculatePercentageChange(prevAvgOrderValue, summary.getAvgOrderValue()));

                return null;
            }, shopId);
        } catch (Exception e) {
            // If there's no previous period data, set changes to 0
            summary.setRevenueChange("0.0%");
            summary.setOrdersChange("0.0%");
            summary.setCustomersChange("0.0%");
            summary.setAvgOrderValueChange("0.0%");
        }
    }

    private String getPreviousDateCondition(String period) {
        switch (period) {
            case "7days":
                return "AND date >= DATE_SUB(NOW(), INTERVAL 14 DAY) AND date < DATE_SUB(NOW(), INTERVAL 7 DAY)";
            case "30days":
                return "AND date >= DATE_SUB(NOW(), INTERVAL 60 DAY) AND date < DATE_SUB(NOW(), INTERVAL 30 DAY)";
            case "90days":
                return "AND date >= DATE_SUB(NOW(), INTERVAL 180 DAY) AND date < DATE_SUB(NOW(), INTERVAL 90 DAY)";
            case "12months":
                return "AND date >= DATE_SUB(NOW(), INTERVAL 24 MONTH) AND date < DATE_SUB(NOW(), INTERVAL 12 MONTH)";
            default:
                return "AND date >= DATE_SUB(NOW(), INTERVAL 60 DAY) AND date < DATE_SUB(NOW(), INTERVAL 30 DAY)";
        }
    }

    private String calculatePercentageChange(Number oldValue, Number newValue) {
        double oldVal = oldValue.doubleValue();
        double newVal = newValue.doubleValue();

        if (oldVal == 0) {
            return newVal > 0 ? "+100.0%" : "0.0%";
        }

        double change = ((newVal - oldVal) / oldVal) * 100;
        return String.format("%+.1f%%", change);
    }

    private Double calculateProductGrowth(Long productId) {
        try {
            // Compare sales from last 30 days with previous 30 days
            String sql = "SELECT " +
                    "COALESCE(SUM(CASE WHEN date >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END), 0) as currentSales, "
                    +
                    "COALESCE(SUM(CASE WHEN date >= DATE_SUB(NOW(), INTERVAL 60 DAY) AND date < DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END), 0) as previousSales "
                    +
                    "FROM shop_orders " +
                    "WHERE order_items LIKE CONCAT('%\"productId\":', ?, '%')";

            return jdbcTemplate.queryForObject(sql, (rs, rowNum) -> {
                int currentSales = rs.getInt("currentSales");
                int previousSales = rs.getInt("previousSales");

                if (previousSales == 0) {
                    return currentSales > 0 ? 100.0 : 0.0;
                }

                return ((double) (currentSales - previousSales) / previousSales) * 100;
            }, productId);
        } catch (Exception e) {
            return 0.0; // Return 0% growth if there's an error
        }
    }

    private int countItemsInJson(String orderItems) {
        if (orderItems == null || orderItems.isEmpty()) {
            return 0;
        }

        // Simple JSON array item count by counting "productId" occurrences
        int count = 0;
        int index = 0;
        while ((index = orderItems.indexOf("\"productId\"", index)) != -1) {
            count++;
            index++;
        }
        return count;
    }
}
