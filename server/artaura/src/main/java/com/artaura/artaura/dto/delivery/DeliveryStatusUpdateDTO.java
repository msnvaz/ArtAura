package com.artaura.artaura.dto.delivery;

import java.math.BigDecimal;

public class DeliveryStatusUpdateDTO {
    private Long orderId;
    private String orderType; // "artwork" for AW_orders, "commission" for commission_requests
    private String deliveryStatus; // "pending", "accepted", "outForDelivery", "delivered", "N/A"
    private BigDecimal shippingFee;
    private Long deliveryPartnerId;

    public DeliveryStatusUpdateDTO() {}

    public DeliveryStatusUpdateDTO(Long orderId, String orderType, String deliveryStatus, 
                                   BigDecimal shippingFee, Long deliveryPartnerId) {
        this.orderId = orderId;
        this.orderType = orderType;
        this.deliveryStatus = deliveryStatus;
        this.shippingFee = shippingFee;
        this.deliveryPartnerId = deliveryPartnerId;
    }

    // Getters and Setters
    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getOrderType() {
        return orderType;
    }

    public void setOrderType(String orderType) {
        this.orderType = orderType;
    }

    public String getDeliveryStatus() {
        return deliveryStatus;
    }

    public void setDeliveryStatus(String deliveryStatus) {
        this.deliveryStatus = deliveryStatus;
    }

    public BigDecimal getShippingFee() {
        return shippingFee;
    }

    public void setShippingFee(BigDecimal shippingFee) {
        this.shippingFee = shippingFee;
    }

    public Long getDeliveryPartnerId() {
        return deliveryPartnerId;
    }

    public void setDeliveryPartnerId(Long deliveryPartnerId) {
        this.deliveryPartnerId = deliveryPartnerId;
    }

    @Override
    public String toString() {
        return "DeliveryStatusUpdateDTO{" +
                "orderId=" + orderId +
                ", orderType='" + orderType + '\'' +
                ", deliveryStatus='" + deliveryStatus + '\'' +
                ", shippingFee=" + shippingFee +
                ", deliveryPartnerId=" + deliveryPartnerId +
                '}';
    }
}
