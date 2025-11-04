package com.resumebuilder.service;

import com.resumebuilder.dto.PortfolioAnalyticsDto;
import com.resumebuilder.entity.Portfolio;
import com.resumebuilder.entity.PortfolioAnalytics;
import com.resumebuilder.repository.PortfolioAnalyticsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class PortfolioAnalyticsService {
    
    @Autowired
    private PortfolioAnalyticsRepository analyticsRepository;
    
    public void trackView(Portfolio portfolio, String ipAddress, String userAgent, String referrer) {
        try {
            String ipHash = hashIpAddress(ipAddress);
            
            // Check if this IP has already viewed this portfolio recently (within 1 hour)
            LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
            boolean recentView = analyticsRepository.findByPortfolioAndDateRange(portfolio, oneHourAgo)
                    .stream()
                    .anyMatch(analytics -> analytics.getIpHash().equals(ipHash));
            
            if (!recentView) {
                PortfolioAnalytics analytics = new PortfolioAnalytics(portfolio, ipHash, userAgent);
                analytics.setReferrer(referrer);
                analyticsRepository.save(analytics);
                
                // Increment portfolio view count
                Long currentViews = portfolio.getViewsCount() != null ? portfolio.getViewsCount() : 0L;
                portfolio.setViewsCount(currentViews + 1);
            }
        } catch (Exception e) {
            // Log error but don't fail the request
            System.err.println("Error tracking portfolio view: " + e.getMessage());
        }
    }
    
    public Map<String, Object> getPortfolioAnalytics(Portfolio portfolio) {
        Map<String, Object> analytics = new HashMap<>();
        
        // Total views
        Long totalViews = analyticsRepository.countViewsByPortfolioAndDateRange(portfolio, LocalDateTime.now().minusYears(1));
        analytics.put("totalViews", totalViews);
        
        // Unique visitors
        Long uniqueVisitors = analyticsRepository.countUniqueVisitorsByPortfolio(portfolio);
        analytics.put("uniqueVisitors", uniqueVisitors);
        
        // Views in last 7 days
        Long viewsLast7Days = analyticsRepository.countViewsByPortfolioAndDateRange(portfolio, LocalDateTime.now().minusDays(7));
        analytics.put("viewsLast7Days", viewsLast7Days);
        
        // Views in last 30 days
        Long viewsLast30Days = analyticsRepository.countViewsByPortfolioAndDateRange(portfolio, LocalDateTime.now().minusDays(30));
        analytics.put("viewsLast30Days", viewsLast30Days);
        
        // Recent views (last 7 days)
        List<PortfolioAnalytics> recentViews = analyticsRepository.findByPortfolioAndDateRange(portfolio, LocalDateTime.now().minusDays(7));
        List<PortfolioAnalyticsDto> recentViewsDto = recentViews.stream()
                .map(PortfolioAnalyticsDto::new)
                .collect(Collectors.toList());
        analytics.put("recentViews", recentViewsDto);
        
        return analytics;
    }
    
    public Map<String, Long> getViewsChartData(Portfolio portfolio, int days) {
        Map<String, Long> chartData = new HashMap<>();
        
        for (int i = days - 1; i >= 0; i--) {
            LocalDateTime startOfDay = LocalDateTime.now().minusDays(i).withHour(0).withMinute(0).withSecond(0);
            LocalDateTime endOfDay = startOfDay.plusDays(1);
            
            Long views = analyticsRepository.countViewsByPortfolioAndDateRange(portfolio, startOfDay, endOfDay);
            String dateKey = startOfDay.toLocalDate().toString();
            chartData.put(dateKey, views);
        }
        
        return chartData;
    }
    
    private String hashIpAddress(String ipAddress) throws NoSuchAlgorithmException {
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        byte[] hash = md.digest(ipAddress.getBytes());
        StringBuilder hexString = new StringBuilder();
        
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        
        return hexString.toString();
    }
}
