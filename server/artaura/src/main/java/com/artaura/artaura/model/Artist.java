package com.artaura.artaura.model;

import jakarta.persistence.*;
import lombok.Data;
import java.sql.Timestamp;

@Data
@Entity
@Table(name = "artists")
public class Artist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long artistId;

    @Column(nullable = false)
    private String password;

    private String firstName;
    private String lastName;
    private String email;
    private String contactNo;
    private String nic;
    private String bio;
    private Float rate;
    private String badge;
    private boolean agreedTerms;
    private Timestamp createdAt = new Timestamp(System.currentTimeMillis());

    @OneToOne(mappedBy = "artist", cascade = CascadeType.ALL)
    private Address address;

    public Long getId() { return artistId; }
}
