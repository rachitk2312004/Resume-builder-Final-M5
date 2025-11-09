package com.resumebuilder.controller;

import com.resumebuilder.service.PaymentService;
import com.resumebuilder.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
public class BillingController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private UserService userService;

    @PostMapping("/create-session")
    public ResponseEntity<?> createSession(@RequestBody Map<String, Object> payload, Authentication authentication) {
        try {
            String email = authentication.getName();
            Long userId = userService.findByEmail(email)
                    .map(u -> u.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String planType = (String) payload.getOrDefault("planType", "pro");
            BigDecimal amount = new BigDecimal(payload.getOrDefault("amount", "29.99").toString());
            String description = (String) payload.getOrDefault("description", "Pro Plan Subscription");

            String sessionId = paymentService.createCheckoutSession(userId, planType, amount, description);

            Map<String, String> response = new HashMap<>();
            response.put("sessionId", sessionId);
            response.put("checkoutUrl", "https://checkout.stripe.com/pay/" + sessionId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<?> handleWebhook(@RequestBody String payload, @RequestHeader("Stripe-Signature") String signature) {
        try {
            paymentService.handleWebhook(payload, signature);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/status/{userId}")
    public ResponseEntity<?> getPaymentStatus(@PathVariable Long userId, Authentication authentication) {
        try {
            String email = authentication.getName();
            Long authUserId = userService.findByEmail(email)
                    .map(u -> u.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Users can only check their own status
            if (!authUserId.equals(userId)) {
                return ResponseEntity.status(403).body(Map.of("error", "Unauthorized"));
            }

            Map<String, Object> status = paymentService.getPaymentStatus(userId);
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}

