# Module 3: Portfolio Site Builder

## Overview

Module 3 extends the AI-powered Resume & Portfolio Builder with a comprehensive portfolio site builder that allows users to create professional portfolio websites from scratch or by importing existing resume data.

## Features Implemented

### 1. Portfolio Templates (12 Templates)
- **Modern Professional**: Clean design with gradient accents
- **Minimal Clean**: Minimalist design focusing on content
- **Creative Showcase**: Bold layout for designers
- **Developer Focus**: Tech-focused with terminal styling
- **Corporate Executive**: Professional corporate style
- **Startup Founder**: Dynamic layout for entrepreneurs
- **Freelancer**: Flexible layout for freelancers
- **Academic Researcher**: Academic and research focused
- **Photography Portfolio**: Image-heavy layout for photographers
- **Writer & Blogger**: Content-focused layout for writers
- **Business Consultant**: Professional consulting layout
- **Digital Artist**: Creative layout for digital artists

### 2. Resume Import Functionality
- Import existing resume data to prefill portfolio fields
- Automatic conversion from resume JSON to portfolio format
- Template selection during import process

### 3. Chat-driven Build Interface
- Floating chatbox editor for natural language editing
- AI-powered content suggestions and improvements
- Natural language commands for portfolio modifications

### 4. Section-Level Customization
- Drag-and-drop section reordering
- Toggle visibility for sections
- Multiple layout variants per section
- Style controls (font size, accent color, dark/light mode)

### 5. Publishing System
- Unique slug URLs: `yoursite.com/u/{username-slug}`
- Public/private portfolio management
- SEO meta tags auto-generation
- Social sharing buttons (LinkedIn, Twitter, GitHub)

### 6. Analytics Dashboard
- Portfolio view tracking
- Unique visitor counting
- 7-day and 30-day view charts
- Real-time analytics display

## Technical Implementation

### Backend Architecture

#### Database Schema
```sql
-- Enhanced portfolios table
CREATE TABLE portfolios (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    template_id VARCHAR(50) NOT NULL DEFAULT 'modern',
    status VARCHAR(20) NOT NULL DEFAULT 'IN_PROGRESS',
    json_content TEXT,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    public_link VARCHAR(255) UNIQUE,
    views_count BIGINT NOT NULL DEFAULT 0,
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_image_url VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Portfolio analytics table
CREATE TABLE portfolio_analytics (
    id BIGSERIAL PRIMARY KEY,
    portfolio_id BIGINT NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    ip_hash VARCHAR(64) NOT NULL,
    user_agent TEXT,
    referrer VARCHAR(500),
    country VARCHAR(100),
    city VARCHAR(100),
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Portfolio templates table
CREATE TABLE portfolio_templates (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    preview_image_url VARCHAR(500),
    category VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

#### New Entities
- `PortfolioAnalytics`: Tracks portfolio views and visitor data
- `PortfolioTemplate`: Manages available portfolio templates

#### Enhanced Services
- `PortfolioAnalyticsService`: Handles view tracking and analytics
- `PortfolioTemplateService`: Manages template operations
- Enhanced `PortfolioService`: Added slug management, publishing, and resume import

#### New API Endpoints
```
GET    /api/portfolios/slug/{slug}           - Get portfolio by slug
POST   /api/portfolios/from-resume           - Create portfolio from resume
PUT    /api/portfolios/{id}/slug             - Update portfolio slug
POST   /api/portfolios/{id}/publish          - Publish portfolio
POST   /api/portfolios/{id}/unpublish        - Unpublish portfolio
GET    /api/portfolios/{id}/analytics        - Get portfolio analytics
GET    /api/portfolios/{id}/analytics/chart   - Get analytics chart data

GET    /api/portfolio-templates               - Get all templates
GET    /api/portfolio-templates/{id}          - Get template by ID
GET    /api/portfolio-templates/category/{category} - Get templates by category
GET    /api/portfolio-templates/categories   - Get template categories
```

### Frontend Architecture

#### Template System
- `PortfolioTemplateRegistry`: Central registry for all portfolio templates
- Individual template components: `ModernTemplate`, `MinimalTemplate`, `CreativeTemplate`, etc.
- Consistent styling with Tailwind CSS
- Responsive design for all screen sizes

#### Portfolio Builder Interface
- **Tabbed Navigation**: Content, Experience, Projects, Skills, Settings
- **Live Preview**: Real-time template rendering
- **Template Selector**: Modal with template gallery
- **Resume Import**: Modal for importing resume data
- **AI Chat Interface**: Natural language editing commands
- **Analytics Sidebar**: Real-time view statistics

#### Key Components
- `PortfolioBuilderPage`: Main builder interface
- `PublicPortfolioPage`: Public portfolio display
- Template components with consistent data structure

## Usage Guide

### Creating a Portfolio

1. **From Scratch**:
   - Navigate to Portfolio Builder
   - Choose a template
   - Fill in content sections
   - Customize styling and layout
   - Publish when ready

2. **From Resume**:
   - Click "Import Resume" button
   - Select existing resume
   - Choose template
   - Review and customize imported data
   - Publish when ready

### Customizing Portfolio

1. **Content Management**:
   - Use tabbed interface to edit different sections
   - Add/remove experience, projects, skills
   - Update personal information and contact details

2. **Template Selection**:
   - Click "Templates" button
   - Browse available templates
   - Preview and select desired template

3. **AI-Powered Editing**:
   - Click "AI Chat" button
   - Use natural language commands:
     - "Add a new project with React and Node.js"
     - "Improve my about section"
     - "Change theme to dark mode"

### Publishing and Sharing

1. **Publishing**:
   - Click "Publish" button
   - Set custom slug (optional)
   - Configure SEO settings
   - Portfolio becomes publicly accessible

2. **Sharing**:
   - Copy portfolio URL
   - Share on social media
   - Embed in other websites

### Analytics

1. **View Analytics**:
   - Check sidebar for real-time statistics
   - View total views and unique visitors
   - Access detailed analytics dashboard

## Integration with Existing Modules

### Module 1 (Authentication & Dashboard)
- Seamless integration with existing user authentication
- Portfolio management in dashboard
- User profile integration

### Module 2 (Resume Builder)
- Resume import functionality
- Shared data structures
- Consistent user experience

## File Structure

```
frontend/src/
├── components/templates/
│   ├── PortfolioTemplateRegistry.js
│   ├── ModernTemplate.js
│   ├── MinimalTemplate.js
│   ├── CreativeTemplate.js
│   ├── DeveloperTemplate.js
│   └── [other templates]
├── pages/
│   ├── PortfolioBuilderPage.js
│   └── PublicPortfolioPage.js
└── services/
    └── api.js (enhanced with portfolio endpoints)

backend/src/main/java/com/resumebuilder/
├── entity/
│   ├── Portfolio.java (enhanced)
│   ├── PortfolioAnalytics.java
│   └── PortfolioTemplate.java
├── repository/
│   ├── PortfolioRepository.java (enhanced)
│   ├── PortfolioAnalyticsRepository.java
│   └── PortfolioTemplateRepository.java
├── service/
│   ├── PortfolioService.java (enhanced)
│   ├── PortfolioAnalyticsService.java
│   └── PortfolioTemplateService.java
├── controller/
│   ├── PortfolioController.java (enhanced)
│   └── PortfolioTemplateController.java
└── dto/
    ├── PortfolioDto.java (enhanced)
    ├── PortfolioAnalyticsDto.java
    └── PortfolioTemplateDto.java
```

## Future Enhancements

1. **Advanced AI Features**:
   - Content optimization suggestions
   - A/B testing for different layouts
   - Automated SEO improvements

2. **Custom Domain Support**:
   - Custom domain mapping
   - SSL certificate management
   - DNS configuration

3. **Advanced Analytics**:
   - Heat maps
   - User journey tracking
   - Conversion tracking

4. **Collaboration Features**:
   - Team portfolio management
   - Client review system
   - Comment and feedback system

## Conclusion

Module 3 successfully delivers a comprehensive portfolio site builder that integrates seamlessly with the existing resume builder system. The implementation provides users with professional portfolio creation tools, multiple template options, AI-powered assistance, and robust analytics capabilities.

The system is designed to be scalable, maintainable, and user-friendly, providing a complete solution for professional portfolio creation and management.
