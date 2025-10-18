package com.artaura.artaura.dao.order;

import com.artaura.artaura.dto.order.ShopOrderDTO;
import java.util.List;

public interface ShopOrderDAO {
    List<ShopOrderDTO> findByShopId(Long shopId);

    ShopOrderDTO findById(Long orderId);

    ShopOrderDTO save(ShopOrderDTO order);

    ShopOrderDTO update(ShopOrderDTO order);

    void deleteById(Long orderId);
}
