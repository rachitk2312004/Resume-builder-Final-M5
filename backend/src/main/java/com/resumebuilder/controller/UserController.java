package com.resumebuilder.controller;

import com.resumebuilder.dto.UserDto;
import com.resumebuilder.entity.User;
import com.resumebuilder.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            UserDto userDto = new UserDto(user.getId(), user.getName(), user.getEmail(), 
                                        user.getIsPublicByDefault(), user.getCreatedAt());
            
            return ResponseEntity.ok(userDto);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> updates, 
                                         Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            String name = (String) updates.get("name");
            String newEmail = (String) updates.get("email");
            Boolean isPublicByDefault = (Boolean) updates.get("isPublicByDefault");
            
            User updatedUser = userService.updateUser(user.getId(), name, newEmail, isPublicByDefault);
            
            UserDto userDto = new UserDto(updatedUser.getId(), updatedUser.getName(), 
                                        updatedUser.getEmail(), updatedUser.getIsPublicByDefault(), 
                                        updatedUser.getCreatedAt());
            
            return ResponseEntity.ok(userDto);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request, 
                                          Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            String currentPassword = request.get("currentPassword");
            String newPassword = request.get("newPassword");
            
            if (currentPassword == null || newPassword == null) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Current password and new password are required");
                return ResponseEntity.badRequest().body(error);
            }
            
            userService.changePassword(user.getId(), currentPassword, newPassword);
            
            Map<String, String> success = new HashMap<>();
            success.put("message", "Password changed successfully");
            return ResponseEntity.ok(success);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
