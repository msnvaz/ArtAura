package com.artaura.artaura.service.order;

import com.artaura.artaura.dto.order.ShopOrderDTO;
import java.util.List;

public interface ShopOrderService {
    List<ShopOrderDTO> getOrdersByShopId(Long shopId);

    ShopOrderDTO getOrderById(Long orderId);

    ShopOrderDTO createOrder(ShopOrderDTO order);

    ShopOrderDTO updateOrder(ShopOrderDTO order);

    void deleteOrder(Long orderId);
}
