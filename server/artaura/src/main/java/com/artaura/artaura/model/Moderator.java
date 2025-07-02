package com.artaura.artaura.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "moderators")
public class Moderator {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long moderatorId;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    public Long getId() { return moderatorId; }
}
