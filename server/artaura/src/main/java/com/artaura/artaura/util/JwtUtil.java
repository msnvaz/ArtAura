package com.artaura.artaura.util;

import io.jsonwebtoken.*;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

    private final String secret = "SECRET_KEY";  // store this securely!

    public String generateToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(new java.util.Date())
                .setExpiration(new java.util.Date(System.currentTimeMillis() + 86400000)) // 1 day expiry
                .signWith(SignatureAlgorithm.HS256, secret)
                .compact();
    }

    public Jws<Claims> validateToken(String token) throws JwtException {
        return Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token);
    }
}
