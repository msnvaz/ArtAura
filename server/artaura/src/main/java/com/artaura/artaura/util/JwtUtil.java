package com.artaura.artaura.util;

import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    public String generateToken(Long userId, String role) {
        String token = Jwts.builder()
                .claim("userId", userId)
                .claim("role", role)
                .setSubject(String.valueOf(userId))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(SignatureAlgorithm.HS256, secret)
                .compact();
        
        System.out.println("🔐 JWT Token generated successfully for userId: " + userId + ", role: " + role);
        System.out.println("🔑 Token preview: " + token.substring(0, Math.min(30, token.length())) + "...");
        
        return token;
    }

    public Claims extractClaims(String token) throws ExpiredJwtException {
        return Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody();
    }

    public Jws<Claims> validateToken(String token) {
        return Jwts.parser()
                .setSigningKey(secret) // Use your configured secret key
                .setAllowedClockSkewSeconds(60) // Allow 60 seconds clock skew
                .parseClaimsJws(token);
    }

    public Long extractUserId(String token) {
        Claims claims = extractClaims(token);
        return claims.get("userId", Long.class);
    }

    public String extractRole(String token) {
        Claims claims = extractClaims(token);
        return claims.get("role", String.class);
    }

}
