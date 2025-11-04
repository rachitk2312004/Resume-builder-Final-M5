package com.resumebuilder.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class OCRService {

    public String extractText(MultipartFile file) {
        // Placeholder: In production, integrate Google Vision API or forward to frontend Tesseract.js
        String filename = file != null ? file.getOriginalFilename() : "unknown";
        return "[OCR placeholder] Parsed text from: " + filename;
    }
}


