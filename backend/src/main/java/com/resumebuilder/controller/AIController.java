package com.resumebuilder.controller;

import com.resumebuilder.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    @Autowired
    private AIService aiService;

    @PostMapping("/summary")
    public ResponseEntity<?> generateSummary(@RequestBody Map<String, Object> payload) {
        try {
            String result = aiService.generateProfessionalSummary(payload);
            Map<String, String> res = new HashMap<>();
            res.put("summary", result);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/skills")
    public ResponseEntity<?> suggestSkills(@RequestBody Map<String, Object> payload) {
        try {
            String result = aiService.suggestSkillsWithATS(payload);
            Map<String, String> res = new HashMap<>();
            res.put("skills", result);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/ats-optimize")
    public ResponseEntity<?> optimizeForATS(@RequestBody Map<String, Object> payload) {
        try {
            String result = aiService.optimizeBulletsForATS(payload);
            Map<String, String> res = new HashMap<>();
            res.put("optimized", result);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}


