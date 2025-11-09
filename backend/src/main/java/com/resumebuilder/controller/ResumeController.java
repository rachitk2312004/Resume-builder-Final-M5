package com.resumebuilder.controller;

import com.resumebuilder.dto.ResumeDto;
import com.resumebuilder.entity.Resume;
import com.resumebuilder.entity.User;
import com.resumebuilder.service.ResumeService;
import com.resumebuilder.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/resumes")
@CrossOrigin(origins = "*")
public class ResumeController {
    
    @Autowired
    private ResumeService resumeService;
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    public ResponseEntity<?> getUserResumes(Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            List<Resume> resumes = resumeService.getUserResumes(user);
            List<ResumeDto> resumeDtos = resumes != null ? resumes.stream()
                    .map(ResumeDto::new)
                    .collect(Collectors.toList()) : new ArrayList<>();
            
            return ResponseEntity.ok(resumeDtos);
        } catch (Exception e) {
            // Log the error for debugging
            System.err.println("Error fetching resumes: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage() != null ? e.getMessage() : "Failed to fetch resumes");
            return ResponseEntity.status(500).body(error);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getResume(@PathVariable Long id, Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Resume resume = resumeService.getResumeById(id, user)
                    .orElseThrow(() -> new RuntimeException("Resume not found"));
            
            return ResponseEntity.ok(new ResumeDto(resume));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createResume(@RequestBody Map<String, String> request, 
                                        Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            String title = request.get("title");
            if (title == null || title.trim().isEmpty()) {
                title = "New Resume";
            }
            
            Resume resume = resumeService.createResume(user, title);
            return ResponseEntity.ok(new ResumeDto(resume));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateResume(@PathVariable Long id, 
                                        @RequestBody Map<String, Object> updates,
                                        Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            String title = (String) updates.get("title");
            String jsonContent = (String) updates.get("jsonContent");
            Boolean isPublic = (Boolean) updates.get("isPublic");
            Object templateIdObj = updates.get("templateId");
            
            // Handle templateId if provided
            if (templateIdObj != null) {
                Integer templateId = null;
                if (templateIdObj instanceof Integer) {
                    templateId = (Integer) templateIdObj;
                } else if (templateIdObj instanceof Number) {
                    templateId = ((Number) templateIdObj).intValue();
                } else {
                    try {
                        templateId = Integer.parseInt(templateIdObj.toString());
                    } catch (NumberFormatException e) {
                        // Ignore invalid templateId
                    }
                }
                // Note: templateId handling would need to be added to ResumeService if needed
            }
            
            Resume.Status status = null;
            if (updates.get("status") != null) {
                try {
                    status = Resume.Status.valueOf(updates.get("status").toString());
                } catch (IllegalArgumentException e) {
                    // Invalid status, keep current status
                    System.err.println("Invalid status value: " + updates.get("status"));
                }
            }
            
            Resume resume = resumeService.updateResume(id, user, title, jsonContent, status, isPublic);
            return ResponseEntity.ok(new ResumeDto(resume));
        } catch (Exception e) {
            // Log error for debugging
            System.err.println("Error updating resume: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage() != null ? e.getMessage() : "Failed to update resume");
            return ResponseEntity.status(500).body(error);
        }
    }
    
    @PostMapping("/{id}/duplicate")
    public ResponseEntity<?> duplicateResume(@PathVariable Long id, Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Resume resume = resumeService.duplicateResume(id, user);
            return ResponseEntity.ok(new ResumeDto(resume));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteResume(@PathVariable Long id, Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            resumeService.deleteResume(id, user);
            
            Map<String, String> success = new HashMap<>();
            success.put("message", "Resume deleted successfully");
            return ResponseEntity.ok(success);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/public/{publicLink}")
    public ResponseEntity<?> getPublicResume(@PathVariable String publicLink) {
        try {
            Resume resume = resumeService.getPublicResume(publicLink)
                    .orElseThrow(() -> new RuntimeException("Resume not found"));
            
            return ResponseEntity.ok(new ResumeDto(resume));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
