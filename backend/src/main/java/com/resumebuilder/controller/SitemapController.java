package com.resumebuilder.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class SitemapController {

    @GetMapping(value = "/sitemap.xml", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<String> getSitemap() {
        String baseUrl = "https://resumeai.example.com";
        
        String sitemap = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
                "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n" +
                "  <url>\n" +
                "    <loc>" + baseUrl + "/</loc>\n" +
                "    <changefreq>daily</changefreq>\n" +
                "    <priority>1.0</priority>\n" +
                "  </url>\n" +
                "  <url>\n" +
                "    <loc>" + baseUrl + "/login</loc>\n" +
                "    <changefreq>monthly</changefreq>\n" +
                "    <priority>0.8</priority>\n" +
                "  </url>\n" +
                "  <url>\n" +
                "    <loc>" + baseUrl + "/register</loc>\n" +
                "    <changefreq>monthly</changefreq>\n" +
                "    <priority>0.8</priority>\n" +
                "  </url>\n" +
                "</urlset>";
        
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_XML)
                .body(sitemap);
    }
}

