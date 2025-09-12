package com.resumebuilder.repository;

import com.resumebuilder.entity.PortfolioTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PortfolioTemplateRepository extends JpaRepository<PortfolioTemplate, String> {
    
    List<PortfolioTemplate> findByIsActiveTrueOrderByName();
    
    List<PortfolioTemplate> findByCategoryAndIsActiveTrueOrderByName(String category);
    
    Optional<PortfolioTemplate> findByIdAndIsActiveTrue(String id);
}
