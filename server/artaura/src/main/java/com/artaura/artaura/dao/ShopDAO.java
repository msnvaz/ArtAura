package com.artaura.artaura.dao;

import com.artaura.artaura.dto.shop.ShopDTO;
import java.util.List;

public interface ShopDAO {

    ShopDTO findById(Long shopId);

    ShopDTO findByUserId(Long userId); // <-- Needed for profile fetch

    void updateShop(Long shopId, ShopDTO shop);

    void deleteShop(Long shopId); // <-- Needed for deactivation

    ShopDTO findByEmail(String email);

    List<ShopDTO> findAll(); // <-- New method for shop discovery
}
