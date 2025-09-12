import React from 'react';

// Import all portfolio templates
import ModernTemplate from './ModernTemplate';
import MinimalTemplate from './MinimalTemplate';
import CreativeTemplate from './CreativeTemplate';
import DeveloperTemplate from './DeveloperTemplate';
import CorporateTemplate from './CorporateTemplate';
import StartupTemplate from './StartupTemplate';
import FreelancerTemplate from './FreelancerTemplate';
import AcademicTemplate from './AcademicTemplate';
import PhotographerTemplate from './PhotographerTemplate';
import WriterTemplate from './WriterTemplate';
import ConsultantTemplate from './ConsultantTemplate';
import ArtistTemplate from './ArtistTemplate';

export const PORTFOLIO_TEMPLATE_REGISTRY = {
  modern: {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Clean and modern design with gradient accents',
    category: 'professional',
    component: ModernTemplate,
    preview: '/templates/modern-preview.jpg'
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Minimalist design focusing on content',
    category: 'minimal',
    component: MinimalTemplate,
    preview: '/templates/minimal-preview.jpg'
  },
  creative: {
    id: 'creative',
    name: 'Creative Showcase',
    description: 'Bold and creative layout for designers',
    category: 'creative',
    component: CreativeTemplate,
    preview: '/templates/creative-preview.jpg'
  },
  developer: {
    id: 'developer',
    name: 'Developer Focus',
    description: 'Tech-focused layout with code snippets',
    category: 'tech',
    component: DeveloperTemplate,
    preview: '/templates/developer-preview.jpg'
  },
  corporate: {
    id: 'corporate',
    name: 'Corporate Executive',
    description: 'Professional corporate style',
    category: 'corporate',
    component: CorporateTemplate,
    preview: '/templates/corporate-preview.jpg'
  },
  startup: {
    id: 'startup',
    name: 'Startup Founder',
    description: 'Dynamic layout for entrepreneurs',
    category: 'startup',
    component: StartupTemplate,
    preview: '/templates/startup-preview.jpg'
  },
  freelancer: {
    id: 'freelancer',
    name: 'Freelancer',
    description: 'Flexible layout for freelancers',
    category: 'freelance',
    component: FreelancerTemplate,
    preview: '/templates/freelancer-preview.jpg'
  },
  academic: {
    id: 'academic',
    name: 'Academic Researcher',
    description: 'Academic and research focused',
    category: 'academic',
    component: AcademicTemplate,
    preview: '/templates/academic-preview.jpg'
  },
  photographer: {
    id: 'photographer',
    name: 'Photography Portfolio',
    description: 'Image-heavy layout for photographers',
    category: 'creative',
    component: PhotographerTemplate,
    preview: '/templates/photographer-preview.jpg'
  },
  writer: {
    id: 'writer',
    name: 'Writer & Blogger',
    description: 'Content-focused layout for writers',
    category: 'content',
    component: WriterTemplate,
    preview: '/templates/writer-preview.jpg'
  },
  consultant: {
    id: 'consultant',
    name: 'Business Consultant',
    description: 'Professional consulting layout',
    category: 'corporate',
    component: ConsultantTemplate,
    preview: '/templates/consultant-preview.jpg'
  },
  artist: {
    id: 'artist',
    name: 'Digital Artist',
    description: 'Creative layout for digital artists',
    category: 'creative',
    component: ArtistTemplate,
    preview: '/templates/artist-preview.jpg'
  }
};

export const getPortfolioTemplateById = (id) => {
  return PORTFOLIO_TEMPLATE_REGISTRY[id] || PORTFOLIO_TEMPLATE_REGISTRY.modern;
};

export const getPortfolioTemplatesByCategory = (category) => {
  return Object.values(PORTFOLIO_TEMPLATE_REGISTRY).filter(template => template.category === category);
};

export const getAllPortfolioTemplates = () => {
  return Object.values(PORTFOLIO_TEMPLATE_REGISTRY);
};

export const getPortfolioTemplateCategories = () => {
  const categories = new Set();
  Object.values(PORTFOLIO_TEMPLATE_REGISTRY).forEach(template => {
    categories.add(template.category);
  });
  return Array.from(categories);
};

export default PORTFOLIO_TEMPLATE_REGISTRY;
