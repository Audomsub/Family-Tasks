package com.dev.family_task.dto.Request;

import lombok.Data;

@Data
public class RegisterRequest {
    private String fullName;
    private String email;
    private String password;
    private String familyName; // ชื่อครอบครัวที่จะสร้าง
}