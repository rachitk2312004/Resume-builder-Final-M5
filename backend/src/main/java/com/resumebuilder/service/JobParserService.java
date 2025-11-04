package com.resumebuilder.service;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class JobParserService {

    private static final Pattern TITLE_PATTERN = Pattern.compile("(?i)(senior|junior|lead|principal)?\\s*(software|data|product|design|marketing|sales)[^\\n]{0,40}(engineer|developer|designer|manager|analyst|specialist)");
    private static final String[] SKILL_HINTS = new String[]{"java","spring","react","node","python","sql","aws","docker","kubernetes","graphql","rest"};

    public Map<String, Object> parse(String text) {
        Map<String, Object> result = new HashMap<>();
        if (text == null) text = "";

        // Title
        String title = extractTitle(text);
        result.put("title", title);

        // Experience level
        String level = extractLevel(text);
        result.put("experienceLevel", level);

        // Skills
        Set<String> skills = new LinkedHashSet<>();
        String lower = text.toLowerCase();
        for (String k : SKILL_HINTS) if (lower.contains(k)) skills.add(k);
        result.put("skills", new ArrayList<>(skills));

        // Responsibilities (simple split by bullets)
        List<String> responsibilities = new ArrayList<>();
        for (String line : text.split("\n")) {
            String t = line.trim();
            if (t.startsWith("-") || t.startsWith("•") || t.matches("^[0-9]+[).].*")) {
                responsibilities.add(t.replaceFirst("^[0-9]+[).]\\s*", "").replaceFirst("^[-•]\\s*", ""));
            }
        }
        result.put("responsibilities", responsibilities);

        return result;
    }

    private String extractTitle(String text) {
        Matcher m = TITLE_PATTERN.matcher(text);
        if (m.find()) return m.group().trim();
        for (String line : text.split("\n")) {
            if (line.toLowerCase().contains("engineer") || line.toLowerCase().contains("developer")) {
                return line.trim();
            }
        }
        return "";
    }

    private String extractLevel(String text) {
        String l = text.toLowerCase();
        if (l.contains("senior")) return "senior";
        if (l.contains("mid-level") || l.contains("mid level") || l.contains("intermediate")) return "mid";
        if (l.contains("junior") || l.contains("entry") || l.contains("graduate")) return "junior";
        return "unspecified";
    }
}


