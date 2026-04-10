package com.dev.family_task.dto.Request;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}