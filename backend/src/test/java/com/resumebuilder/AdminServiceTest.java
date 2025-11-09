package com.resumebuilder;

import com.resumebuilder.service.AdminService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class AdminServiceTest {

    @Autowired
    private AdminService adminService;

    @Test
    public void testGetDashboardStats() {
        var stats = adminService.getDashboardStats();
        
        assertNotNull(stats);
        assertTrue(stats.containsKey("totalUsers"));
        assertTrue(stats.containsKey("totalResumes"));
        assertTrue(stats.containsKey("totalPortfolios"));
    }

    @Test
    public void testIsAdmin() {
        // Test with non-admin user (assuming user ID 1 exists)
        boolean isAdmin = adminService.isAdmin(999L);
        assertFalse(isAdmin);
    }
}

