package com.resumebuilder.repository;

import com.resumebuilder.entity.AiLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.List;

public interface AiLogRepository extends JpaRepository<AiLog, Long> {

    @Query("select count(a) from AiLog a where a.userId = :userId and a.createdAt >= :since and a.success = true")
    long countSuccessfulSince(Long userId, Instant since);

    List<AiLog> findByUserIdOrderByCreatedAtDesc(Long userId);

    Page<AiLog> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
}


