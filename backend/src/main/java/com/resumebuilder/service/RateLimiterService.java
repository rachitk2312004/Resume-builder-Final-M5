package com.resumebuilder.service;

import com.resumebuilder.entity.AiLog;
import com.resumebuilder.repository.AiLogRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class RateLimiterService {

    private final AiLogRepository aiLogRepository;

    @Value("${ai.monthly.free.calls:20}")
    private int monthlyFreeCalls;

    public RateLimiterService(AiLogRepository aiLogRepository) {
        this.aiLogRepository = aiLogRepository;
    }

    public boolean withinFreeLimit(Long userId) {
        Instant since = Instant.now().minus(30, ChronoUnit.DAYS);
        long count = aiLogRepository.countSuccessfulSince(userId, since);
        return count < monthlyFreeCalls;
    }

    public void recordCall(Long userId, String endpoint, Integer tokens, boolean success, String model, String notes) {
        AiLog log = new AiLog();
        log.setUserId(userId);
        log.setEndpoint(endpoint);
        log.setTokensUsed(tokens);
        log.setSuccess(success);
        log.setModel(model);
        log.setNotes(notes);
        aiLogRepository.save(log);
    }
}


