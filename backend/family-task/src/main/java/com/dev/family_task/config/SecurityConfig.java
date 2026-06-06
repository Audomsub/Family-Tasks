package com.dev.family_task.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter; // ต้อง import ตัวนี้

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    // เปลี่ยนชื่อให้ตรงกับคลาสที่คุณสร้าง (ถ้าคุณตั้งชื่อว่า JwtAuthenticationFilter)
    private final JwtFillter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll() // เปิดให้ Register/Login
                        // --- เปิดหน้า Swagger ให้เข้าถึงได้โดยไม่ต้อง Login ---
                        .requestMatchers("/v3/api-docs/**").permitAll()
                        .requestMatchers("/swagger-ui/**").permitAll()
                        .requestMatchers("/swagger-ui.html").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("SUPER_ADMIN") // ต้องเป็น SUPER_ADMIN เท่านั้น
                        .anyRequest().authenticated() // ที่เหลือต้องมี Token
                )
                // แก้ไขบรรทัดนี้: วาง jwtFilter ไว้ก่อนหน้า UsernamePasswordAuthenticationFilter มาตรฐาน
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}