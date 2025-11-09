package com.resumebuilder.repository;

import com.resumebuilder.entity.BillingHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BillingHistoryRepository extends JpaRepository<BillingHistory, Long> {
    List<BillingHistory> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<BillingHistory> findByStripePaymentIntentId(String stripePaymentIntentId);
}

