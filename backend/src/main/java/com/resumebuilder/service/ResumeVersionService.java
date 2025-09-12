package com.resumebuilder.service;

import com.resumebuilder.entity.Resume;
import com.resumebuilder.entity.ResumeVersion;
import com.resumebuilder.repository.ResumeRepository;
import com.resumebuilder.repository.ResumeVersionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ResumeVersionService {

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private ResumeVersionRepository versionRepository;

    public ResumeVersion saveSnapshot(Long resumeId) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));
        if (resume.getJsonContent() == null) {
            throw new RuntimeException("No content to version");
        }
        ResumeVersion version = new ResumeVersion();
        version.setResume(resume);
        version.setJsonContent(resume.getJsonContent());
        return versionRepository.save(version);
    }

    public List<ResumeVersion> listVersions(Long resumeId) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));
        return versionRepository.findByResumeOrderByCreatedAtDesc(resume);
    }

    public Resume restoreVersion(Long resumeId, Long versionId) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));
        ResumeVersion version = versionRepository.findById(versionId)
                .orElseThrow(() -> new RuntimeException("Version not found"));
        if (!version.getResume().getId().equals(resume.getId())) {
            throw new RuntimeException("Version does not belong to resume");
        }
        resume.setJsonContent(version.getJsonContent());
        return resumeRepository.save(resume);
    }
}


