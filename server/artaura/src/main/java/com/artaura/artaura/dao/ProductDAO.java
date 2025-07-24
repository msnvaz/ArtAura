package com.artaura.artaura.dao;

import com.artaura.artaura.dto.catalog.AddProductDTO;
import java.util.List;

public interface ProductDAO {
    void save(AddProductDTO product);

    List<AddProductDTO> findAll();

    void deleteById(Long id);

    void updateById(Long id, AddProductDTO product);

    AddProductDTO findById(Long id);
}
