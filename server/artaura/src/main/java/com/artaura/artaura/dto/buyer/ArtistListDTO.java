package com.artaura.artaura.dto.buyer;

import lombok.Data;

@Data
public class ArtistListDTO {
    private Long id;
    private String name;
    private String specialization;
    private String bio;
    private Double rate;
    private Integer totalFollowers;
    private Integer totalSales;
    private String avatarUrl;
    private String location;
    private String badge;
    private String contactNo;
    private String email;
    private String coverImageUrl;

    public ArtistListDTO() {}

    public ArtistListDTO(Long id, String name, String specialization, String bio, Double rate, Integer totalFollowers, Integer totalSales, String avatarUrl, String location, String badge, String contactNo, String email, String coverImageUrl) {
        this.id = id;
        this.name = name;
        this.specialization = specialization;
        this.bio = bio;
        this.rate = rate;
        this.totalFollowers = totalFollowers;
        this.totalSales = totalSales;
        this.avatarUrl = avatarUrl;
        this.location = location;
        this.badge = badge;
        this.contactNo = contactNo;
        this.email = email;
        this.coverImageUrl = coverImageUrl;
    }
}
