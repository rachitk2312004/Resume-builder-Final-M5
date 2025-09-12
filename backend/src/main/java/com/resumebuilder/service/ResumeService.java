package com.resumebuilder.service;

import com.resumebuilder.entity.Resume;
import com.resumebuilder.entity.User;
import com.resumebuilder.repository.ResumeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class ResumeService {
    
    @Autowired
    private ResumeRepository resumeRepository;
    
    public Resume createResume(User user, String title) {
        Resume resume = new Resume(user, title);
        resume.setIsPublic(user.getIsPublicByDefault());
        if (resume.getIsPublic()) {
            resume.setPublicLink(UUID.randomUUID().toString());
        }
        return resumeRepository.save(resume);
    }
    
    public List<Resume> getUserResumes(User user) {
        return resumeRepository.findByUserOrderByUpdatedAtDesc(user);
    }
    
    public Optional<Resume> getResumeById(Long id, User user) {
        return resumeRepository.findByIdAndUser(id, user);
    }
    
    public Resume updateResume(Long id, User user, String title, String jsonContent, 
                              Resume.Status status, Boolean isPublic) {
        Resume resume = resumeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Resume not found"));
        
        if (title != null) {
            resume.setTitle(title);
        }
        if (jsonContent != null) {
            resume.setJsonContent(jsonContent);
        }
        if (status != null) {
            resume.setStatus(status);
        }
        if (isPublic != null) {
            resume.setIsPublic(isPublic);
            if (isPublic && resume.getPublicLink() == null) {
                resume.setPublicLink(UUID.randomUUID().toString());
            } else if (!isPublic) {
                resume.setPublicLink(null);
            }
        }
        
        return resumeRepository.save(resume);
    }
    
    public Resume duplicateResume(Long id, User user) {
        Resume originalResume = resumeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Resume not found"));
        
        Resume duplicateResume = new Resume();
        duplicateResume.setUser(user);
        duplicateResume.setTitle(originalResume.getTitle() + " (Copy)");
        duplicateResume.setJsonContent(originalResume.getJsonContent());
        duplicateResume.setStatus(Resume.Status.IN_PROGRESS);
        duplicateResume.setIsPublic(false);
        
        return resumeRepository.save(duplicateResume);
    }
    
    public void deleteResume(Long id, User user) {
        Resume resume = resumeRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Resume not found"));
        resumeRepository.delete(resume);
    }
    
    public Optional<Resume> getPublicResume(String publicLink) {
        return resumeRepository.findByPublicLink(publicLink);
    }
}
