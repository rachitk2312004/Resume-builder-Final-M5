package com.resumebuilder.dto;

import com.resumebuilder.entity.PortfolioTemplate;
import java.time.LocalDateTime;

public class PortfolioTemplateDto {
    
    private String id;
    private String name;
    private String description;
    private String previewImageUrl;
    private String category;
    private Boolean isActive;
    private LocalDateTime createdAt;
    
    public PortfolioTemplateDto() {}
    
    public PortfolioTemplateDto(PortfolioTemplate template) {
        this.id = template.getId();
        this.name = template.getName();
        this.description = template.getDescription();
        this.previewImageUrl = template.getPreviewImageUrl();
        this.category = template.getCategory();
        this.isActive = template.getIsActive();
        this.createdAt = template.getCreatedAt();
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getPreviewImageUrl() {
        return previewImageUrl;
    }
    
    public void setPreviewImageUrl(String previewImageUrl) {
        this.previewImageUrl = previewImageUrl;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
