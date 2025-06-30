package com.artaura.artaura.model;

import jakarta.persistence.*;
import lombok.Data;
import java.sql.Timestamp;

@Data
@Entity
@Table(name = "buyers")
public class Buyer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long buyerId;

    private String firstName;
    private String lastName;
    private String password;
    private String email;
    private boolean agreedTerms;
    private Timestamp createdAt = new Timestamp(System.currentTimeMillis());

    @OneToOne(mappedBy = "buyer", cascade = CascadeType.ALL)
    private Address address;

    public Long getId() { return buyerId; }
}
