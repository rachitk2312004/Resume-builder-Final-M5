package com.resumebuilder.service;

import com.resumebuilder.dto.PortfolioTemplateDto;
import com.resumebuilder.entity.PortfolioTemplate;
import com.resumebuilder.repository.PortfolioTemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class PortfolioTemplateService {
    
    @Autowired
    private PortfolioTemplateRepository templateRepository;
    
    public List<PortfolioTemplateDto> getAllActiveTemplates() {
        return templateRepository.findByIsActiveTrueOrderByName()
                .stream()
                .map(PortfolioTemplateDto::new)
                .collect(Collectors.toList());
    }
    
    public List<PortfolioTemplateDto> getTemplatesByCategory(String category) {
        return templateRepository.findByCategoryAndIsActiveTrueOrderByName(category)
                .stream()
                .map(PortfolioTemplateDto::new)
                .collect(Collectors.toList());
    }
    
    public Optional<PortfolioTemplateDto> getTemplateById(String id) {
        return templateRepository.findByIdAndIsActiveTrue(id)
                .map(PortfolioTemplateDto::new);
    }
    
    public List<String> getTemplateCategories() {
        return templateRepository.findByIsActiveTrueOrderByName()
                .stream()
                .map(PortfolioTemplate::getCategory)
                .distinct()
                .collect(Collectors.toList());
    }
}
