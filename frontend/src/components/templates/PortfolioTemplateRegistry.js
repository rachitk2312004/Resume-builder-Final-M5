import React from 'react';

// Import portfolio templates with unique designs
import ModernTemplate from './ModernTemplate';
import MinimalTemplate from './MinimalTemplate';
import CreativeTemplate from './CreativeTemplate';
import DeveloperTemplate from './DeveloperTemplate';
import CorporateTemplate from './CorporateTemplate';
import StartupTemplate from './StartupTemplate';
import FreelancerTemplate from './FreelancerTemplate';
import AcademicTemplate from './AcademicTemplate';
import ArtistTemplate from './ArtistTemplate';
import ConsultantTemplate from './ConsultantTemplate';
import PhotographerTemplate from './PhotographerTemplate';
import WriterTemplate from './WriterTemplate';

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
    description: 'Tech-focused layout with code snippets and dark theme',
    category: 'tech',
    component: DeveloperTemplate,
    preview: '/templates/developer-preview.jpg'
  },
  corporate: {
    id: 'corporate',
    name: 'Corporate Executive',
    description: 'Professional corporate style with formal layout',
    category: 'business',
    component: CorporateTemplate,
    preview: '/templates/corporate-preview.jpg'
  },
  startup: {
    id: 'startup',
    name: 'Startup Founder',
    description: 'Dynamic layout for entrepreneurs with vibrant colors',
    category: 'startup',
    component: StartupTemplate,
    preview: '/templates/startup-preview.jpg'
  },
  freelancer: {
    id: 'freelancer',
    name: 'Freelancer Portfolio',
    description: 'Flexible layout for freelancers with project showcase',
    category: 'freelance',
    component: FreelancerTemplate,
    preview: '/templates/freelancer-preview.jpg'
  },
  academic: {
    id: 'academic',
    name: 'Academic Researcher',
    description: 'Scholarly layout for academics and researchers',
    category: 'academic',
    component: AcademicTemplate,
    preview: '/templates/academic-preview.jpg'
  },
  artist: {
    id: 'artist',
    name: 'Artist Portfolio',
    description: 'Creative showcase for artists and designers',
    category: 'creative',
    component: ArtistTemplate,
    preview: '/templates/artist-preview.jpg'
  },
  consultant: {
    id: 'consultant',
    name: 'Consultant',
    description: 'Professional layout for consultants',
    category: 'business',
    component: ConsultantTemplate,
    preview: '/templates/consultant-preview.jpg'
  },
  photographer: {
    id: 'photographer',
    name: 'Photographer',
    description: 'Visual portfolio for photographers',
    category: 'creative',
    component: PhotographerTemplate,
    preview: '/templates/photographer-preview.jpg'
  },
  writer: {
    id: 'writer',
    name: 'Writer Portfolio',
    description: 'Minimal layout for writers and authors',
    category: 'minimal',
    component: WriterTemplate,
    preview: '/templates/writer-preview.jpg'
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
