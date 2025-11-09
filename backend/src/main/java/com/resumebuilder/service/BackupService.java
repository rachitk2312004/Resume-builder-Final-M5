package com.resumebuilder.service;

import com.resumebuilder.repository.UserRepository;
import com.resumebuilder.repository.ResumeRepository;
import com.resumebuilder.repository.PortfolioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class BackupService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Value("${app.backup.directory:./backups}")
    private String backupDirectory;

    @Value("${app.backup.enabled:true}")
    private boolean backupEnabled;

    @Scheduled(cron = "0 0 2 * * *") // Daily at 2 AM
    public void performDailyBackup() {
        if (!backupEnabled) {
            return;
        }

        try {
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss"));
            Path backupPath = Paths.get(backupDirectory);
            
            if (!Files.exists(backupPath)) {
                Files.createDirectories(backupPath);
            }

            // Backup user count
            long userCount = userRepository.count();
            writeBackupFile(backupPath.resolve("users_count_" + timestamp + ".txt"), 
                "Total Users: " + userCount);

            // Backup resume count
            long resumeCount = resumeRepository.count();
            writeBackupFile(backupPath.resolve("resumes_count_" + timestamp + ".txt"),
                "Total Resumes: " + resumeCount);

            // Backup portfolio count
            long portfolioCount = portfolioRepository.count();
            writeBackupFile(backupPath.resolve("portfolios_count_" + timestamp + ".txt"),
                "Total Portfolios: " + portfolioCount);

            // Create summary backup
            String summary = String.format(
                "Backup Summary - %s\n" +
                "Total Users: %d\n" +
                "Total Resumes: %d\n" +
                "Total Portfolios: %d\n",
                timestamp, userCount, resumeCount, portfolioCount
            );
            writeBackupFile(backupPath.resolve("backup_summary_" + timestamp + ".txt"), summary);

        } catch (IOException e) {
            System.err.println("Backup failed: " + e.getMessage());
        }
    }

    @Scheduled(cron = "0 0 3 * * 0") // Weekly on Sunday at 3 AM
    public void performWeeklyBackup() {
        if (!backupEnabled) {
            return;
        }

        try {
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss"));
            Path backupPath = Paths.get(backupDirectory + "/weekly");
            
            if (!Files.exists(backupPath)) {
                Files.createDirectories(backupPath);
            }

            // Weekly detailed backup
            performDailyBackup();
            
            String weeklySummary = String.format(
                "Weekly Backup Summary - %s\n" +
                "This backup includes all daily statistics.\n",
                timestamp
            );
            writeBackupFile(backupPath.resolve("weekly_backup_" + timestamp + ".txt"), weeklySummary);

        } catch (IOException e) {
            System.err.println("Weekly backup failed: " + e.getMessage());
        }
    }

    private void writeBackupFile(Path filePath, String content) throws IOException {
        try (FileWriter writer = new FileWriter(filePath.toFile())) {
            writer.write(content);
        }
    }

    public void manualBackup() {
        performDailyBackup();
    }
}

