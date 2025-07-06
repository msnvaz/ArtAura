package com.artaura.artaura.dto;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class BuyerSignupRequest {
    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;
    @Email
    @NotBlank
    private String email;
    @NotBlank
    private String contactNo;
    @NotBlank
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String password;
    @AssertTrue(message = "You must agree to the terms and conditions")
    private boolean agreedTerms;
    private String streetAddress;
    private String city;
    private String state;
    private String zipCode;
    private String country;


    // Getters and setters
}
