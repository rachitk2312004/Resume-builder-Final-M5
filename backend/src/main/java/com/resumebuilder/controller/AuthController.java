package com.resumebuilder.controller;

import com.resumebuilder.config.JwtConfig;
import com.resumebuilder.dto.*;
import com.resumebuilder.entity.User;
import com.resumebuilder.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtConfig jwtConfig;
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            User user = userService.createUser(request.getName(), request.getEmail(), request.getPassword());
            
            String accessToken = jwtConfig.generateToken(user.getEmail());
            String refreshToken = jwtConfig.generateRefreshToken(user.getEmail());
            
            UserDto userDto = new UserDto(user.getId(), user.getName(), user.getEmail(), 
                                        user.getIsPublicByDefault(), user.getCreatedAt());
            
            AuthResponse response = new AuthResponse(accessToken, refreshToken, 
                                                   jwtConfig.getExpiration(), userDto);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            
            User user = userService.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            String accessToken = jwtConfig.generateToken(user.getEmail());
            String refreshToken = jwtConfig.generateRefreshToken(user.getEmail());
            
            UserDto userDto = new UserDto(user.getId(), user.getName(), user.getEmail(), 
                                        user.getIsPublicByDefault(), user.getCreatedAt());
            
            AuthResponse response = new AuthResponse(accessToken, refreshToken, 
                                                   jwtConfig.getExpiration(), userDto);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid credentials");
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> request) {
        try {
            String refreshToken = request.get("refreshToken");
            
            if (refreshToken == null || !jwtConfig.isRefreshToken(refreshToken)) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Invalid refresh token");
                return ResponseEntity.badRequest().body(error);
            }
            
            String email = jwtConfig.extractUsername(refreshToken);
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            String newAccessToken = jwtConfig.generateToken(user.getEmail());
            String newRefreshToken = jwtConfig.generateRefreshToken(user.getEmail());
            
            UserDto userDto = new UserDto(user.getId(), user.getName(), user.getEmail(), 
                                        user.getIsPublicByDefault(), user.getCreatedAt());
            
            AuthResponse response = new AuthResponse(newAccessToken, newRefreshToken, 
                                                   jwtConfig.getExpiration(), userDto);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid refresh token");
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/chat-login")
    public ResponseEntity<?> chatLogin(@RequestBody Map<String, String> request) {
        // Placeholder for chat-based login
        // This would integrate with a chat service in the future
        String email = request.get("email");
        String password = request.get("password");
        
        if (email == null || password == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Email and password are required");
            return ResponseEntity.badRequest().body(error);
        }
        
        return login(new AuthRequest(email, password));
    }
}
