package com.resumebuilder.service;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import com.resumebuilder.entity.ExportLog;
import com.resumebuilder.repository.ExportLogRepository;
import org.apache.poi.xwpf.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;

@Service
public class ExportService {

    @Autowired
    private ExportLogRepository exportLogRepository;

    @Autowired
    private EmailService emailService;

    /**
     * Sanitizes HTML content to fix XML parsing issues
     * Escapes unescaped & characters that aren't part of valid HTML entities
     * Uses character-by-character processing for reliable entity detection
     */
    private String sanitizeHtmlForXml(String html) {
        if (html == null) return "";
        
        StringBuilder result = new StringBuilder(html.length() + 100);
        int len = html.length();
        int i = 0;
        
        while (i < len) {
            char c = html.charAt(i);
            if (c == '&') {
                // Check if this is the start of a valid entity
                int entityStart = i;
                int j = i + 1;
                boolean foundSemicolon = false;
                
                // Look for semicolon (max 30 chars ahead for entity)
                while (j < len && j < i + 30) {
                    char next = html.charAt(j);
                    if (next == ';') {
                        foundSemicolon = true;
                        // Check if it's a valid entity
                        String entity = html.substring(i, j + 1);
                        // Check for named entities (at least 3 chars: &XX;)
                        if (entity.length() >= 4 && entity.matches("&[a-zA-Z][a-zA-Z0-9]*;")) {
                            // Valid named entity, keep it
                            result.append(entity);
                            i = j + 1;
                            break;
                        }
                        // Check for numeric entities &#123; or &#x1F;
                        if (entity.matches("&#[0-9]+;") || entity.matches("&#[xX][0-9a-fA-F]+;")) {
                            // Valid numeric entity, keep it
                            result.append(entity);
                            i = j + 1;
                            break;
                        }
                        // Found semicolon but not a valid entity, escape the &
                        result.append("&amp;");
                        i++;
                        break;
                    } else if (next == ' ' || next == '\n' || next == '\t' || next == '<' || next == '>') {
                        // Invalid: entity can't contain these characters, escape the &
                        result.append("&amp;");
                        i++;
                        break;
                    }
                    j++;
                }
                
                if (!foundSemicolon) {
                    // No semicolon found, escape the &
                    result.append("&amp;");
                    i++;
                }
            } else {
                result.append(c);
                i++;
            }
        }
        
        return result.toString();
    }

    public byte[] generatePdf(String html) throws IOException {
        try {
            if (html == null || html.trim().isEmpty()) {
                throw new IllegalArgumentException("HTML content is empty");
            }

            // Sanitize HTML to fix XML parsing issues (escape unescaped & characters)
            String originalHtml = html;
            html = sanitizeHtmlForXml(html);
            
            // Log if sanitization changed anything (for debugging)
            if (!originalHtml.equals(html)) {
                System.out.println("HTML sanitized: " + (originalHtml.length() - html.length()) + " characters changed");
            }

            // Ensure HTML has proper structure with PDF-friendly styles
            // Note: Removed zoom and adjusted margins to preserve two-column layouts
            String pdfStyle = "<style>" +
                "@page { size: A4; margin: 20mm 15mm; } " +
                "body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; } " +
                // Ensure grid layouts work in PDF
                ".two-col { display: grid !important; grid-template-columns: 34% 66% !important; gap: 16px !important; } " +
                ".grid-3 { display: grid !important; grid-template-columns: repeat(3, 1fr) !important; gap: 12px !important; } " +
                ".grid-2 { display: grid !important; grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; } " +
                // Prevent page breaks inside sections
                ".section { page-break-inside: avoid; } " +
                ".item { page-break-inside: avoid; } " +
                "</style>";
            String finalHtml = html;
            
            // Add HTML/head/body tags if missing
            if (!finalHtml.toLowerCase().contains("<html")) {
                finalHtml = "<!DOCTYPE html><html><head>" + pdfStyle + "</head><body>" + finalHtml + "</body></html>";
            } else {
                // Add style to existing head (before closing </head> tag to preserve existing styles)
                if (finalHtml.contains("</head>")) {
                    finalHtml = finalHtml.replace("</head>", pdfStyle + "</head>");
                } else if (finalHtml.contains("<head>")) {
                    finalHtml = finalHtml.replace("<head>", "<head>" + pdfStyle);
                } else {
                    // Insert head before body or html content
                    if (finalHtml.contains("<body")) {
                        finalHtml = finalHtml.replace("<body", "<head>" + pdfStyle + "</head><body");
                    } else {
                        finalHtml = finalHtml.replaceFirst("<html[^>]*>", "$0<head>" + pdfStyle + "</head>");
                    }
                }
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfRendererBuilder builder = new PdfRendererBuilder();
            // Disable fast mode for better layout support (especially for grid layouts)
            // builder.useFastMode(); // Commented out to preserve two-column layouts
            builder.withHtmlContent(finalHtml, null);
            builder.toStream(baos);
            builder.run();

            return baos.toByteArray();
        } catch (Exception e) {
            System.err.println("Error generating PDF: " + e.getMessage());
            e.printStackTrace();
            throw new IOException("Failed to generate PDF: " + e.getMessage(), e);
        }
    }

    public byte[] generateDocx(String html) throws IOException {
        // Parse HTML and convert to DOCX using Apache POI
        XWPFDocument document = new XWPFDocument();
        
        // Simple HTML to DOCX conversion
        // Remove HTML tags and extract text content
        String text = html.replaceAll("<[^>]+>", " ").replaceAll("\\s+", " ").trim();
        
        XWPFParagraph paragraph = document.createParagraph();
        XWPFRun run = paragraph.createRun();
        run.setText(text);
        
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        document.write(baos);
        document.close();
        
        return baos.toByteArray();
    }

    public String generateText(String html) {
        // Remove HTML tags and extract plain text
        String text = html.replaceAll("<[^>]+>", "\n");
        text = text.replaceAll("\n\\s*\n", "\n");
        text = text.replaceAll("\\s+", " ");
        return text.trim();
    }

    public void logExport(Long userId, Long resumeId, Long portfolioId, String exportType, Long fileSize, boolean emailSent) {
        ExportLog log = new ExportLog();
        log.setUserId(userId);
        log.setResumeId(resumeId);
        log.setPortfolioId(portfolioId);
        log.setExportType(exportType);
        log.setFileSize(fileSize);
        log.setEmailSent(emailSent);
        log.setCreatedAt(Instant.now());
        exportLogRepository.save(log);
    }

    public void sendExportEmail(String toEmail, String subject, byte[] fileBytes, String fileName, String fileType) {
        emailService.sendExportEmail(toEmail, subject, fileBytes, fileName, fileType);
    }
}

