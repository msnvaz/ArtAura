package com.artaura.artaura.dao.Impl.buyer;
import com.artaura.artaura.dao.buyer.OrderDao;
import com.artaura.artaura.dto.buyer.AWOrderDto;
import com.artaura.artaura.dto.buyer.AWOrderItemDto;
import com.artaura.artaura.dto.buyer.OrderRequest;
import com.artaura.artaura.dto.buyer.OrderItemRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Repository
public class OrderDaoImpl implements OrderDao {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    @Transactional
    public Long saveOrder(OrderRequest orderRequest) {
        String orderSql = "INSERT INTO AW_orders (order_date, buyer_id, first_name, last_name, email, shipping_address, contact_number, payment_method, stripe_payment_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
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
        
        // Insert order without total_amount
        jdbcTemplate.update(orderSql,
                mysqlDateTime,
                orderRequest.getBuyerId(),
                orderRequest.getBillingFirstName(),
                orderRequest.getBillingLastName(),
                orderRequest.getBillingEmail(),
                shippingAddress,
                orderRequest.getBillingPhone(),
                orderRequest.getPaymentMethod(),
                orderRequest.getStripePaymentId()
        );
        Long orderId = jdbcTemplate.queryForObject("SELECT LAST_INSERT_ID()", Long.class);

        // Insert order items and update artwork status to "Sold"
        String itemSql = "INSERT INTO AW_order_items (order_id, artwork_id, quantity, price, title, artist_id) VALUES (?, ?, ?, ?, ?, ?)";
        String updateArtworkStatusSql = "UPDATE artworks SET status = 'Sold', updated_at = CURRENT_TIMESTAMP WHERE artwork_id = ?";
        // Insert payment records (one per order item)
        String paymentSql = "INSERT INTO payment (status, amount, buyer_id, artist_id, AW_order_id, created_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)";

        for (OrderItemRequest item : orderRequest.getItems()) {
            if (item.getArtworkId() == null) {
                throw new IllegalArgumentException("Order item is missing artwork_id.");
            }
            // Resolve artistId from request or fallback to DB by artworkId
            Long resolvedArtistId = item.getArtistId();
            if (resolvedArtistId == null) {
                try {
                    resolvedArtistId = jdbcTemplate.queryForObject(
                            "SELECT artist_id FROM artworks WHERE artwork_id = ?",
                            Long.class,
                            item.getArtworkId()
                    );
                } catch (Exception ex) {
                    resolvedArtistId = null;
                }
            }
            if (resolvedArtistId == null) {
                throw new IllegalStateException("Artist not found for artwork_id=" + item.getArtworkId());
            }

            // Insert order item
            jdbcTemplate.update(itemSql,
                    orderId,
                    item.getArtworkId(),
                    item.getQuantity(),
                    item.getPrice(),
                    item.getTitle(),
                    resolvedArtistId
            );

            // Insert payment record for this item
            double amount = (item.getPrice() != null ? item.getPrice() : 0.0) * (item.getQuantity() != null ? item.getQuantity() : 0);
            jdbcTemplate.update(paymentSql,
                    "escrow", // force status to excrow
                    amount,
                    orderRequest.getBuyerId(),
                    resolvedArtistId,
                    orderId
            );

            // Update artwork status to "Sold"
            try {
                int rowsUpdated = jdbcTemplate.update(updateArtworkStatusSql, item.getArtworkId());
                if (rowsUpdated > 0) {
                    System.out.println("Successfully updated artwork " + item.getArtworkId() + " status to Sold");
                } else {
                    System.err.println("Failed to update artwork " + item.getArtworkId() + " status - artwork not found");
                }
            } catch (Exception e) {
                System.err.println("Error updating artwork " + item.getArtworkId() + " status to Sold: " + e.getMessage());
                // Continue with other artworks even if one fails
            }
        }

        return orderId;
    }

    @Override
    public List<AWOrderDto> getOrdersByBuyerId(Long buyerId) {
        String orderSql = "SELECT * FROM AW_orders WHERE buyer_id = ?";
        List<AWOrderDto> orders = jdbcTemplate.query(orderSql, new Object[]{buyerId}, (rs, rowNum) -> {
            AWOrderDto order = new AWOrderDto();
            order.setId(rs.getLong("id"));
            order.setBuyerId(rs.getLong("buyer_id"));
            order.setFirstName(rs.getString("first_name"));
            order.setLastName(rs.getString("last_name"));
            order.setEmail(rs.getString("email"));
            order.setOrderDate(rs.getTimestamp("order_date").toLocalDateTime());
            order.setTotalAmount(rs.getDouble("total_amount"));
            order.setShippingFee(rs.getDouble("shipping_fee"));
            order.setShippingAddress(rs.getString("shipping_address"));
            order.setContactNumber(rs.getString("contact_number"));
            order.setStatus(rs.getString("status"));
            order.setPaymentMethod(rs.getString("payment_method"));
            order.setStripePaymentId(rs.getString("stripe_payment_id"));
            order.setDeliveryStatus(rs.getString("delivery_status")); // Fetch delivery_status from AW_orders table

            // Fetch order items with artwork and artist details (LEFT JOIN to avoid nulls)
            String itemSql = "SELECT oi.id, oi.artwork_id, oi.quantity, oi.price, oi.title, oi.artist_id, " +
                    "aw.medium, aw.size, aw.image_url, " +
                    "ar.email, ar.contactNo, ar.location, CONCAT(ar.first_name, ' ', ar.last_name) AS artist_name, ar.avatar_url " +
                    "FROM AW_order_items oi " +
                    "LEFT JOIN artworks aw ON oi.artwork_id = aw.artwork_id " +
                    "LEFT JOIN artists ar ON oi.artist_id = ar.artist_id " +
                    "WHERE oi.order_id = ?";
            List<AWOrderItemDto> items = jdbcTemplate.query(itemSql, new Object[]{order.getId()}, (itemRs, itemRowNum) -> {
                AWOrderItemDto item = new AWOrderItemDto();
                item.setId(itemRs.getLong("id"));
                item.setArtworkId(itemRs.getLong("artwork_id"));
                item.setQuantity(itemRs.getInt("quantity"));
                item.setPrice(itemRs.getDouble("price"));
                item.setTitle(itemRs.getString("title"));
                item.setArtistId(itemRs.getLong("artist_id"));
                item.setMedium(itemRs.getString("medium"));
                item.setSize(itemRs.getString("size"));
                item.setImageUrl(itemRs.getString("image_url"));
                item.setArtistEmail(itemRs.getString("email"));
                item.setArtistContactNo(itemRs.getString("contactNo"));
                item.setArtistLocation(itemRs.getString("location"));
                item.setArtistName(itemRs.getString("artist_name"));
                item.setArtistAvatarUrl(itemRs.getString("avatar_url"));
                return item;
            });
            order.setItems(items);

            // Optionally set order imageUrl to first item's imageUrl if available
            if (!items.isEmpty() && items.get(0).getImageUrl() != null) {
                order.setImageUrl(items.get(0).getImageUrl());
            }
            // For clients expecting an order-level artistId, set it from the first item
            if (!items.isEmpty() && items.get(0).getArtistId() != null) {
                order.setArtistId(items.get(0).getArtistId());
            }

            return order;
        });
        return orders;
    }

    // Add these methods to your payment DAO implementation
    @Override
    public boolean savePayment(Map<String, Object> paymentData) {
        String sql = "INSERT INTO payment (commission_request_id, artist_id, buyer_id, amount, status, created_at) " +
                "VALUES (?, ?, ?, ?, ?, ?)";

        try {
            int rowsAffected = jdbcTemplate.update(sql,
                    paymentData.get("commissionRequestId"),
                    paymentData.get("artistId"),
                    paymentData.get("buyerId"),
                    paymentData.get("amount"),
                    paymentData.get("status"),
                    paymentData.get("createdAt")
            );
            return rowsAffected > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // Fix the commission DAO implementation
    @Override
    public Map<String, Object> getCommissionRequestById(Long id) {
        String sql = "SELECT id, artist_id, buyer_id, budget FROM commission_requests WHERE id = ?";
        
        try {
            Map<String, Object> result = jdbcTemplate.queryForMap(sql, id);
            
            // Debug logging to see what we're getting
            System.out.println("Commission request data for ID " + id + ": " + result);
            
            // Ensure artist_id is properly converted to Long
            Object artistIdObj = result.get("artist_id");
            if (artistIdObj != null) {
                if (artistIdObj instanceof Number) {
                    result.put("artistId", ((Number) artistIdObj).longValue());
                } else {
                    result.put("artistId", Long.parseLong(artistIdObj.toString()));
                }
            } else {
                throw new RuntimeException("Artist ID is null for commission request ID: " + id);
            }
            
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Failed to get commission request with ID: " + id + ", Error: " + e.getMessage());
            return null;
        }
    }

    @Override
    public boolean updateCommissionShippingAddress(Long commissionId, String shippingAddress) {
        String sql = "UPDATE commission_requests SET shipping_address = ? WHERE id = ?";

        try {
            int rowsAffected = jdbcTemplate.update(sql, shippingAddress, commissionId);
            return rowsAffected > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean updateCommissionPaymentStatus(Long commissionId, String paymentStatus) {
        String sql = "UPDATE commission_requests SET payment_status = ? WHERE id = ?";

        try {
            int rowsAffected = jdbcTemplate.update(sql, paymentStatus, commissionId);
            return rowsAffected > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
