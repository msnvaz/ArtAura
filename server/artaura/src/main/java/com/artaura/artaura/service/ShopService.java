package com.artaura.artaura.service;

import com.artaura.artaura.dto.shop.ShopDTO;

public interface ShopService {
    ShopDTO getShopById(Long shopId);

    ShopDTO getShopByEmail(String email);

    void updateShop(Long shopId, ShopDTO shop);
}