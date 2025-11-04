package com.resumebuilder.repository;

import com.resumebuilder.entity.AtsScore;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AtsScoreRepository extends JpaRepository<AtsScore, Long> {
    List<AtsScore> findByUserIdAndResumeIdOrderByCreatedAtDesc(Long userId, Long resumeId);

    Page<AtsScore> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
}


