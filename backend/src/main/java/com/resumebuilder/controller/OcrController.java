package com.resumebuilder.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ocr")
@CrossOrigin(origins = "*")
public class OcrController {

    @PostMapping("/parse-jd")
    public ResponseEntity<?> parseJobDescription(@RequestParam("file") MultipartFile file) {
        try {
            // Placeholder: In Module 3 we can integrate a real OCR service
            Map<String, Object> res = new HashMap<>();
            res.put("parsedText", "[OCR placeholder] Provide job description text here.");
            res.put("filename", file.getOriginalFilename());
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}


