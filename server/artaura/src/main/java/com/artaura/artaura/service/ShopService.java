package com.artaura.artaura.service;

import com.artaura.artaura.dto.shop.ShopDTO;

public interface ShopService {
    ShopDTO getShopById(Long shopId);

    ShopDTO getShopByUserId(Long userId); // <-- Needed for profile fetch

    void updateShop(Long shopId, ShopDTO shop);
}