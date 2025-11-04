package com.resumebuilder.controller;

import com.resumebuilder.service.JobParserService;
import com.resumebuilder.service.VisionOCRService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ocr")
@CrossOrigin(origins = "*")
public class OcrController {

    private final VisionOCRService visionOCRService;
    private final JobParserService jobParserService;

    public OcrController(VisionOCRService visionOCRService, JobParserService jobParserService) {
        this.visionOCRService = visionOCRService;
        this.jobParserService = jobParserService;
    }

    @PostMapping("/parse-jd")
    public ResponseEntity<?> parseJobDescription(@RequestParam("file") MultipartFile file) {
        try {
            Map<String, Object> ocrResult = visionOCRService.extractTextWithMetadata(file);
            String text = (String) ocrResult.get("text");
            Map<String, Object> parsed = jobParserService.parse(text);
            Map<String, Object> res = new HashMap<>();
            res.put("parsedText", text);
            res.put("parsed", parsed);
            res.put("filename", file.getOriginalFilename());
            res.put("confidence", ocrResult.get("confidence"));
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Spec alias
    @PostMapping("/upload")
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile file) {
        return parseJobDescription(file);
    }
}


