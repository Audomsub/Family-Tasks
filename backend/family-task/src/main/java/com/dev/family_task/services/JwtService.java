package com.dev.family_task.services;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key; // ตรวจสอบว่า Import ตัวนี้
import java.util.Date;

@Service
public class JwtService {

    // Key นี้ต้องยาวและซับซ้อน (32 ตัวอักษรขึ้นไป) ผมเจนแบบ Base64 มาให้ใหม่ครับ
    private static final String SECRET_KEY = "5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437";

    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // 24 ชม.
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key getSignInKey() {
        // ใช้ Decoders.BASE64 เพื่อถอดรหัส String ที่เราตั้งไว้เป็น Byte Array
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject(); // Subject ของเราคือ Email ที่เรา set ไว้ตอนสร้างครับ
    }
}