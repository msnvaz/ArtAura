package com.artaura.artaura.dao.buyer;
import com.artaura.artaura.dto.buyer.AWOrderDto;
import com.artaura.artaura.dto.buyer.AWOrderItemDto;
import com.artaura.artaura.dto.buyer.OrderRequest;
import java.util.List;
import java.util.Map;

public interface OrderDao {
    Long saveOrder(OrderRequest orderRequest);
    /**
     * Returns a list of AWOrderDto, each containing a list of AWOrderItemDto representing order items.
     */
    List<AWOrderDto> getOrdersByBuyerId(Long buyerId);

    // Commission payment methods
    boolean savePayment(Map<String, Object> paymentData);
    Map<String, Object> getCommissionRequestById(Long id);
    boolean updateCommissionShippingAddress(Long commissionId, String shippingAddress);
    boolean updateCommissionPaymentStatus(Long commissionId, String paymentStatus);
}
