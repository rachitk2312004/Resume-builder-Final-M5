package com.resumebuilder.service;

import com.resumebuilder.entity.Portfolio;
import com.resumebuilder.entity.Resume;
import com.resumebuilder.entity.User;
import com.resumebuilder.repository.PortfolioRepository;
import com.resumebuilder.repository.ResumeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
@Transactional
public class PortfolioService {
    
    @Autowired
    private PortfolioRepository portfolioRepository;
    
    @Autowired
    private ResumeRepository resumeRepository;
    
    public Portfolio createPortfolio(User user, String title) {
        Portfolio portfolio = new Portfolio(user, title);
        portfolio.setIsPublic(user.getIsPublicByDefault());
        portfolio.setSlug(generateUniqueSlug(title));
        if (portfolio.getIsPublic()) {
            portfolio.setPublicLink(UUID.randomUUID().toString());
        }
        return portfolioRepository.save(portfolio);
    }
    
    public Portfolio createPortfolioFromResume(User user, Long resumeId, String title, String templateId) {
        Resume resume = resumeRepository.findByIdAndUser(resumeId, user)
                .orElseThrow(() -> new RuntimeException("Resume not found"));
        
        Portfolio portfolio = new Portfolio(user, title);
        portfolio.setTemplateId(templateId != null ? templateId : "modern");
        portfolio.setSlug(generateUniqueSlug(title));
        
        // Convert resume JSON to portfolio JSON
        String portfolioJson = convertResumeToPortfolioJson(resume.getJsonContent());
        portfolio.setJsonContent(portfolioJson);
        
        portfolio.setIsPublic(user.getIsPublicByDefault());
        if (portfolio.getIsPublic()) {
            portfolio.setPublicLink(UUID.randomUUID().toString());
        }
        
        return portfolioRepository.save(portfolio);
    }
    
    public List<Portfolio> getUserPortfolios(User user) {
        return portfolioRepository.findByUserOrderByUpdatedAtDesc(user);
    }
    
    public Optional<Portfolio> getPortfolioById(Long id, User user) {
        return portfolioRepository.findByIdAndUser(id, user);
    }
    
    public Portfolio updatePortfolio(Long id, User user, String title, String jsonContent, 
                                   Portfolio.Status status, Boolean isPublic) {
        Portfolio portfolio = portfolioRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));
        
        if (title != null) {
            portfolio.setTitle(title);
        }
        if (jsonContent != null) {
            portfolio.setJsonContent(jsonContent);
        }
        if (status != null) {
            portfolio.setStatus(status);
        }
        if (isPublic != null) {
            portfolio.setIsPublic(isPublic);
            if (isPublic && portfolio.getPublicLink() == null) {
                portfolio.setPublicLink(UUID.randomUUID().toString());
            } else if (!isPublic) {
                portfolio.setPublicLink(null);
            }
        }
        
        return portfolioRepository.save(portfolio);
    }
    
    public Portfolio duplicatePortfolio(Long id, User user) {
        Portfolio originalPortfolio = portfolioRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));
        
        Portfolio duplicatePortfolio = new Portfolio();
        duplicatePortfolio.setUser(user);
        duplicatePortfolio.setTitle(originalPortfolio.getTitle() + " (Copy)");
        duplicatePortfolio.setJsonContent(originalPortfolio.getJsonContent());
        duplicatePortfolio.setStatus(Portfolio.Status.IN_PROGRESS);
        duplicatePortfolio.setIsPublic(false);
        
        return portfolioRepository.save(duplicatePortfolio);
    }
    
    public void deletePortfolio(Long id, User user) {
        Portfolio portfolio = portfolioRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));
        portfolioRepository.delete(portfolio);
    }
    
    public Optional<Portfolio> getPublicPortfolio(String publicLink) {
        return portfolioRepository.findByPublicLink(publicLink);
    }
    
    public Optional<Portfolio> getPortfolioBySlug(String slug) {
        return portfolioRepository.findBySlug(slug);
    }
    
    public Portfolio updatePortfolioSlug(Long id, User user, String slug) {
        Portfolio portfolio = portfolioRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));
        
        if (portfolioRepository.existsBySlugAndIdNot(slug, id)) {
            throw new RuntimeException("Slug already exists");
        }
        
        portfolio.setSlug(slug);
        return portfolioRepository.save(portfolio);
    }
    
    public Portfolio publishPortfolio(Long id, User user) {
        Portfolio portfolio = portfolioRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));
        
        portfolio.setIsPublic(true);
        portfolio.setStatus(Portfolio.Status.COMPLETED);
        
        if (portfolio.getPublicLink() == null) {
            portfolio.setPublicLink(UUID.randomUUID().toString());
        }
        
        // Generate SEO metadata if not set
        if (portfolio.getSeoTitle() == null) {
            portfolio.setSeoTitle(portfolio.getTitle());
        }
        if (portfolio.getSeoDescription() == null) {
            portfolio.setSeoDescription("Professional portfolio of " + portfolio.getTitle());
        }
        
        return portfolioRepository.save(portfolio);
    }
    
    public Portfolio unpublishPortfolio(Long id, User user) {
        Portfolio portfolio = portfolioRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));
        
        portfolio.setIsPublic(false);
        portfolio.setPublicLink(null);
        
        return portfolioRepository.save(portfolio);
    }
    
    private String generateUniqueSlug(String title) {
        String baseSlug = title.toLowerCase()
                .replaceAll("[^a-z0-9\\s]", "")
                .replaceAll("\\s+", "-")
                .trim();
        
        String slug = baseSlug;
        int counter = 1;
        
        while (portfolioRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + counter;
            counter++;
        }
        
        return slug;
    }
    
    private String convertResumeToPortfolioJson(String resumeJson) {
        // This is a simplified conversion - in a real implementation,
        // you'd parse the resume JSON and transform it into portfolio format
        try {
            // Basic conversion logic - extract key information from resume
            // and structure it for portfolio display
            return resumeJson; // For now, return as-is
        } catch (Exception e) {
            return "{\"name\": \"\", \"title\": \"\", \"about\": \"\", \"experience\": [], \"projects\": [], \"skills\": []}";
        }
    }
}
