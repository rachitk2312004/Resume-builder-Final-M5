package com.resumebuilder;

import com.resumebuilder.service.ExportService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class ExportServiceTest {

    @Autowired
    private ExportService exportService;

    @Test
    public void testGenerateText() {
        String html = "<html><body><h1>Test Resume</h1><p>This is a test</p></body></html>";
        String text = exportService.generateText(html);
        
        assertNotNull(text);
        assertTrue(text.contains("Test Resume"));
        assertTrue(text.contains("This is a test"));
    }

    @Test
    public void testGenerateTextWithEmptyHtml() {
        String text = exportService.generateText("");
        assertNotNull(text);
    }
}

