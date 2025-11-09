package com.resumebuilder.controller;

import com.resumebuilder.service.AdminService;
import com.resumebuilder.service.BackupService;
import com.resumebuilder.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/backup")
@CrossOrigin(origins = "*")
public class BackupController {

    @Autowired
    private BackupService backupService;

    @Autowired
    private UserService userService;

    private boolean isAdmin(Authentication authentication) {
        String email = authentication.getName();
        Long userId = userService.findByEmail(email)
                .map(u -> u.getId())
                .orElse(0L);
        return userService.findByEmail(email)
                .map(u -> "admin".equalsIgnoreCase(u.getRole()))
                .orElse(false);
    }

    @PostMapping("/manual")
    public ResponseEntity<?> manualBackup(Authentication authentication) {
        if (!isAdmin(authentication)) {
            return ResponseEntity.status(403).body(Map.of("error", "Admin access required"));
        }

        try {
            backupService.manualBackup();
            Map<String, String> response = new HashMap<>();
            response.put("message", "Backup completed successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}

