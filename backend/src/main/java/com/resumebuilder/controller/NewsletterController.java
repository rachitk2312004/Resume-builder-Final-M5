package com.resumebuilder.controller;

import com.resumebuilder.entity.NewsletterSubscriber;
import com.resumebuilder.repository.NewsletterSubscriberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/newsletter")
@CrossOrigin(origins = "*")
public class NewsletterController {

    @Autowired
    private NewsletterSubscriberRepository newsletterSubscriberRepository;

    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(@RequestBody Map<String, String> payload) {
        try {
            String email = payload.get("email");
            String name = payload.getOrDefault("name", "");

            if (email == null || email.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Email is required");
                return ResponseEntity.badRequest().body(error);
            }

            Optional<NewsletterSubscriber> existing = newsletterSubscriberRepository.findByEmail(email);
            if (existing.isPresent()) {
                NewsletterSubscriber subscriber = existing.get();
                subscriber.setSubscribed(true);
                newsletterSubscriberRepository.save(subscriber);
            } else {
                NewsletterSubscriber subscriber = new NewsletterSubscriber();
                subscriber.setEmail(email);
                subscriber.setName(name);
                subscriber.setSubscribed(true);
                newsletterSubscriberRepository.save(subscriber);
            }

            Map<String, String> response = new HashMap<>();
            response.put("message", "Successfully subscribed to newsletter");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}

