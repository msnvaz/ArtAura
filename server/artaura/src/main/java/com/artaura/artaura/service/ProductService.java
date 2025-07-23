package com.artaura.artaura.service;

import com.artaura.artaura.dao.ProductDAO;
import com.artaura.artaura.dto.catalog.AddProductDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductDAO dao;

    public ProductService(ProductDAO dao) {
        this.dao = dao;
    }

    public void createProduct(AddProductDTO product) {
        dao.save(product);
    }

    public List<AddProductDTO> getAllProducts() {
        return dao.findAll();
    }
}
