package com.artaura.artaura.service;

import com.artaura.artaura.dao.ShopDAO;
import com.artaura.artaura.dto.shop.ShopDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ShopServiceImpl implements ShopService {

    @Autowired
    private ShopDAO shopDAO;

    @Override
    public ShopDTO getShopById(Long shopId) {
        try {
            return shopDAO.findById(shopId);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch shop: " + e.getMessage());
        }
    }

    @Override
    public ShopDTO getShopByEmail(String email) {
        try {
            return shopDAO.findByEmail(email);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch shop: " + e.getMessage());
        }
    }

    @Override
    public void updateShop(Long shopId, ShopDTO shop) {
        try {
            shopDAO.updateShop(shopId, shop);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update shop: " + e.getMessage());
        }
    }
}