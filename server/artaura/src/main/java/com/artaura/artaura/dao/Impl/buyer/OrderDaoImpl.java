package com.artaura.artaura.dao.Impl.buyer;
import com.artaura.artaura.dao.buyer.OrderDao;
import com.artaura.artaura.dto.buyer.OrderRequest;
import com.artaura.artaura.dto.buyer.OrderItemRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Repository
public class OrderDaoImpl implements OrderDao {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public Long saveOrder(OrderRequest orderRequest) {
        String orderSql = "INSERT INTO AW_orders (status, order_date, buyer_id, first_name, last_name, email, total_amount, shipping_address, contact_number, payment_method, stripe_payment_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        String shippingAddress = orderRequest.getBillingAddress();
        if (orderRequest.getBillingCity() != null) shippingAddress += ", " + orderRequest.getBillingCity();
        if (orderRequest.getBillingState() != null) shippingAddress += ", " + orderRequest.getBillingState();
        if (orderRequest.getBillingZipCode() != null) shippingAddress += ", " + orderRequest.getBillingZipCode();
        if (orderRequest.getBillingCountry() != null) shippingAddress += ", " + orderRequest.getBillingCountry();
        // Convert ISO date string to MySQL DATETIME format
        String mysqlDateTime = orderRequest.getOrderDate();
        try {
            mysqlDateTime = LocalDateTime.parse(orderRequest.getOrderDate().replace("Z", "").replace("T", " "))
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        } catch (Exception e) {
            // fallback: use current time if parsing fails
            mysqlDateTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        }
        // Use total_amount from DTO for DB insert
        jdbcTemplate.update(orderSql,
            orderRequest.getStatus(),
            mysqlDateTime,
            orderRequest.getBuyerId(),
            orderRequest.getBillingFirstName(),
            orderRequest.getBillingLastName(),
            orderRequest.getBillingEmail(),
            orderRequest.getTotalAmount(), // <-- use total_amount
            shippingAddress,
            orderRequest.getBillingPhone(),
            orderRequest.getPaymentMethod(),
            orderRequest.getStripePaymentId()
        );
        Long orderId = jdbcTemplate.queryForObject("SELECT LAST_INSERT_ID()", Long.class);
        String itemSql = "INSERT INTO AW_order_items (order_id, artwork_id, quantity, price, title, artist_id) VALUES (?, ?, ?, ?, ?, ?)";
        for (OrderItemRequest item : orderRequest.getItems()) {
            jdbcTemplate.update(itemSql,
                orderId,
                item.getArtworkId(), // <-- use getArtworkId() for artwork_id
                item.getQuantity(),
                item.getPrice(),
                item.getTitle(),
                item.getArtistId()
            );
        }
        return orderId;
    }
}
