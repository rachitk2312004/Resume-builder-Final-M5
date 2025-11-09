package com.resumebuilder.service;

import com.resumebuilder.entity.AdminLog;
import com.resumebuilder.entity.User;
import com.resumebuilder.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private ExportLogRepository exportLogRepository;

    @Autowired
    private AiLogRepository aiLogRepository;

    @Autowired
    private AdminLogRepository adminLogRepository;

    @Autowired
    private UserActivityLogRepository userActivityLogRepository;

    public boolean isAdmin(Long userId) {
        return userRepository.findById(userId)
                .map(u -> "admin".equalsIgnoreCase(u.getRole()))
                .orElse(false);
    }

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalResumes", resumeRepository.count());
        stats.put("totalPortfolios", portfolioRepository.count());
        stats.put("totalExports", exportLogRepository.count());
        stats.put("totalAiCalls", aiLogRepository.count());
        stats.put("activeUsers", userActivityLogRepository.count());
        return stats;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void logAdminAction(Long adminUserId, String action, String targetType, Long targetId, String details) {
        AdminLog log = new AdminLog();
        log.setAdminUserId(adminUserId);
        log.setAction(action);
        log.setTargetType(targetType);
        log.setTargetId(targetId);
        log.setDetails(details);
        log.setCreatedAt(Instant.now());
        adminLogRepository.save(log);
    }

    public List<AdminLog> getAdminLogs(Long adminUserId) {
        return adminLogRepository.findByAdminUserIdOrderByCreatedAtDesc(adminUserId);
    }
}

