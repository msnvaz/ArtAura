package com.artaura.artaura.dto.buyer;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CommissionPaymentRequestDTO {
    private Long commissionId;
    private String stripePaymentId;
    private BigDecimal amount;
    private String currency;
    private String status;
    private String shippingAddress;
    private String paymentMethod;
    private LocalDateTime paymentDate;
}
