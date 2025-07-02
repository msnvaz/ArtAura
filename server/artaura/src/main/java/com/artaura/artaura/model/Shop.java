package com.artaura.artaura.model;

import jakarta.persistence.*;
import lombok.Data;
import java.sql.Timestamp;

@Data
@Entity
@Table(name = "shops")
public class Shop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long shopId;

    @Column(nullable = false)
    private String password;

    private String shopName;
    private String ownerName;
    private String email;
    private String contactNo;
    private String businessType;
    private String description;
    private String website;
    private String businessLicense;
    private String taxId;
    private boolean agreedTerms;
    private Timestamp createdAt = new Timestamp(System.currentTimeMillis());

    @OneToOne(mappedBy = "shop", cascade = CascadeType.ALL)
    private Address address;

    public Long getId() { return shopId; }
}
