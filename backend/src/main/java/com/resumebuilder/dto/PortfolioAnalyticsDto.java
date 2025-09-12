package com.resumebuilder.dto;

import com.resumebuilder.entity.PortfolioAnalytics;
import java.time.LocalDateTime;

public class PortfolioAnalyticsDto {
    
    private Long id;
    private Long portfolioId;
    private String ipHash;
    private String userAgent;
    private String referrer;
    private String country;
    private String city;
    private LocalDateTime timestamp;
    
    public PortfolioAnalyticsDto() {}
    
    public PortfolioAnalyticsDto(PortfolioAnalytics analytics) {
        this.id = analytics.getId();
        this.portfolioId = analytics.getPortfolio().getId();
        this.ipHash = analytics.getIpHash();
        this.userAgent = analytics.getUserAgent();
        this.referrer = analytics.getReferrer();
        this.country = analytics.getCountry();
        this.city = analytics.getCity();
        this.timestamp = analytics.getTimestamp();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getPortfolioId() {
        return portfolioId;
    }
    
    public void setPortfolioId(Long portfolioId) {
        this.portfolioId = portfolioId;
    }
    
    public String getIpHash() {
        return ipHash;
    }
    
    public void setIpHash(String ipHash) {
        this.ipHash = ipHash;
    }
    
    public String getUserAgent() {
        return userAgent;
    }
    
    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }
    
    public String getReferrer() {
        return referrer;
    }
    
    public void setReferrer(String referrer) {
        this.referrer = referrer;
    }
    
    public String getCountry() {
        return country;
    }
    
    public void setCountry(String country) {
        this.country = country;
    }
    
    public String getCity() {
        return city;
    }
    
    public void setCity(String city) {
        this.city = city;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
