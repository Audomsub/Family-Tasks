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

import javax.sql.rowset.serial.SerialException;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtFillter extends OncePerRequestFilter {

    private final JwtService jwtService;

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

                // สร้างบัตรผ่านจำลองเก็บไว้ในระบบของ Spring Security
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userEmail,
                        null,
                        java.util.Collections.emptyList() // ในอนาคตจะใส่ Role เช่น PARENT/CHILD ตรงนี้
                );

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        } catch (Exception e) {
            // ถ้า Token ปลอมหรือหมดอายุ จะไม่ทำอะไร (จะติด 403 อัตโนมัติในเส้นที่ล็อคไว้)
        }

        filterChain.doFilter(request, response);
    }
}