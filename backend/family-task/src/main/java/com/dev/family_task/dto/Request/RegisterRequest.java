package com.dev.family_task.dto.Request;

import lombok.Data;

@Data
public class RegisterRequest {
    private String fullName;
    private String email;
    private String password;
    private String familyName; // สำหรับ PARENT สร้างครอบครัวใหม่
    private String role;       // "PARENT" หรือ "CHILD"
    private String inviteCode; // สำหรับ CHILD ใช้ join family โดยตรง
}