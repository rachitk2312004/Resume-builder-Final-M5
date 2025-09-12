package com.resumebuilder.controller;

import com.resumebuilder.dto.PortfolioTemplateDto;
import com.resumebuilder.service.PortfolioTemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/portfolio-templates")
@CrossOrigin(origins = "*")
public class PortfolioTemplateController {
    
    @Autowired
    private PortfolioTemplateService templateService;
    
    @GetMapping
    public ResponseEntity<?> getAllTemplates() {
        try {
            List<PortfolioTemplateDto> templates = templateService.getAllActiveTemplates();
            return ResponseEntity.ok(templates);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<?> getTemplatesByCategory(@PathVariable String category) {
        try {
            List<PortfolioTemplateDto> templates = templateService.getTemplatesByCategory(category);
            return ResponseEntity.ok(templates);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getTemplateById(@PathVariable String id) {
        try {
            return templateService.getTemplateById(id)
                    .map(template -> ResponseEntity.ok(template))
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/categories")
    public ResponseEntity<?> getTemplateCategories() {
        try {
            List<String> categories = templateService.getTemplateCategories();
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
