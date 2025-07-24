package com.artaura.artaura.dao;

import com.artaura.artaura.dto.shop.ShopDTO;

public interface ShopDAO {
    ShopDTO findById(Long shopId);
    void updateShop(Long shopId, ShopDTO shop);
    ShopDTO findByEmail(String email);
}