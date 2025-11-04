package com.resumebuilder.controller;

import com.opencsv.CSVWriter;
import com.opencsv.bean.StatefulBeanToCsv;
import com.opencsv.bean.StatefulBeanToCsvBuilder;
import com.resumebuilder.entity.AtsScore;
import com.resumebuilder.repository.AtsScoreRepository;
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
@RequestMapping("/api/ats")
@CrossOrigin(origins = "*")
public class AtsScoreController {

    @Autowired
    private AtsScoreRepository atsScoreRepository;

    @Autowired
    private UserService userService;

    @GetMapping("/history")
    public ResponseEntity<?> getHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication) {
        try {
            Long userId = userService.findByEmail(authentication.getName())
                    .map(u -> u.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Pageable pageable = PageRequest.of(page, size);
            Page<AtsScore> scores = atsScoreRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("scores", scores.getContent());
            response.put("totalElements", scores.getTotalElements());
            response.put("totalPages", scores.getTotalPages());
            response.put("currentPage", scores.getNumber());
            response.put("size", scores.getSize());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/history/export")
    public void exportHistory(HttpServletResponse response, Authentication authentication) throws IOException {
        try {
            Long userId = userService.findByEmail(authentication.getName())
                    .map(u -> u.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Pageable unpaged = PageRequest.of(0, Integer.MAX_VALUE);
            List<AtsScore> scores = atsScoreRepository.findByUserIdOrderByCreatedAtDesc(userId, unpaged).getContent();

            response.setContentType("text/csv");
            response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"ats_history.csv\"");

            StatefulBeanToCsv<AtsScore> writer = new StatefulBeanToCsvBuilder<AtsScore>(response.getWriter())
                    .withQuotechar(CSVWriter.NO_QUOTE_CHARACTER)
                    .withSeparator(CSVWriter.DEFAULT_SEPARATOR)
                    .withOrderedResults(false)
                    .build();

            writer.write(scores);
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("Error exporting history: " + e.getMessage());
        }
    }
}

