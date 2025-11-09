-- Fix portfolios table - add missing columns if they don't exist
-- This script adds any missing columns to the portfolios table

DO $$
BEGIN
    -- Add slug column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portfolios' AND column_name='slug') THEN
        ALTER TABLE portfolios ADD COLUMN slug VARCHAR(255) UNIQUE;
    END IF;

    -- Add template_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portfolios' AND column_name='template_id') THEN
        ALTER TABLE portfolios ADD COLUMN template_id VARCHAR(50) NOT NULL DEFAULT 'modern';
    END IF;

    -- Add views_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portfolios' AND column_name='views_count') THEN
        ALTER TABLE portfolios ADD COLUMN views_count BIGINT NOT NULL DEFAULT 0;
    END IF;

    -- Add seo_title column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portfolios' AND column_name='seo_title') THEN
        ALTER TABLE portfolios ADD COLUMN seo_title VARCHAR(255);
    END IF;

    -- Add seo_description column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portfolios' AND column_name='seo_description') THEN
        ALTER TABLE portfolios ADD COLUMN seo_description TEXT;
    END IF;

    -- Add seo_image_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portfolios' AND column_name='seo_image_url') THEN
        ALTER TABLE portfolios ADD COLUMN seo_image_url VARCHAR(500);
    END IF;

    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portfolios' AND column_name='updated_at') THEN
        ALTER TABLE portfolios ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
    END IF;

    -- Ensure created_at has a default value if it doesn't
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portfolios' AND column_name='created_at' AND is_nullable='YES') THEN
        ALTER TABLE portfolios ALTER COLUMN created_at SET NOT NULL;
        ALTER TABLE portfolios ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_portfolios_slug ON portfolios(slug);
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolios_public_link ON portfolios(public_link);

-- Create trigger for updated_at if it doesn't exist
DROP TRIGGER IF EXISTS update_portfolios_updated_at ON portfolios;
CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON portfolios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

