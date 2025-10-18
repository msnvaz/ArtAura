package com.artaura.artaura.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {

    // Total Revenue from approved orders
    private BigDecimal totalRevenue;
    private String revenueChange; // e.g., "+12.5%"

    // Products in stock count
    private Integer productsInStock;
    private String stockChange; // e.g., "-3.2%"

    // Monthly orders count (current month)
    private Integer monthlyOrders;
    private String ordersChange; // e.g., "+15.3%"

    // Today's statistics
    private Integer todayOrders;
    private BigDecimal todayRevenue;
    private Integer todayNewCustomers;
}
