package com.dev.family_task.config;

import com.dev.family_task.services.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtFillter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final com.dev.family_task.repositories.UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // 1. ถ้าไม่มี Header หรือไม่ใช่ Bearer ให้ข้ามไปเลย
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2. แกะ Token ออกมา (ตัดคำว่า Bearer ออก)
        jwt = authHeader.substring(7);

        try {
            userEmail = jwtService.extractUsername(jwt);

            // 3. ถ้าแกะสำเร็จ และยังไม่มีการยืนยันตัวตนใน Session นี้
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                // Load User to get the Role
                com.dev.family_task.entities.UserEntity user = userRepository.findByEmail(userEmail).orElse(null);
                if (user != null) {
                    // Check if banned
                    if (user.isBanned()) {
                        throw new RuntimeException("Account is banned");
                    }
                    java.util.List<org.springframework.security.core.authority.SimpleGrantedAuthority> authorities =
                        java.util.Collections.singletonList(
                            new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + user.getRole().name())
                        );

                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userEmail,
                            null,
                            authorities
                    );

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // ถ้า Token ปลอมหรือหมดอายุ จะไม่ทำอะไร (จะติด 403 อัตโนมัติในเส้นที่ล็อคไว้)
        }

        filterChain.doFilter(request, response);
    }
}