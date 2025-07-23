package com.artaura.artaura.controller;

import com.artaura.artaura.dto.catalog.AddProductDTO;
import com.artaura.artaura.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @PostMapping("/add")
    public ResponseEntity<String> createProduct(@RequestBody AddProductDTO dto) {
        service.createProduct(dto);
        return ResponseEntity.ok("Product created");
    }

    @GetMapping
    public ResponseEntity<List<AddProductDTO>> getAll() {
        return ResponseEntity.ok(service.getAllProducts());
    }
}
