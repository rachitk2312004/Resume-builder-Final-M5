package com.resumebuilder.service;

import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class AIService {

    @Value("${openai.api.key:}")
    private String apiKey;

    @Value("${openai.api.url:https://api.openai.com/v1}")
    private String apiUrl;

    private final OkHttpClient client = new OkHttpClient();

    public String generateProfessionalSummary(Map<String, Object> payload) throws IOException {
        String jobDesc = (String) payload.getOrDefault("jobDescription", "");
        String resume = (String) payload.getOrDefault("resumeText", "");
        String existing = (String) payload.getOrDefault("existingSummary", "");
        String prompt = summaryPrompt(jobDesc, resume, existing);
        return callPrimaryOrFallback(prompt);
    }

    public String suggestSkillsWithATS(Map<String, Object> payload) throws IOException {
        String jobDesc = (String) payload.getOrDefault("jobDescription", "");
        String resume = (String) payload.getOrDefault("resumeText", "");
        String prompt = keywordPrompt(jobDesc, resume);
        return callPrimaryOrFallback(prompt);
    }

    public String optimizeBulletsForATS(Map<String, Object> payload) throws IOException {
        Object bulletsObj = payload.getOrDefault("bullets", List.of());
        String jobDesc = (String) payload.getOrDefault("jobDescription", "");
        String prompt = bulletPrompt(bulletsObj, jobDesc);
        return callPrimaryOrFallback(prompt);
    }

    public String atsOptimize(Map<String, Object> payload) throws IOException {
        String resume = (String) payload.getOrDefault("resumeText", "");
        String jobDesc = (String) payload.getOrDefault("jobDescription", "");
        String prompt = atsPrompt(resume, jobDesc);
        return callPrimaryOrFallback(prompt);
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

    public String callHuggingFace(String prompt) throws IOException {
        // Simple placeholder for HF inference; expects HF env variables configured externally
        return "[HF fallback] " + prompt;
    }

    private String callPrimaryOrFallback(String prompt) throws IOException {
        String res = callOpenAI(prompt);
        if (res.startsWith("AI error:") || res.startsWith("[AI not configured]")) {
            return callHuggingFace(prompt);
        }
        return res;
    }

    private String summaryPrompt(String jobDesc, String resume, String existing) {
        return "You are an expert resume writer. Given the job description and resume, produce three JSON fields: concise, balanced, detailed. Each is a tailored professional summary. Return JSON only.\\n" +
                "jobDescription: " + sanitize(jobDesc) + "\\nresume: " + sanitize(resume) + "\\nexistingSummary: " + sanitize(existing);
    }

    private String bulletPrompt(Object bulletsObj, String jobDesc) {
        String bullets = sanitize(String.valueOf(bulletsObj));
        return "Rewrite the following resume bullets to be action-oriented, quantified, and concise. Provide an array of objects {before, after, rationale}. Return JSON only.\\n" +
                "jobDescription: " + sanitize(jobDesc) + "\\nbullets: " + bullets;
    }

    private String keywordPrompt(String jobDesc, String resume) {
        return "Suggest skill categories, keyword clusters, and synonyms based on the job description and resume. Return JSON with {categories: string[], clusters: {name, keywords[]}, synonyms: string[]}. Return JSON only.\\n" +
                "jobDescription: " + sanitize(jobDesc) + "\\nresume: " + sanitize(resume);
    }

    private String atsPrompt(String resume, String jobDesc) {
        return "Evaluate ATS compatibility for the resume against the job. Return JSON with {overallScore: 0-100, sections: [{name, score}], missingKeywords: string[], suggestions: string[]}. Return JSON only.\\n" +
                "jobDescription: " + sanitize(jobDesc) + "\\nresume: " + sanitize(resume);
    }

    private String sanitize(String s) {
        if (s == null) return "";
        return s.replace("\"", "'").replace("\\n", " ").trim();
    }
}


