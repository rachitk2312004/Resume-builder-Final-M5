package com.resumebuilder.service;

import com.resumebuilder.entity.UserActivityLog;
import com.resumebuilder.repository.UserActivityLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;

@Service
public class ActivityLogService {

    @Autowired
    private UserActivityLogRepository activityLogRepository;

    public void logActivity(Long userId, String activityType, String details, HttpServletRequest request) {
        UserActivityLog log = new UserActivityLog();
        log.setUserId(userId);
        log.setActivityType(activityType);
        log.setDetails(details);
        
        if (request != null) {
            log.setIpAddress(getClientIpAddress(request));
            log.setUserAgent(request.getHeader("User-Agent"));
        }
        
        log.setCreatedAt(Instant.now());
        activityLogRepository.save(log);
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}

