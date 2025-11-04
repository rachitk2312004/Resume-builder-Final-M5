package com.resumebuilder.controller;

import com.resumebuilder.dto.PortfolioDto;
import com.resumebuilder.dto.PortfolioTemplateDto;
import com.resumebuilder.entity.Portfolio;
import com.resumebuilder.entity.User;
import com.resumebuilder.repository.PortfolioRepository;
import com.resumebuilder.service.PortfolioService;
import com.resumebuilder.service.PortfolioTemplateService;
import com.resumebuilder.service.PortfolioAnalyticsService;
import com.resumebuilder.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/portfolios")
@CrossOrigin(origins = "*")
public class PortfolioController {
    
    @Autowired
    private PortfolioService portfolioService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private PortfolioTemplateService templateService;
    
    @Autowired
    private PortfolioAnalyticsService analyticsService;
    
    @Autowired
    private PortfolioRepository portfolioRepository;
    
    @GetMapping
    public ResponseEntity<?> getUserPortfolios(Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            List<Portfolio> portfolios = portfolioService.getUserPortfolios(user);
            List<PortfolioDto> portfolioDtos = portfolios.stream()
                    .map(PortfolioDto::new)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(portfolioDtos);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getPortfolio(@PathVariable Long id, Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Portfolio portfolio = portfolioService.getPortfolioById(id, user)
                    .orElseThrow(() -> new RuntimeException("Portfolio not found"));
            
            return ResponseEntity.ok(new PortfolioDto(portfolio));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createPortfolio(@RequestBody Map<String, Object> request, 
                                           Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            String title = request.get("title") != null ? request.get("title").toString() : null;
            if (title == null || title.trim().isEmpty()) {
                title = "New Portfolio";
            }
            
            String templateId = request.get("templateId") != null ? request.get("templateId").toString() : "modern";
            String jsonContent = request.get("jsonContent") != null ? request.get("jsonContent").toString() : null;
            
            Portfolio portfolio = portfolioService.createPortfolio(user, title);
            portfolio.setTemplateId(templateId);
            if (jsonContent != null) {
                portfolio.setJsonContent(jsonContent);
            }
            portfolio = portfolioRepository.save(portfolio);
            
            return ResponseEntity.ok(new PortfolioDto(portfolio));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePortfolio(@PathVariable Long id, 
                                           @RequestBody Map<String, Object> updates,
                                           Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Portfolio portfolio = portfolioService.updatePortfolio(id, user, updates);
            return ResponseEntity.ok(new PortfolioDto(portfolio));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/{id}/duplicate")
    public ResponseEntity<?> duplicatePortfolio(@PathVariable Long id, Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Portfolio portfolio = portfolioService.duplicatePortfolio(id, user);
            return ResponseEntity.ok(new PortfolioDto(portfolio));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePortfolio(@PathVariable Long id, Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            portfolioService.deletePortfolio(id, user);
            
            Map<String, String> success = new HashMap<>();
            success.put("message", "Portfolio deleted successfully");
            return ResponseEntity.ok(success);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/public/{publicLink}")
    public ResponseEntity<?> getPublicPortfolio(@PathVariable String publicLink, HttpServletRequest request) {
        try {
            Portfolio portfolio = portfolioService.getPublicPortfolio(publicLink)
                    .orElseThrow(() -> new RuntimeException("Portfolio not found"));
            
            // Track view
            String ipAddress = getClientIpAddress(request);
            String userAgent = request.getHeader("User-Agent");
            String referrer = request.getHeader("Referer");
            analyticsService.trackView(portfolio, ipAddress, userAgent, referrer);
            
            return ResponseEntity.ok(new PortfolioDto(portfolio));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/slug/{slug}")
    public ResponseEntity<?> getPortfolioBySlug(@PathVariable String slug, HttpServletRequest request) {
        try {
            Portfolio portfolio = portfolioService.getPortfolioBySlug(slug)
                    .orElseThrow(() -> new RuntimeException("Portfolio not found"));
            
            if (!portfolio.getIsPublic()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Portfolio is not public");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Track view
            String ipAddress = getClientIpAddress(request);
            String userAgent = request.getHeader("User-Agent");
            String referrer = request.getHeader("Referer");
            analyticsService.trackView(portfolio, ipAddress, userAgent, referrer);
            
            return ResponseEntity.ok(new PortfolioDto(portfolio));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/from-resume")
    public ResponseEntity<?> createPortfolioFromResume(@RequestBody Map<String, Object> request, 
                                                       Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Long resumeId = Long.valueOf(request.get("resumeId").toString());
            String title = (String) request.get("title");
            String templateId = (String) request.get("templateId");
            
            if (title == null || title.trim().isEmpty()) {
                title = "Portfolio from Resume";
            }
            
            Portfolio portfolio = portfolioService.createPortfolioFromResume(user, resumeId, title, templateId);
            return ResponseEntity.ok(new PortfolioDto(portfolio));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PutMapping("/{id}/slug")
    public ResponseEntity<?> updatePortfolioSlug(@PathVariable Long id, 
                                                @RequestBody Map<String, String> request,
                                                Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            String slug = request.get("slug");
            if (slug == null || slug.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Slug is required");
                return ResponseEntity.badRequest().body(error);
            }
            
            Portfolio portfolio = portfolioService.updatePortfolioSlug(id, user, slug);
            return ResponseEntity.ok(new PortfolioDto(portfolio));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/{id}/publish")
    public ResponseEntity<?> publishPortfolio(@PathVariable Long id, Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Portfolio portfolio = portfolioService.publishPortfolio(id, user);
            return ResponseEntity.ok(new PortfolioDto(portfolio));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PostMapping("/{id}/unpublish")
    public ResponseEntity<?> unpublishPortfolio(@PathVariable Long id, Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Portfolio portfolio = portfolioService.unpublishPortfolio(id, user);
            return ResponseEntity.ok(new PortfolioDto(portfolio));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/{id}/analytics")
    public ResponseEntity<?> getPortfolioAnalytics(@PathVariable Long id, Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Portfolio portfolio = portfolioService.getPortfolioById(id, user)
                    .orElseThrow(() -> new RuntimeException("Portfolio not found"));
            
            Map<String, Object> analytics = analyticsService.getPortfolioAnalytics(portfolio);
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @GetMapping("/{id}/analytics/chart")
    public ResponseEntity<?> getPortfolioAnalyticsChart(@PathVariable Long id, 
                                                       @RequestParam(defaultValue = "7") int days,
                                                       Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Portfolio portfolio = portfolioService.getPortfolioById(id, user)
                    .orElseThrow(() -> new RuntimeException("Portfolio not found"));
            
            Map<String, Long> chartData = analyticsService.getViewsChartData(portfolio, days);
            return ResponseEntity.ok(chartData);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
}
