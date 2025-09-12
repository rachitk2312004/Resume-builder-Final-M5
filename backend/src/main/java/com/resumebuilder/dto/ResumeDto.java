package com.resumebuilder.dto;

import com.resumebuilder.entity.Resume;
import java.time.LocalDateTime;

public class ResumeDto {
    
    private Long id;
    private String title;
    private Resume.Status status;
    private String jsonContent;
    private Boolean isPublic;
    private String publicLink;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public ResumeDto() {}
    
    public ResumeDto(Resume resume) {
        this.id = resume.getId();
        this.title = resume.getTitle();
        this.status = resume.getStatus();
        this.jsonContent = resume.getJsonContent();
        this.isPublic = resume.getIsPublic();
        this.publicLink = resume.getPublicLink();
        this.createdAt = resume.getCreatedAt();
        this.updatedAt = resume.getUpdatedAt();
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
    
    public Resume.Status getStatus() {
        return status;
    }
    
    public void setStatus(Resume.Status status) {
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
