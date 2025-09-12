package com.resumebuilder.repository;

import com.resumebuilder.entity.Resume;
import com.resumebuilder.entity.ResumeVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResumeVersionRepository extends JpaRepository<ResumeVersion, Long> {
    List<ResumeVersion> findByResumeOrderByCreatedAtDesc(Resume resume);
}


