package com.artaura.artaura.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class ShopRegisterRequest {
    @NotBlank
    private String shopName;
    @NotBlank
    private String ownerName;
    @Email
    private String email;
    @NotBlank
    private String contactNo;
    @NotBlank
    @Size(min = 8)
    private String password;
    private String businessType;
    private String description;
    private String website;
    private String businessLicense;
    private String taxId;
    @AssertTrue(message = "You must agree to the terms and conditions")
    private boolean agreedTerms;
    private String streetAddress;
    private String city;
    private String state;
    private String zipCode;
    private String country;
}
