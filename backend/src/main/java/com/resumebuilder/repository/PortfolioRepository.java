package com.resumebuilder.repository;

import com.resumebuilder.entity.Portfolio;
import com.resumebuilder.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
    List<Portfolio> findByUserOrderByUpdatedAtDesc(User user);
    Optional<Portfolio> findByIdAndUser(Long id, User user);
    Optional<Portfolio> findByPublicLink(String publicLink);
    Optional<Portfolio> findBySlug(String slug);
    Optional<Portfolio> findBySlugAndUser(String slug, User user);
    boolean existsBySlug(String slug);
    boolean existsBySlugAndIdNot(String slug, Long id);
}
