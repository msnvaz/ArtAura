package com.artaura.artaura.dto.buyer;
import com.artaura.artaura.dto.buyer.OrderItemRequest;
import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    private Long buyerId;
    private Double subtotal;
    private Double shipping;
    private Double total;
    private String paymentMethod;
    private String billingFirstName;
    private String billingLastName;
    private String billingEmail;
    private String billingPhone;
    private String billingAddress;
    private String billingCity;
    private String billingState;
    private String billingZipCode;
    private String billingCountry;
    private List<OrderItemRequest> items;
    private String status;
    private String orderDate;
    private String stripePaymentId;
    private Double totalAmount;

    public Double getTotalAmount() {
        return totalAmount != null ? totalAmount : total;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }
}
