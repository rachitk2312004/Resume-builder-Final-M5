-- Database setup script for AI Resume & Portfolio Builder
-- Run this script to create the database and tables
-- Note: For Render PostgreSQL, the database is already created
-- Connect to the database: resume_portfolio_builder

-- Create users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_public_by_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create resumes table
CREATE TABLE resumes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    template_id INTEGER,
    status VARCHAR(20) NOT NULL DEFAULT 'IN_PROGRESS',
    json_content TEXT,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    public_link VARCHAR(255) UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create portfolios table
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

-- Create portfolio analytics table
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

-- Create portfolio templates table
CREATE TABLE portfolio_templates (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    preview_image_url VARCHAR(500),
    category VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Resume versions table
CREATE TABLE resume_versions (
    id BIGSERIAL PRIMARY KEY,
    resume_id BIGINT NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    json_content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_resumes_public_link ON resumes(public_link);
CREATE INDEX idx_resume_versions_resume_id ON resume_versions(resume_id);
CREATE INDEX idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX idx_portfolios_public_link ON portfolios(public_link);
CREATE INDEX idx_portfolios_slug ON portfolios(slug);
CREATE INDEX idx_portfolio_analytics_portfolio_id ON portfolio_analytics(portfolio_id);
CREATE INDEX idx_portfolio_analytics_timestamp ON portfolio_analytics(timestamp);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resumes_updated_at BEFORE UPDATE ON resumes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON portfolios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional)
INSERT INTO users (name, email, password_hash, is_public_by_default) VALUES
('John Doe', 'john@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', false),
('Jane Smith', 'jane@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', true);

-- Insert sample resumes
INSERT INTO resumes (user_id, title, status, json_content, is_public, public_link) VALUES
(1, 'Software Engineer Resume', 'COMPLETED', '{"name": "John Doe", "title": "Software Engineer", "experience": []}', true, 'john-doe-software-engineer'),
(1, 'Senior Developer Resume', 'IN_PROGRESS', '{"name": "John Doe", "title": "Senior Developer", "experience": []}', false, NULL),
(2, 'UX Designer Portfolio', 'COMPLETED', '{"name": "Jane Smith", "title": "UX Designer", "projects": []}', true, 'jane-smith-ux-designer');

-- Insert portfolio templates
INSERT INTO portfolio_templates (id, name, description, category) VALUES
('modern', 'Modern Professional', 'Clean and modern design with gradient accents', 'professional'),
('minimal', 'Minimal Clean', 'Minimalist design focusing on content', 'minimal'),
('creative', 'Creative Showcase', 'Bold and creative layout for designers', 'creative'),
('developer', 'Developer Focus', 'Tech-focused layout with code snippets', 'tech'),
('corporate', 'Corporate Executive', 'Professional corporate style', 'corporate'),
('startup', 'Startup Founder', 'Dynamic layout for entrepreneurs', 'startup'),
('freelancer', 'Freelancer', 'Flexible layout for freelancers', 'freelance'),
('academic', 'Academic Researcher', 'Academic and research focused', 'academic'),
('photographer', 'Photography Portfolio', 'Image-heavy layout for photographers', 'creative'),
('writer', 'Writer & Blogger', 'Content-focused layout for writers', 'content'),
('consultant', 'Business Consultant', 'Professional consulting layout', 'corporate'),
('artist', 'Digital Artist', 'Creative layout for digital artists', 'creative');

-- Insert sample portfolios
INSERT INTO portfolios (user_id, title, slug, template_id, status, json_content, is_public, public_link, views_count) VALUES
(1, 'Developer Portfolio', 'john-doe-developer', 'developer', 'COMPLETED', '{"name": "John Doe", "title": "Full Stack Developer", "projects": []}', true, 'john-doe-developer-portfolio', 150),
(2, 'Design Portfolio', 'jane-smith-design', 'creative', 'COMPLETED', '{"name": "Jane Smith", "title": "UX/UI Designer", "projects": []}', true, 'jane-smith-design-portfolio', 89);

-- AI Module tables
CREATE TABLE IF NOT EXISTS ai_logs (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    tokens_used INTEGER,
    model VARCHAR(100),
    success BOOLEAN NOT NULL DEFAULT TRUE,
    notes VARCHAR(2000),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ats_scores (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    resume_id BIGINT NOT NULL,
    score INTEGER NOT NULL,
    keywords TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS job_analysis_cache (
    id SERIAL PRIMARY KEY,
    job_id VARCHAR(255) UNIQUE NOT NULL,
    parsed_data TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Module 5: Export, Admin, Monetization & Operations Tables

-- Exports log table
CREATE TABLE IF NOT EXISTS exports_log (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resume_id BIGINT REFERENCES resumes(id) ON DELETE SET NULL,
    portfolio_id BIGINT REFERENCES portfolios(id) ON DELETE SET NULL,
    export_type VARCHAR(20) NOT NULL, -- PDF, DOCX, TEXT, SHARE
    file_path VARCHAR(500),
    file_size BIGINT,
    email_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    link VARCHAR(500),
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Billing history table
CREATE TABLE IF NOT EXISTS billing_history (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stripe_payment_intent_id VARCHAR(255) UNIQUE,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) NOT NULL, -- pending, completed, failed, refunded
    plan_type VARCHAR(50), -- free, pro, enterprise
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Admin logs table
CREATE TABLE IF NOT EXISTS admin_logs (
    id BIGSERIAL PRIMARY KEY,
    admin_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50), -- user, template, portfolio, etc.
    target_id BIGINT,
    details TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100),
    subscribed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- User activity logs table
CREATE TABLE IF NOT EXISTS user_activity_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL, -- login, resume_edit, export, etc.
    details TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add role column to users table if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='role') THEN
        ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='subscription_tier') THEN
        ALTER TABLE users ADD COLUMN subscription_tier VARCHAR(20) DEFAULT 'free';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='ai_credits') THEN
        ALTER TABLE users ADD COLUMN ai_credits INTEGER DEFAULT 20;
    END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_exports_log_user_id ON exports_log(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_billing_history_user_id ON billing_history(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_user_id ON admin_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_id ON user_activity_logs(user_id);

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON DATABASE resume_builder TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;
