package com.resumebuilder.repository;

import com.resumebuilder.entity.Resume;
import com.resumebuilder.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    List<Resume> findByUserOrderByUpdatedAtDesc(User user);
    Optional<Resume> findByIdAndUser(Long id, User user);
    Optional<Resume> findByPublicLink(String publicLink);
}
