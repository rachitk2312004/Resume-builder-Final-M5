package com.resumebuilder.repository;

import com.resumebuilder.entity.Portfolio;
import com.resumebuilder.entity.PortfolioAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PortfolioAnalyticsRepository extends JpaRepository<PortfolioAnalytics, Long> {
    
    List<PortfolioAnalytics> findByPortfolioOrderByTimestampDesc(Portfolio portfolio);
    
    @Query("SELECT COUNT(DISTINCT pa.ipHash) FROM PortfolioAnalytics pa WHERE pa.portfolio = :portfolio")
    Long countUniqueVisitorsByPortfolio(@Param("portfolio") Portfolio portfolio);
    
    @Query("SELECT COUNT(pa) FROM PortfolioAnalytics pa WHERE pa.portfolio = :portfolio AND pa.timestamp >= :startDate")
    Long countViewsByPortfolioAndDateRange(@Param("portfolio") Portfolio portfolio, @Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT COUNT(pa) FROM PortfolioAnalytics pa WHERE pa.portfolio = :portfolio AND pa.timestamp >= :startDate AND pa.timestamp < :endDate")
    Long countViewsByPortfolioAndDateRange(@Param("portfolio") Portfolio portfolio, 
                                          @Param("startDate") LocalDateTime startDate, 
                                          @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT pa FROM PortfolioAnalytics pa WHERE pa.portfolio = :portfolio AND pa.timestamp >= :startDate ORDER BY pa.timestamp DESC")
    List<PortfolioAnalytics> findByPortfolioAndDateRange(@Param("portfolio") Portfolio portfolio, 
                                                        @Param("startDate") LocalDateTime startDate);
}
