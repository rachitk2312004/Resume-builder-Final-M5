package com.resumebuilder.repository;

import com.resumebuilder.entity.ExportLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExportLogRepository extends JpaRepository<ExportLog, Long> {
    List<ExportLog> findByUserIdOrderByCreatedAtDesc(Long userId);
}

