package com.artaura.artaura.dto;

import lombok.Data;

@Data
public class ModeratorLogin {
    private Long moderatorId;
    private String email;
    private String password;
}
