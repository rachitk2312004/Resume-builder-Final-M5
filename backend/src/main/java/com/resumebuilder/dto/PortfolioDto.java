package com.resumebuilder.dto;

import com.resumebuilder.entity.Portfolio;
import java.time.LocalDateTime;

public class PortfolioDto {
    
    private Long id;
    private String title;
    private String slug;
    private String templateId;
    private Portfolio.Status status;
    private String jsonContent;
    private Boolean isPublic;
    private String publicLink;
    private Long viewsCount;
    private String seoTitle;
    private String seoDescription;
    private String seoImageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public PortfolioDto() {}
    
    public PortfolioDto(Portfolio portfolio) {
        this.id = portfolio.getId();
        this.title = portfolio.getTitle();
        this.slug = portfolio.getSlug();
        this.templateId = portfolio.getTemplateId();
        this.status = portfolio.getStatus();
        this.jsonContent = portfolio.getJsonContent();
        this.isPublic = portfolio.getIsPublic();
        this.publicLink = portfolio.getPublicLink();
        this.viewsCount = portfolio.getViewsCount();
        this.seoTitle = portfolio.getSeoTitle();
        this.seoDescription = portfolio.getSeoDescription();
        this.seoImageUrl = portfolio.getSeoImageUrl();
        this.createdAt = portfolio.getCreatedAt();
        this.updatedAt = portfolio.getUpdatedAt();
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public Portfolio.Status getStatus() {
        return status;
    }
    
    public void setStatus(Portfolio.Status status) {
        this.status = status;
    }
    
    public String getJsonContent() {
        return jsonContent;
    }
    
    public void setJsonContent(String jsonContent) {
        this.jsonContent = jsonContent;
    }
    
    public Boolean getIsPublic() {
        return isPublic;
    }
    
    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }
    
    public String getPublicLink() {
        return publicLink;
    }
    
    public void setPublicLink(String publicLink) {
        this.publicLink = publicLink;
    }
    
    public String getSlug() {
        return slug;
    }
    
    public void setSlug(String slug) {
        this.slug = slug;
    }
    
    public String getTemplateId() {
        return templateId;
    }
    
    public void setTemplateId(String templateId) {
        this.templateId = templateId;
    }
    
    public Long getViewsCount() {
        return viewsCount;
    }
    
    public void setViewsCount(Long viewsCount) {
        this.viewsCount = viewsCount;
    }
    
    public String getSeoTitle() {
        return seoTitle;
    }
    
    public void setSeoTitle(String seoTitle) {
        this.seoTitle = seoTitle;
    }
    
    public String getSeoDescription() {
        return seoDescription;
    }
    
    public void setSeoDescription(String seoDescription) {
        this.seoDescription = seoDescription;
    }
    
    public String getSeoImageUrl() {
        return seoImageUrl;
    }
    
    public void setSeoImageUrl(String seoImageUrl) {
        this.seoImageUrl = seoImageUrl;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
