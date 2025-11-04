package com.resumebuilder.controller;

import com.resumebuilder.service.AIService;
import com.resumebuilder.service.JobParserService;
import com.resumebuilder.service.RateLimiterService;
import com.resumebuilder.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    @Autowired
    private AIService aiService;

    @Autowired
    private JobParserService jobParserService;

    @Autowired
    private RateLimiterService rateLimiterService;

    @Autowired
    private UserService userService;

    @PostMapping("/summary")
    public ResponseEntity<?> generateSummary(@RequestBody Map<String, Object> payload, Authentication authentication) {
        try {
            Long userId = userService.findByEmail(authentication.getName()).map(u -> u.getId()).orElse(0L);
            String result;
            if (!rateLimiterService.withinFreeLimit(userId)) {
                result = aiService.callHuggingFace("[limit-exceeded] " + String.valueOf(payload));
            } else {
                result = aiService.generateProfessionalSummary(payload);
            }
            rateLimiterService.recordCall(userId, "/ai/summary", null, true, "primaryOrFallback", null);
            Map<String, String> res = new HashMap<>();
            res.put("summary", result);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Spec alias: /api/ai/generate-summary
    @PostMapping("/generate-summary")
    public ResponseEntity<?> generateSummarySpec(@RequestBody Map<String, Object> payload, Authentication authentication) {
        return generateSummary(payload, authentication);
    }

    @PostMapping("/skills")
    public ResponseEntity<?> suggestSkills(@RequestBody Map<String, Object> payload, Authentication authentication) {
        try {
            Long userId = userService.findByEmail(authentication.getName()).map(u -> u.getId()).orElse(0L);
            String result;
            if (!rateLimiterService.withinFreeLimit(userId)) {
                result = aiService.callHuggingFace("[limit-exceeded] " + String.valueOf(payload));
            } else {
                result = aiService.suggestSkillsWithATS(payload);
            }
            rateLimiterService.recordCall(userId, "/ai/skills", null, true, "primaryOrFallback", null);
            Map<String, String> res = new HashMap<>();
            res.put("skills", result);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Spec alias
    @PostMapping("/suggest-skills")
    public ResponseEntity<?> suggestSkillsSpec(@RequestBody Map<String, Object> payload, Authentication authentication) {
        return suggestSkills(payload, authentication);
    }

    @PostMapping("/ats-optimize")
    public ResponseEntity<?> optimizeForATS(@RequestBody Map<String, Object> payload, Authentication authentication) {
        try {
            Long userId = userService.findByEmail(authentication.getName()).map(u -> u.getId()).orElse(0L);
            String result;
            if (!rateLimiterService.withinFreeLimit(userId)) {
                result = aiService.callHuggingFace("[limit-exceeded] " + String.valueOf(payload));
            } else {
                result = aiService.optimizeBulletsForATS(payload);
            }
            rateLimiterService.recordCall(userId, "/ai/ats-optimize", null, true, "primaryOrFallback", null);
            Map<String, String> res = new HashMap<>();
            res.put("optimized", result);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/rewrite-bullets")
    public ResponseEntity<?> rewriteBullets(@RequestBody Map<String, Object> payload, Authentication authentication) {
        try {
            Long userId = userService.findByEmail(authentication.getName()).map(u -> u.getId()).orElse(0L);
            String result;
            if (!rateLimiterService.withinFreeLimit(userId)) {
                result = aiService.callHuggingFace("[limit-exceeded] " + String.valueOf(payload));
            } else {
                result = aiService.optimizeBulletsForATS(payload);
            }
            rateLimiterService.recordCall(userId, "/ai/rewrite-bullets", null, true, "primaryOrFallback", null);
            Map<String, String> res = new HashMap<>();
            res.put("rewrites", result);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/ats-score")
    public ResponseEntity<?> atsScore(@RequestBody Map<String, Object> payload, Authentication authentication) {
        try {
            Long userId = userService.findByEmail(authentication.getName()).map(u -> u.getId()).orElse(0L);
            String result;
            if (!rateLimiterService.withinFreeLimit(userId)) {
                result = aiService.callHuggingFace("[limit-exceeded] " + String.valueOf(payload));
            } else {
                result = aiService.atsOptimize(payload);
            }
            rateLimiterService.recordCall(userId, "/ai/ats-score", null, true, "primaryOrFallback", null);
            Map<String, String> res = new HashMap<>();
            res.put("ats", result);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/parse-job")
    public ResponseEntity<?> parseJob(@RequestBody Map<String, Object> payload) {
        try {
            String text = (String) payload.getOrDefault("text", "");
            Map<String, Object> parsed = jobParserService.parse(text);
            Map<String, Object> res = new HashMap<>();
            res.put("parsedText", text);
            res.put("parsed", parsed);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}


