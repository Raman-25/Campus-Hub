package com.example.collegeManagementSystem.collage.service.Auth;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secretKey}")
    private String jwtSecretKey;

    private SecretKey getSecretKey(){
        return Keys.hmacShaKeyFor(jwtSecretKey.getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(Long id, String email, String role){

        return Jwts.builder()
                .subject(id.toString())
                .claim("email", email)
                .claim("role",role )
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis()+ 1000*60*10))
                .signWith(getSecretKey())
                .compact();
    }

    public String generateRefreshToken(Long id){

        return Jwts.builder()
                .subject(id.toString())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis()+ 1000L *60*60*24*30*6))
                .signWith(getSecretKey())
                .compact();
    }


    }


