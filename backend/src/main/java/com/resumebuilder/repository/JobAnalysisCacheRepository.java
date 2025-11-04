package com.resumebuilder.repository;

import com.resumebuilder.entity.JobAnalysisCache;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JobAnalysisCacheRepository extends JpaRepository<JobAnalysisCache, Long> {
    Optional<JobAnalysisCache> findByJobId(String jobId);
}


