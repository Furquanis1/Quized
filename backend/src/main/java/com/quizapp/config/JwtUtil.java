package com.quizapp.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    private static final SecretKey SECRET_KEY = Keys.hmacShaKeyFor(
            "dGhpcyBpcyBhIHZlcnkgc2VjdXJlIHNlY3JldCBrZXkgZm9yIHF1aXogYXBwIGp3dA==".getBytes()
    );
    private static final long EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours

    public String generateToken(String username, String role) {
        return Jwts.builder()
                .subject(username)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(SECRET_KEY)
                .compact();
    }

    public String extractUsername(String token) {
        return getClaims(token).getPayload().getSubject();
    }

    public String extractRole(String token) {
        return getClaims(token).getPayload().get("role", String.class);
    }

    public boolean validateToken(String token) {
        try {
            getClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Jws<Claims> getClaims(String token) {
        return Jwts.parser()
                .verifyWith(SECRET_KEY)
                .build()
                .parseSignedClaims(token);
    }
}
