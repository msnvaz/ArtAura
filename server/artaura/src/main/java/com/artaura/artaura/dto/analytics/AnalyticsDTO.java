package com.artaura.artaura.dto.analytics;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class AnalyticsDTO {
    private MetricsSummary metricsSummary;
    private List<SalesDataPoint> salesData;
    private List<TopProduct> topProducts;
    private List<RecentOrder> recentOrders;

    @Data
    public static class MetricsSummary {
        private BigDecimal totalRevenue;
        private Integer totalOrders;
        private Integer totalCustomers;
        private BigDecimal avgOrderValue;
        private String revenueChange;
        private String ordersChange;
        private String customersChange;
        private String avgOrderValueChange;
    }

    @Data
    public static class SalesDataPoint {
        private String month;
        private BigDecimal revenue;
        private Integer orders;
        private Integer customers;
    }

    @Data
    public static class TopProduct {
        private Long id;
        private String name;
        private Integer sales;
        private BigDecimal revenue;
        private Double growth;
        private String category;
    }

    @Data
    public static class RecentOrder {
        private String id;
        private String customer;
        private BigDecimal amount;
        private String status;
        private String date;
        private Integer items;
    }
}
