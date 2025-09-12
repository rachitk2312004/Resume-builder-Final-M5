package com.resumebuilder.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "portfolio_analytics")
public class PortfolioAnalytics {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "portfolio_id", nullable = false)
    private Portfolio portfolio;
    
    @Column(name = "ip_hash", nullable = false, length = 64)
    private String ipHash;
    
    @Column(name = "user_agent", columnDefinition = "TEXT")
    private String userAgent;
    
    @Column(name = "referrer", length = 500)
    private String referrer;
    
    @Column(name = "country", length = 100)
    private String country;
    
    @Column(name = "city", length = 100)
    private String city;
    
    @CreationTimestamp
    @Column(name = "timestamp", nullable = false, updatable = false)
    private LocalDateTime timestamp;
    
    // Constructors
    public PortfolioAnalytics() {}
    
    public PortfolioAnalytics(Portfolio portfolio, String ipHash, String userAgent) {
        this.portfolio = portfolio;
        this.ipHash = ipHash;
        this.userAgent = userAgent;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Portfolio getPortfolio() {
        return portfolio;
    }
    
    public void setPortfolio(Portfolio portfolio) {
        this.portfolio = portfolio;
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
