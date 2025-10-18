package com.artaura.artaura.service;

import com.artaura.artaura.dto.catalog.AddProductDTO;
import java.util.List;

public interface ProductService {
    void addProduct(AddProductDTO product);

    List<AddProductDTO> getAllProducts();

    List<AddProductDTO> getProductsByShopId(Long shopId);

    void deleteProduct(Long id);

    void updateProduct(Long id, AddProductDTO product);

    AddProductDTO getProductById(Long id);
}
