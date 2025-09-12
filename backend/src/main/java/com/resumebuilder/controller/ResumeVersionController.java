package com.resumebuilder.controller;

import com.resumebuilder.entity.Resume;
import com.resumebuilder.entity.ResumeVersion;
import com.resumebuilder.service.ResumeService;
import com.resumebuilder.service.ResumeVersionService;
import com.resumebuilder.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resumes/{resumeId}/versions")
@CrossOrigin(origins = "*")
public class ResumeVersionController {

    @Autowired
    private ResumeVersionService versionService;

    @Autowired
    private ResumeService resumeService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<?> saveVersion(@PathVariable Long resumeId, Authentication authentication) {
        try {
            // Access control: ensure resume belongs to user
            String email = authentication.getName();
            var user = userService.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
            Resume resume = resumeService.getResumeById(resumeId, user)
                    .orElseThrow(() -> new RuntimeException("Resume not found"));

            ResumeVersion version = versionService.saveSnapshot(resume.getId());
            return ResponseEntity.ok(version);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping
    public ResponseEntity<?> listVersions(@PathVariable Long resumeId, Authentication authentication) {
        try {
            String email = authentication.getName();
            var user = userService.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
            resumeService.getResumeById(resumeId, user)
                    .orElseThrow(() -> new RuntimeException("Resume not found"));

            List<ResumeVersion> versions = versionService.listVersions(resumeId);
            return ResponseEntity.ok(versions);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/{versionId}/restore")
    public ResponseEntity<?> restoreVersion(@PathVariable Long resumeId, @PathVariable Long versionId,
                                            Authentication authentication) {
        try {
            String email = authentication.getName();
            var user = userService.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
            resumeService.getResumeById(resumeId, user)
                    .orElseThrow(() -> new RuntimeException("Resume not found"));

            Resume updated = versionService.restoreVersion(resumeId, versionId);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}


