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
import java.util.Map;
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
    
    public Portfolio updatePortfolio(Long id, User user, Map<String, Object> updates) {
        Portfolio portfolio = portfolioRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));
        
        if (updates.containsKey("title")) {
            portfolio.setTitle((String) updates.get("title"));
        }
        if (updates.containsKey("jsonContent")) {
            portfolio.setJsonContent((String) updates.get("jsonContent"));
        }
        if (updates.containsKey("templateId")) {
            portfolio.setTemplateId((String) updates.get("templateId"));
        }
        if (updates.containsKey("status")) {
            String statusStr = updates.get("status").toString();
            portfolio.setStatus(Portfolio.Status.valueOf(statusStr));
        }
        if (updates.containsKey("isPublic")) {
            Boolean isPublic = (Boolean) updates.get("isPublic");
            portfolio.setIsPublic(isPublic);
            if (isPublic && portfolio.getPublicLink() == null) {
                portfolio.setPublicLink(UUID.randomUUID().toString());
            } else if (!isPublic) {
                portfolio.setPublicLink(null);
            }
        }
        if (updates.containsKey("slug")) {
            String slug = (String) updates.get("slug");
            if (slug != null && !slug.trim().isEmpty()) {
                portfolio.setSlug(slug);
            }
        }
        if (updates.containsKey("seoTitle")) {
            portfolio.setSeoTitle((String) updates.get("seoTitle"));
        }
        if (updates.containsKey("seoDescription")) {
            portfolio.setSeoDescription((String) updates.get("seoDescription"));
        }
        if (updates.containsKey("seoImageUrl")) {
            portfolio.setSeoImageUrl((String) updates.get("seoImageUrl"));
        }
        
        return portfolioRepository.save(portfolio);
    }
    
    public Portfolio duplicatePortfolio(Long id, User user) {
        Portfolio originalPortfolio = portfolioRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Portfolio not found"));
        
        Portfolio duplicatePortfolio = new Portfolio();
        duplicatePortfolio.setUser(user);
        duplicatePortfolio.setTitle(originalPortfolio.getTitle() + " (Copy)");
        duplicatePortfolio.setTemplateId(originalPortfolio.getTemplateId());
        duplicatePortfolio.setJsonContent(originalPortfolio.getJsonContent());
        duplicatePortfolio.setStatus(Portfolio.Status.IN_PROGRESS);
        duplicatePortfolio.setIsPublic(false);
        duplicatePortfolio.setSlug(generateUniqueSlug(duplicatePortfolio.getTitle()));
        duplicatePortfolio.setSeoTitle(originalPortfolio.getSeoTitle());
        duplicatePortfolio.setSeoDescription(originalPortfolio.getSeoDescription());
        duplicatePortfolio.setSeoImageUrl(originalPortfolio.getSeoImageUrl());
        
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
        try {
            if (resumeJson == null || resumeJson.trim().isEmpty()) {
                return "{\"name\": \"\", \"title\": \"\", \"about\": \"\", \"email\": \"\", \"phone\": \"\", \"location\": \"\", \"website\": \"\", \"github\": \"\", \"linkedin\": \"\", \"experience\": [], \"projects\": [], \"skills\": [], \"education\": [], \"certifications\": []}";
            }
            
            // Parse the resume JSON
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            com.fasterxml.jackson.databind.JsonNode resumeNode = mapper.readTree(resumeJson);
            
            // Create a new JSON object for portfolio
            com.fasterxml.jackson.databind.node.ObjectNode portfolioNode = mapper.createObjectNode();
            
            // Map personal information
            portfolioNode.put("name", resumeNode.has("name") ? resumeNode.get("name").asText("") : "");
            portfolioNode.put("title", resumeNode.has("title") ? resumeNode.get("title").asText("") : "");
            portfolioNode.put("about", resumeNode.has("summary") || resumeNode.has("about") 
                ? (resumeNode.has("summary") ? resumeNode.get("summary").asText("") : resumeNode.get("about").asText("")) : "");
            portfolioNode.put("email", resumeNode.has("email") ? resumeNode.get("email").asText("") : "");
            portfolioNode.put("phone", resumeNode.has("phone") ? resumeNode.get("phone").asText("") : "");
            portfolioNode.put("location", resumeNode.has("location") || resumeNode.has("address")
                ? (resumeNode.has("location") ? resumeNode.get("location").asText("") : resumeNode.get("address").asText("")) : "");
            portfolioNode.put("website", resumeNode.has("website") ? resumeNode.get("website").asText("") : "");
            portfolioNode.put("github", resumeNode.has("github") ? resumeNode.get("github").asText("") : "");
            portfolioNode.put("linkedin", resumeNode.has("linkedin") ? resumeNode.get("linkedin").asText("") : "");
            
            // Map experience (may be under "workExperience" or "experience")
            com.fasterxml.jackson.databind.JsonNode workExp = resumeNode.has("workExperience") ? resumeNode.get("workExperience") : 
                                                             (resumeNode.has("experience") ? resumeNode.get("experience") : 
                                                              mapper.createArrayNode());
            portfolioNode.set("experience", workExp.isArray() ? workExp : mapper.createArrayNode());
            
            // Map projects
            com.fasterxml.jackson.databind.JsonNode projects = resumeNode.has("projects") ? resumeNode.get("projects") : 
                                                              mapper.createArrayNode();
            portfolioNode.set("projects", projects.isArray() ? projects : mapper.createArrayNode());
            
            // Map skills (may be under "technicalSkills" or "skills")
            com.fasterxml.jackson.databind.JsonNode skills = resumeNode.has("technicalSkills") ? resumeNode.get("technicalSkills") : 
                                                            (resumeNode.has("skills") ? resumeNode.get("skills") : 
                                                             mapper.createArrayNode());
            portfolioNode.set("skills", skills.isArray() ? skills : mapper.createArrayNode());
            
            // Map education
            com.fasterxml.jackson.databind.JsonNode education = resumeNode.has("education") ? resumeNode.get("education") : 
                                                                mapper.createArrayNode();
            portfolioNode.set("education", education.isArray() ? education : mapper.createArrayNode());
            
            // Map certifications
            com.fasterxml.jackson.databind.JsonNode certifications = resumeNode.has("certifications") ? resumeNode.get("certifications") : 
                                                                     mapper.createArrayNode();
            portfolioNode.set("certifications", certifications.isArray() ? certifications : mapper.createArrayNode());
            
            return mapper.writeValueAsString(portfolioNode);
        } catch (Exception e) {
            System.err.println("Error converting resume to portfolio JSON: " + e.getMessage());
            return "{\"name\": \"\", \"title\": \"\", \"about\": \"\", \"email\": \"\", \"phone\": \"\", \"location\": \"\", \"website\": \"\", \"github\": \"\", \"linkedin\": \"\", \"experience\": [], \"projects\": [], \"skills\": [], \"education\": [], \"certifications\": []}";
        }
    }
}
