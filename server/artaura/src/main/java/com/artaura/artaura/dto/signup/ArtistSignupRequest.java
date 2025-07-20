package com.artaura.artaura.dto.signup;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class ArtistSignupRequest {

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

    @NotBlank
    private String nic;

    @NotBlank
    private String specialization;

    private String bio;

    private Float rate;

    private String badge;

    @AssertTrue(message = "You must agree to the terms and conditions")
    private boolean agreedTerms;

    private String streetAddress;
    private String city;
    private String state;
    private String zipCode;
    private String country;
}
