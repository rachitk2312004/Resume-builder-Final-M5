package com.resumebuilder.controller;

import com.opencsv.CSVWriter;
import com.opencsv.bean.StatefulBeanToCsv;
import com.opencsv.bean.StatefulBeanToCsvBuilder;
import com.resumebuilder.entity.AiLog;
import com.resumebuilder.repository.AiLogRepository;
import com.resumebuilder.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai/logs")
@CrossOrigin(origins = "*")
public class AiLogController {

    @Autowired
    private AiLogRepository aiLogRepository;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<?> getLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication) {
        try {
            Long userId = userService.findByEmail(authentication.getName())
                    .map(u -> u.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Pageable pageable = PageRequest.of(page, size);
            Page<AiLog> logs = aiLogRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("logs", logs.getContent());
            response.put("totalElements", logs.getTotalElements());
            response.put("totalPages", logs.getTotalPages());
            response.put("currentPage", logs.getNumber());
            response.put("size", logs.getSize());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/export")
    public void exportLogs(HttpServletResponse response, Authentication authentication) throws IOException {
        try {
            Long userId = userService.findByEmail(authentication.getName())
                    .map(u -> u.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<AiLog> logs = aiLogRepository.findByUserIdOrderByCreatedAtDesc(userId);

            response.setContentType("text/csv");
            response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"ai_logs.csv\"");

            StatefulBeanToCsv<AiLog> writer = new StatefulBeanToCsvBuilder<AiLog>(response.getWriter())
                    .withQuotechar(CSVWriter.NO_QUOTE_CHARACTER)
                    .withSeparator(CSVWriter.DEFAULT_SEPARATOR)
                    .withOrderedResults(false)
                    .build();

            writer.write(logs);
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("Error exporting logs: " + e.getMessage());
        }
    }
}

