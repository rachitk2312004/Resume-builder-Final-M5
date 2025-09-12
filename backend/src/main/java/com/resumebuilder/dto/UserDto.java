package com.resumebuilder.dto;

import java.time.LocalDateTime;

public class UserDto {
    
    private Long id;
    private String name;
    private String email;
    private Boolean isPublicByDefault;
    private LocalDateTime createdAt;
    
    public UserDto() {}
    
    public UserDto(Long id, String name, String email, Boolean isPublicByDefault, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.isPublicByDefault = isPublicByDefault;
        this.createdAt = createdAt;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public Boolean getIsPublicByDefault() {
        return isPublicByDefault;
    }
    
    public void setIsPublicByDefault(Boolean isPublicByDefault) {
        this.isPublicByDefault = isPublicByDefault;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
