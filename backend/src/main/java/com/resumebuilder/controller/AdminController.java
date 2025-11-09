package com.resumebuilder.controller;

import com.resumebuilder.entity.*;
import com.resumebuilder.repository.*;
import com.resumebuilder.service.AdminService;
import com.resumebuilder.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private PortfolioTemplateRepository portfolioTemplateRepository;

    @Autowired
    private AdminLogRepository adminLogRepository;

    @Autowired
    private UserActivityLogRepository userActivityLogRepository;

    @Autowired
    private ExportLogRepository exportLogRepository;

    private boolean isAdmin(Authentication authentication) {
        String email = authentication.getName();
        Long userId = userService.findByEmail(email)
                .map(u -> u.getId())
                .orElse(0L);
        return adminService.isAdmin(userId);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard(Authentication authentication) {
        if (!isAdmin(authentication)) {
            return ResponseEntity.status(403).body(Map.of("error", "Admin access required"));
        }

        Map<String, Object> dashboard = adminService.getDashboardStats();
        return ResponseEntity.ok(dashboard);
    }

    @GetMapping("/users")
    public ResponseEntity<?> getUsers(Authentication authentication) {
        if (!isAdmin(authentication)) {
            return ResponseEntity.status(403).body(Map.of("error", "Admin access required"));
        }

        List<User> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/templates")
    public ResponseEntity<?> getTemplates(Authentication authentication) {
        if (!isAdmin(authentication)) {
            return ResponseEntity.status(403).body(Map.of("error", "Admin access required"));
        }

        List<PortfolioTemplate> templates = portfolioTemplateRepository.findAll();
        return ResponseEntity.ok(templates);
    }

    @PostMapping("/template/add")
    public ResponseEntity<?> addTemplate(@RequestBody PortfolioTemplate template, Authentication authentication) {
        if (!isAdmin(authentication)) {
            return ResponseEntity.status(403).body(Map.of("error", "Admin access required"));
        }

        String email = authentication.getName();
        Long userId = userService.findByEmail(email).map(u -> u.getId()).orElse(0L);
        
        PortfolioTemplate saved = portfolioTemplateRepository.save(template);
        // PortfolioTemplate.id is String, so we pass null for targetId and include id in details
        adminService.logAdminAction(userId, "ADD_TEMPLATE", "template", null, "Added template: " + saved.getName() + " (ID: " + saved.getId() + ")");

        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/template/{id}")
    public ResponseEntity<?> deleteTemplate(@PathVariable String id, Authentication authentication) {
        if (!isAdmin(authentication)) {
            return ResponseEntity.status(403).body(Map.of("error", "Admin access required"));
        }

        String email = authentication.getName();
        Long userId = userService.findByEmail(email).map(u -> u.getId()).orElse(0L);
        
        portfolioTemplateRepository.deleteById(id);
        adminService.logAdminAction(userId, "DELETE_TEMPLATE", "template", null, "Deleted template: " + id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Template deleted");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/logs")
    public ResponseEntity<?> getLogs(Authentication authentication) {
        if (!isAdmin(authentication)) {
            return ResponseEntity.status(403).body(Map.of("error", "Admin access required"));
        }

        String email = authentication.getName();
        Long userId = userService.findByEmail(email).map(u -> u.getId()).orElse(0L);
        
        List<AdminLog> logs = adminService.getAdminLogs(userId);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/analytics")
    public ResponseEntity<?> getAnalytics(Authentication authentication) {
        if (!isAdmin(authentication)) {
            return ResponseEntity.status(403).body(Map.of("error", "Admin access required"));
        }

        Map<String, Object> analytics = adminService.getDashboardStats();
        
        // Add additional analytics
        analytics.put("activeUsersLast30Days", userActivityLogRepository.count());
        analytics.put("totalExportsLast30Days", exportLogRepository.count());
        
        return ResponseEntity.ok(analytics);
    }
}

