package com.artaura.artaura.dto.signup;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class ShopOwnerSignupRequest {
    @NotBlank
    private String shopName;
    @NotBlank
    private String ownerName;
    @Email
    @NotBlank
    private String email;
    @NotBlank
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String password;
    @NotBlank
    private String contactNo;
    @NotBlank
    private String businessType;
    @NotBlank
    private String description;
    @NotBlank
    private String businessLicense;
    @NotBlank
    private String taxId;
    @NotBlank
    @AssertTrue(message = "You must agree to the terms and conditions")
    private boolean agreedTerms;
    @NotBlank
    private String streetAddress;
    @NotBlank
    private String city;
    @NotBlank
    private String state;
    @NotBlank
    private String zipCode;
    @NotBlank
    private String country;
    @NotBlank
    private String categories;
    @NotBlank
    private String nicNumber;
    @NotBlank
    private String nicImageUrl;

    // Getters and setters
}
