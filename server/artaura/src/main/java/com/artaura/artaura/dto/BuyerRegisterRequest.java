package com.artaura.artaura.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class BuyerRegisterRequest {
    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;
    @Email
    private String email;
    @NotBlank
    @Size(min = 8)
    private String password;
    @AssertTrue(message = "You must agree to the terms and conditions")
    private boolean agreedTerms;
    private String streetAddress;
    private String city;
    private String state;
    private String zipCode;
    private String country;
}
