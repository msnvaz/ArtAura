package com.artaura.artaura.service;

import com.artaura.artaura.dao.CustomOrderDAO;
import com.artaura.artaura.dto.order.CustomOrderDTO;
import com.artaura.artaura.dto.order.OrderAcceptRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomOrderServiceImpl implements CustomOrderService {

    @Autowired
    private CustomOrderDAO customOrderDAO;

    @Override
    public List<CustomOrderDTO> getOrdersByArtistId(Long artistId) {
        return customOrderDAO.getOrdersByArtistId(artistId);
    }

    @Override
    public List<CustomOrderDTO> getOrdersByBuyerId(Long buyerId) {
        return customOrderDAO.getOrdersByBuyerId(buyerId);
    }

    @Override
    public Optional<CustomOrderDTO> getOrderById(Long orderId) {
        return customOrderDAO.getOrderById(orderId);
    }

    @Override
    public void acceptOrder(Long orderId, OrderAcceptRequest acceptRequest) {
        // Validate that the order exists and is in PENDING status
        Optional<CustomOrderDTO> orderOpt = customOrderDAO.getOrderById(orderId);
        if (orderOpt.isEmpty()) {
            throw new RuntimeException("Order not found");
        }

        CustomOrderDTO order = orderOpt.get();
        if (!"PENDING".equals(order.getStatus())) {
            throw new RuntimeException("Order is not in pending status");
        }

        customOrderDAO.acceptOrder(orderId, acceptRequest);
    }

    @Override
    public void rejectOrder(Long orderId, String rejectionReason) {
        // Validate that the order exists and is in PENDING status
        Optional<CustomOrderDTO> orderOpt = customOrderDAO.getOrderById(orderId);
        if (orderOpt.isEmpty()) {
            throw new RuntimeException("Order not found");
        }

        CustomOrderDTO order = orderOpt.get();
        if (!"PENDING".equals(order.getStatus())) {
            throw new RuntimeException("Order is not in pending status");
        }

        customOrderDAO.rejectOrder(orderId, rejectionReason);
    }

    @Override
    public void updateOrderStatus(Long orderId, String status) {
        customOrderDAO.updateOrderStatus(orderId, status);
    }

    @Override
    public Long createOrder(CustomOrderDTO orderDTO) {
        return customOrderDAO.createOrder(orderDTO);
    }

    @Override
    public int getOrdersCountByArtistId(Long artistId) {
        return customOrderDAO.getOrdersCountByArtistId(artistId);
    }

    @Override
    public int getPendingOrdersCountByArtistId(Long artistId) {
        return customOrderDAO.getPendingOrdersCountByArtistId(artistId);
    }
}
