package com.artaura.artaura.service;

import com.artaura.artaura.dto.shop.ShopDTO;
import java.util.List;

public interface ShopService {

    ShopDTO getShopById(Long shopId);

    ShopDTO getShopByUserId(Long userId); // <-- Needed for profile fetch

    void updateShop(Long shopId, ShopDTO shop);

    void deleteShop(Long shopId); // <-- Needed for deactivation

    List<ShopDTO> getAllShops(); // <-- New method for shop discovery
}
