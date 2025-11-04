package com.resumebuilder.service;

import com.resumebuilder.entity.AtsScore;
import com.resumebuilder.repository.AtsScoreRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ATSScoringService {

    private final AtsScoreRepository atsScoreRepository;

    public ATSScoringService(AtsScoreRepository atsScoreRepository) {
        this.atsScoreRepository = atsScoreRepository;
    }

    public Map<String, Object> scoreResume(Long userId, Long resumeId, String resumeText, String jobText) {
        Set<String> keywords = extractKeywords(jobText);
        int matched = 0;
        String lower = resumeText == null ? "" : resumeText.toLowerCase();
        for (String k : keywords) if (lower.contains(k)) matched++;
        int score = keywords.isEmpty() ? 50 : Math.min(100, (int) Math.round(100.0 * matched / keywords.size()));

        AtsScore s = new AtsScore();
        s.setUserId(userId);
        s.setResumeId(resumeId);
        s.setScore(score);
        s.setKeywords(String.join(",", keywords));
        atsScoreRepository.save(s);

        Map<String, Object> result = new HashMap<>();
        result.put("score", score);
        result.put("keywords", new ArrayList<>(keywords));
        result.put("missing", missingKeywords(lower, keywords));
        return result;
    }

    private Set<String> extractKeywords(String jobText) {
        if (jobText == null) jobText = "";
        String[] seeds = new String[]{"java","spring","react","node","python","sql","aws","docker","kubernetes","graphql","rest","typescript","git","ci/cd","microservices"};
        Set<String> k = new LinkedHashSet<>();
        String l = jobText.toLowerCase();
        for (String s : seeds) if (l.contains(s)) k.add(s);
        return k;
    }

    private List<String> missingKeywords(String resumeLower, Set<String> keywords) {
        List<String> missing = new ArrayList<>();
        for (String k : keywords) if (!resumeLower.contains(k)) missing.add(k);
        return missing;
    }
}


