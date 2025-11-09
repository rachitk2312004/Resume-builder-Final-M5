package com.resumebuilder.controller;

import com.resumebuilder.entity.Resume;
import com.resumebuilder.service.ExportService;
import com.resumebuilder.service.ResumeService;
import com.resumebuilder.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/export")
@CrossOrigin(origins = "*")
public class ExportController {

    @Autowired
    private ResumeService resumeService;

    @Autowired
    private UserService userService;

    @Autowired
    private ExportService exportService;

    @PostMapping("/pdf/{id}")
    public ResponseEntity<?> exportPdf(@PathVariable Long id, @RequestBody Map<String, String> body, Authentication authentication) {
        try {
            String email = authentication.getName();
            var user = userService.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
            Resume resume = resumeService.getResumeById(id, user).orElseThrow(() -> new RuntimeException("Resume not found"));

            String html = body.getOrDefault("html", "");
            if (html == null || html.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "No HTML content provided for export");
                return ResponseEntity.status(400)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(error);
            }

            byte[] pdfBytes = exportService.generatePdf(html);
            exportService.logExport(user.getId(), id, null, "PDF", (long) pdfBytes.length, false);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=resume-" + id + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);
        } catch (Exception e) {
            System.err.println("Error exporting PDF: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            String errorMessage = e.getMessage() != null ? e.getMessage() : "Unknown error occurred";
            if (errorMessage.contains("HTML content is empty")) {
                error.put("error", "No content to export. Please add some content to your resume first.");
            } else {
                error.put("error", "Failed to generate PDF: " + errorMessage);
            }
            return ResponseEntity.status(500)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(error);
        }
    }

    @PostMapping("/docx/{id}")
    public ResponseEntity<?> exportDocx(@PathVariable Long id, @RequestBody Map<String, Object> body, Authentication authentication) {
        try {
            String email = authentication.getName();
            var user = userService.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
            Resume resume = resumeService.getResumeById(id, user).orElseThrow(() -> new RuntimeException("Resume not found"));

            String html = (String) body.getOrDefault("html", "");
            if (html == null || html.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "No HTML content provided for export");
                return ResponseEntity.status(400)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(error);
            }

            byte[] docxBytes = exportService.generateDocx(html);
            exportService.logExport(user.getId(), id, null, "DOCX", (long) docxBytes.length, false);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=resume-" + id + ".docx")
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.wordprocessingml.document"))
                    .body(docxBytes);
        } catch (Exception e) {
            System.err.println("Error exporting DOCX: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            String errorMessage = e.getMessage() != null ? e.getMessage() : "Unknown error occurred";
            if (errorMessage.contains("HTML content is empty")) {
                error.put("error", "No content to export. Please add some content to your resume first.");
            } else {
                error.put("error", "Failed to generate DOCX: " + errorMessage);
            }
            return ResponseEntity.status(500)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(error);
        }
    }

    @PostMapping("/text/{id}")
    public ResponseEntity<?> exportText(@PathVariable Long id, @RequestBody Map<String, String> body, Authentication authentication) {
        try {
            String email = authentication.getName();
            var user = userService.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
            Resume resume = resumeService.getResumeById(id, user).orElseThrow(() -> new RuntimeException("Resume not found"));

            String html = body.getOrDefault("html", "");
            if (html == null || html.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "No HTML content provided for export");
                return ResponseEntity.status(400)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(error);
            }

            String text = exportService.generateText(html);
            exportService.logExport(user.getId(), id, null, "TEXT", (long) text.getBytes(StandardCharsets.UTF_8).length, false);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=resume-" + id + ".txt")
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(text);
        } catch (Exception e) {
            System.err.println("Error exporting TEXT: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            String errorMessage = e.getMessage() != null ? e.getMessage() : "Unknown error occurred";
            if (errorMessage.contains("HTML content is empty")) {
                error.put("error", "No content to export. Please add some content to your resume first.");
            } else {
                error.put("error", "Failed to generate text: " + errorMessage);
            }
            return ResponseEntity.status(500)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(error);
        }
    }

    @PostMapping("/email/{id}")
    public ResponseEntity<?> exportEmail(@PathVariable Long id, @RequestBody Map<String, String> body, Authentication authentication) {
        try {
            String email = authentication.getName();
            var user = userService.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
            Resume resume = resumeService.getResumeById(id, user).orElseThrow(() -> new RuntimeException("Resume not found"));

            String html = body.getOrDefault("html", "<html><body><h1>Resume</h1></body></html>");
            String exportType = body.getOrDefault("type", "PDF");
            String recipientEmail = body.getOrDefault("email", user.getEmail());

            byte[] fileBytes;
            String fileName;
            String fileType;

            if ("DOCX".equalsIgnoreCase(exportType)) {
                fileBytes = exportService.generateDocx(html);
                fileName = "resume-" + id + ".docx";
                fileType = "docx";
            } else if ("TEXT".equalsIgnoreCase(exportType)) {
                String text = exportService.generateText(html);
                fileBytes = text.getBytes(StandardCharsets.UTF_8);
                fileName = "resume-" + id + ".txt";
                fileType = "txt";
            } else {
                fileBytes = exportService.generatePdf(html);
                fileName = "resume-" + id + ".pdf";
                fileType = "pdf";
            }

            exportService.sendExportEmail(recipientEmail, "Your Resume Export", fileBytes, fileName, fileType);
            exportService.logExport(user.getId(), id, null, exportType, (long) fileBytes.length, true);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Export sent to " + recipientEmail);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/share/{id}")
    public ResponseEntity<?> createShareLink(@PathVariable Long id, @RequestBody Map<String, String> body, Authentication authentication) {
        try {
            String email = authentication.getName();
            var user = userService.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
            Resume resume = resumeService.getResumeById(id, user).orElseThrow(() -> new RuntimeException("Resume not found"));

            // Make resume public if not already
            if (!resume.getIsPublic()) {
                resume.setIsPublic(true);
                if (resume.getPublicLink() == null || resume.getPublicLink().isEmpty()) {
                    resume.setPublicLink("resume-" + id + "-" + System.currentTimeMillis());
                }
                resumeService.updateResume(id, user, resume.getTitle(), resume.getJsonContent(), resume.getStatus(), true);
            }

            exportService.logExport(user.getId(), id, null, "SHARE", 0L, false);

            Map<String, String> response = new HashMap<>();
            response.put("shareLink", resume.getPublicLink());
            response.put("url", "/resume/" + resume.getPublicLink());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}


