package com.artaura.artaura.service;

import com.artaura.artaura.dao.ProductDAO;
import com.artaura.artaura.dto.catalog.AddProductDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductDAO productDAO;

    @Override
    public void addProduct(AddProductDTO product) {
        try {
            productDAO.save(product);
        } catch (Exception e) {
            throw new RuntimeException("Failed to add product: " + e.getMessage());
        }
    }

    @Override
    public List<AddProductDTO> getAllProducts() {
        try {
            return productDAO.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch products: " + e.getMessage());
        }
    }

    @Override
    public List<AddProductDTO> getProductsByShopId(Long shopId) {
        try {
            return productDAO.findByShopId(shopId);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch products for shop: " + e.getMessage());
        }
    }

    @Override
    public void deleteProduct(Long id) {
        try {
            productDAO.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete product: " + e.getMessage());
        }
    }

    @Override
    public void updateProduct(Long id, AddProductDTO product) {
        try {
            productDAO.updateById(id, product);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update product: " + e.getMessage());
        }
    }

    @Override
    public AddProductDTO getProductById(Long id) {
        try {
            return productDAO.findById(id);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch product: " + e.getMessage());
        }
    }
}