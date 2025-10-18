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
        return shopDAO.findById(shopId);
    }

    @Override
    public ShopDTO getShopByUserId(Long userId) {
        return shopDAO.findByUserId(userId);
    }

    @Override
    public void updateShop(Long shopId, ShopDTO shop) {
        shopDAO.updateShop(shopId, shop);
    }

    @Override
    public void deleteShop(Long shopId) {
        shopDAO.deleteShop(shopId);
    }
}