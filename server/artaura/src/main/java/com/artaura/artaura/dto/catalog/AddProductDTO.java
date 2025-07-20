package com.artaura.artaura.dto.catalog;

import lombok.Data;
@Data

public class AddProductDTO {
    private Long id;
    private String name;
    private String sku;
    private String category;
    private double price;
    private int stock;
    private String status;
    private String image;
    private double rating;
    private int sales;

    // Getters and setters
}
