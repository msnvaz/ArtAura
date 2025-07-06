package com.artaura.artaura.dto.auth;

import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private String role;
    private Long userId;

    public LoginResponse(String token, String role, Long userId) {
        this.token = token;
        this.role = role;
        this.userId = userId;
    }
}