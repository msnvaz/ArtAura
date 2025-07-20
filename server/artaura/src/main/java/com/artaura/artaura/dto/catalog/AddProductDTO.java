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

    // Lombok @Data annotation will generate getters and setters
    // But if you need custom logic, you can add them manually:
    
    public Double getRating() {
        return rating;
    }
    
    public void setRating(Double rating) {
        this.rating = rating != null ? rating : 0.0;
    }
    
    public Integer getSales() {
        return sales;
    }
    
    public void setSales(Integer sales) {
        this.sales = sales != null ? sales : 0;
    }
}
