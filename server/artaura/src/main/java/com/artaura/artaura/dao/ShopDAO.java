package com.artaura.artaura.dao;

import com.artaura.artaura.dto.shop.ShopDTO;


public interface ShopDAO {
    ShopDTO findById(Long shopId);
    ShopDTO findByEmail(String email);
    void updateShop(Long shopId, ShopDTO shop);
    ShopDTO getShopByEmail(String email);
    ShopDTO getShopById(Long shopId);
    ShopDTO getShopByUserId(Long userId); // Added to match implementation
}