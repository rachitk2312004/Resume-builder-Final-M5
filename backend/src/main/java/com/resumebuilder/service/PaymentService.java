package com.resumebuilder.service;

import com.resumebuilder.entity.BillingHistory;
import com.resumebuilder.entity.User;
import com.resumebuilder.repository.BillingHistoryRepository;
import com.resumebuilder.repository.UserRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class PaymentService {

    @Autowired
    private BillingHistoryRepository billingHistoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${stripe.api.key:}")
    private String stripeApiKey;

    @Value("${stripe.webhook.secret:}")
    private String webhookSecret;

    @Value("${app.base.url:http://localhost:3000}")
    private String baseUrl;

    public String createCheckoutSession(Long userId, String planType, BigDecimal amount, String description) throws StripeException {
        if (stripeApiKey == null || stripeApiKey.isEmpty()) {
            throw new RuntimeException("Stripe API key not configured");
        }

        Stripe.apiKey = stripeApiKey;

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(baseUrl + "/billing/success?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl(baseUrl + "/billing/cancel")
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("usd")
                                                .setUnitAmount(amount.multiply(new BigDecimal("100")).longValue())
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName(description)
                                                                .build())
                                                .build())
                                .build())
                .putMetadata("userId", userId.toString())
                .putMetadata("planType", planType)
                .build();

        Session session = Session.create(params);

        // Create billing history record
        BillingHistory billing = new BillingHistory();
        billing.setUserId(userId);
        billing.setAmount(amount);
        billing.setCurrency("USD");
        billing.setStatus("pending");
        billing.setPlanType(planType);
        billing.setDescription(description);
        billing.setCreatedAt(Instant.now());
        billingHistoryRepository.save(billing);

        return session.getId();
    }

    public void handleWebhook(String payload, String signature) {
        // Webhook handling would verify signature and process payment events
        // This is a simplified version
    }

    public void updatePaymentStatus(String paymentIntentId, String status) {
        Optional<BillingHistory> billingOpt = billingHistoryRepository.findByStripePaymentIntentId(paymentIntentId);
        if (billingOpt.isPresent()) {
            BillingHistory billing = billingOpt.get();
            billing.setStatus(status);
            billingHistoryRepository.save(billing);

            // Update user subscription if payment succeeded
            if ("completed".equals(status)) {
                User user = userRepository.findById(billing.getUserId()).orElse(null);
                if (user != null && billing.getPlanType() != null) {
                    user.setSubscriptionTier(billing.getPlanType());
                    if ("pro".equalsIgnoreCase(billing.getPlanType())) {
                        user.setAiCredits(user.getAiCredits() + 100);
                    } else if ("enterprise".equalsIgnoreCase(billing.getPlanType())) {
                        user.setAiCredits(user.getAiCredits() + 500);
                    }
                    userRepository.save(user);
                }
            }
        }
    }

    public Map<String, Object> getPaymentStatus(Long userId) {
        Map<String, Object> status = new HashMap<>();
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            status.put("subscriptionTier", user.getSubscriptionTier());
            status.put("aiCredits", user.getAiCredits());
            status.put("role", user.getRole());
        }
        return status;
    }
}

