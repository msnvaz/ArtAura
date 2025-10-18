package com.artaura.artaura.service.order;

import com.artaura.artaura.dao.order.ShopOrderDAO;
import com.artaura.artaura.dto.order.ShopOrderDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShopOrderServiceImpl implements ShopOrderService {

    private static final Logger logger = LoggerFactory.getLogger(ShopOrderServiceImpl.class);

    @Autowired
    private ShopOrderDAO shopOrderDAO;

    @Override
    public List<ShopOrderDTO> getOrdersByShopId(Long shopId) {
        logger.info("Fetching orders for shop ID: {}", shopId);
        return shopOrderDAO.findByShopId(shopId);
    }

    @Override
    public ShopOrderDTO getOrderById(Long orderId) {
        logger.info("Fetching order with ID: {}", orderId);
        ShopOrderDTO order = shopOrderDAO.findById(orderId);
        if (order == null) {
            logger.error("Order not found with ID: {}", orderId);
            throw new RuntimeException("Order not found with ID: " + orderId);
        }
        return order;
    }

    @Override
    public ShopOrderDTO createOrder(ShopOrderDTO order) {
        logger.info("Creating new order for shop ID: {}", order.getShopId());
        return shopOrderDAO.save(order);
    }

    @Override
    public ShopOrderDTO updateOrder(ShopOrderDTO order) {
        logger.info("Updating order ID: {}", order.getOrderId());
        return shopOrderDAO.update(order);
    }

    @Override
    public void deleteOrder(Long orderId) {
        logger.info("Deleting order ID: {}", orderId);
        shopOrderDAO.deleteById(orderId);
    }
}
