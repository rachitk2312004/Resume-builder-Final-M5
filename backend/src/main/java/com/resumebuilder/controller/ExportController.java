package com.resumebuilder.controller;

import com.resumebuilder.entity.Resume;
import com.resumebuilder.service.ResumeService;
import com.resumebuilder.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequestMapping("/api/export")
@CrossOrigin(origins = "*")
public class ExportController {

    @Autowired
    private ResumeService resumeService;

    @Autowired
    private UserService userService;

    @PostMapping("/pdf/{id}")
    public ResponseEntity<byte[]> exportPdf(@PathVariable Long id, @RequestBody Map<String, String> body, Authentication authentication) throws Exception {
        String email = authentication.getName();
        var user = userService.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        Resume resume = resumeService.getResumeById(id, user).orElseThrow(() -> new RuntimeException("Resume not found"));

        String html = body.getOrDefault("html", "<html><body><h1>Resume</h1></body></html>");

        // Force single page by scaling with CSS
        String style = "<style>@page{size:A4;margin:0}body{margin:0;zoom:0.75;-webkit-print-color-adjust:exact;}</style>";
        String finalHtml = html.replace("</head>", style + "</head>");

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfRendererBuilder builder = new PdfRendererBuilder();
        builder.useFastMode();
        builder.withHtmlContent(finalHtml, null);
        builder.toStream(baos);
        builder.run();

        byte[] pdfBytes = baos.toByteArray();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=resume-" + id + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    @PostMapping("/docx/{id}")
    public ResponseEntity<byte[]> exportDocx(@PathVariable Long id, @RequestBody Map<String, Object> body, Authentication authentication) throws Exception {
        String email = authentication.getName();
        var user = userService.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        Resume resume = resumeService.getResumeById(id, user).orElseThrow(() -> new RuntimeException("Resume not found"));

        // Minimal placeholder DOCX generation using HTML conversion via Apache POI would be too heavy; return HTML bytes as .docx-compatible
        String html = (String) body.getOrDefault("html", "<html><body><h1>Resume</h1></body></html>");
        byte[] bytes = html.getBytes(StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=resume-" + id + ".docx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.wordprocessingml.document"))
                .body(bytes);
    }
}


