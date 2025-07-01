package com.artaura.artaura.dto;

import lombok.Data;

@Data
public class AdminLogin {
    private Long adminId;
    private String email;
    private String password;
}
