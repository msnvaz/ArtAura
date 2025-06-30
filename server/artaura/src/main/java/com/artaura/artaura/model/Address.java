package com.artaura.artaura.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "addresses")
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String streetAddress;
    private String city;
    private String state;
    private String zipCode;
    private String country;

    // Relationships (optional, depending on your model)
    @OneToOne
    @JoinColumn(name = "artist_id")
    private Artist artist;

    @OneToOne
    @JoinColumn(name = "buyer_id")
    private Buyer buyer;

    @OneToOne
    @JoinColumn(name = "shop_id")
    private Shop shop;
}
