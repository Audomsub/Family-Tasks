package com.dev.family_task.controller;

import com.dev.family_task.dto.Request.JoinFamilyRequest;
import com.dev.family_task.dto.Request.RegisterRequest;
import com.dev.family_task.dto.Request.LoginRequest;
import com.dev.family_task.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        try {
            String message = authService.registerFamily(request);
            return ResponseEntity.ok(message);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest request) {
        try {
            String token = authService.login(request);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Login Success");
            response.put("token" , token);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error" , e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @PostMapping("/join")
    public ResponseEntity<Map<String, String>> joinFamily(@RequestBody JoinFamilyRequest request) {
        String email = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();

        try {
            String message = authService.joinFamily(email, request.getInviteCode());
            Map<String, String> response = new HashMap<>();
            response.put("message" , message);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @org.springframework.web.bind.annotation.GetMapping("/me")
    public ResponseEntity<com.dev.family_task.entities.UserEntity> getCurrentUser() {
        String email = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();
        com.dev.family_task.entities.UserEntity user = authService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }
}
