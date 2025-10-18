package com.artaura.artaura.service.buyer;
import com.artaura.artaura.dto.buyer.OrderRequest;
import com.artaura.artaura.dto.buyer.CommissionPaymentRequestDTO;
import com.artaura.artaura.dao.buyer.OrderDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.artaura.artaura.dto.buyer.AWOrderItemDto;
import com.artaura.artaura.dto.buyer.AWOrderDto;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@Service
public class OrderService {
    @Autowired
    private OrderDao orderDao;

    public Long saveOrder(OrderRequest orderRequest) {
        return orderDao.saveOrder(orderRequest);
    }

    public List<AWOrderDto> getOrdersByBuyerId(Long buyerId) {
        return orderDao.getOrdersByBuyerId(buyerId);
    }

    public boolean processCommissionPayment(CommissionPaymentRequestDTO paymentRequest, Long buyerId) {
        try {
            // Get commission request details using the existing orderDao
            Map<String, Object> commissionRequest = orderDao.getCommissionRequestById(paymentRequest.getCommissionId());

            if (commissionRequest == null) {
                throw new RuntimeException("Commission request not found");
            }

            // Update commission request with shipping address
            orderDao.updateCommissionShippingAddress(paymentRequest.getCommissionId(), paymentRequest.getShippingAddress());

            // Create payment data as Map - use "artistId" key that we set in the DAO
            Map<String, Object> paymentData = new HashMap<>();
            paymentData.put("commissionRequestId", paymentRequest.getCommissionId());
            paymentData.put("artistId", commissionRequest.get("artistId")); // Use the properly converted artistId
            paymentData.put("buyerId", buyerId);
            paymentData.put("amount", paymentRequest.getAmount());
            paymentData.put("status", "escrow");
            paymentData.put("createdAt", LocalDateTime.now());

            // Save payment using the existing orderDao
            boolean paymentSaved = orderDao.savePayment(paymentData);

            // Update commission payment status
            if (paymentSaved) {
                orderDao.updateCommissionPaymentStatus(paymentRequest.getCommissionId(), "escrow");
            }

            return paymentSaved;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
