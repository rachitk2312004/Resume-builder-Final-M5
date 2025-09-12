package com.resumebuilder.service;

import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Map;

@Service
public class AIService {

    @Value("${openai.api.key:}")
    private String apiKey;

    @Value("${openai.api.url:https://api.openai.com/v1}")
    private String apiUrl;

    private final OkHttpClient client = new OkHttpClient();

    public String generateProfessionalSummary(Map<String, Object> payload) throws IOException {
        String prompt = (String) payload.getOrDefault("prompt", "Generate a professional resume summary");
        return callOpenAI(prompt);
    }

    public String suggestSkillsWithATS(Map<String, Object> payload) throws IOException {
        String prompt = (String) payload.getOrDefault("prompt", "Suggest resume skills with ATS keywords");
        return callOpenAI(prompt);
    }

    public String optimizeBulletsForATS(Map<String, Object> payload) throws IOException {
        String prompt = (String) payload.getOrDefault("prompt", "Optimize resume bullets for ATS and return improved bullets and keywords");
        return callOpenAI(prompt);
    }

    private String callOpenAI(String prompt) throws IOException {
        if (apiKey == null || apiKey.isEmpty()) {
            return "[AI not configured] " + prompt;
        }
        MediaType json = MediaType.parse("application/json; charset=utf-8");
        String body = "{\"model\":\"gpt-4o-mini\",\"messages\":[{\"role\":\"user\",\"content\":\"" + prompt.replace("\"", "\\\"") + "\"}],\"temperature\":0.2}";
        Request request = new Request.Builder()
                .url(apiUrl + "/chat/completions")
                .addHeader("Authorization", "Bearer " + apiKey)
                .post(RequestBody.create(body, json))
                .build();
        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                return "AI error: " + response.code();
            }
            return response.body() != null ? response.body().string() : "";
        }
    }
}


