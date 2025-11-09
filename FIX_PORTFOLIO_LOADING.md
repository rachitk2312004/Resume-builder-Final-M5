# Fix Portfolio Loading Error

## Problem
The dashboard shows error: "Failed to load portfolios: JDBC exception" due to database schema mismatch.

## Solution

### Option 1: Run Database Migration (Recommended)
Run the SQL script to add missing columns to the portfolios table:

```bash
psql -d your_database_name -f database/fix-portfolios-table.sql
```

Or execute the SQL directly:
```sql
-- Add missing columns if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portfolios' AND column_name='slug') THEN
        ALTER TABLE portfolios ADD COLUMN slug VARCHAR(255) UNIQUE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portfolios' AND column_name='template_id') THEN
        ALTER TABLE portfolios ADD COLUMN template_id VARCHAR(50) NOT NULL DEFAULT 'modern';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portfolios' AND column_name='views_count') THEN
        ALTER TABLE portfolios ADD COLUMN views_count BIGINT NOT NULL DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portfolios' AND column_name='seo_title') THEN
        ALTER TABLE portfolios ADD COLUMN seo_title VARCHAR(255);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portfolios' AND column_name='seo_description') THEN
        ALTER TABLE portfolios ADD COLUMN seo_description TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portfolios' AND column_name='seo_image_url') THEN
        ALTER TABLE portfolios ADD COLUMN seo_image_url VARCHAR(500);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portfolios' AND column_name='updated_at') THEN
        ALTER TABLE portfolios ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;
```

### Option 2: Temporary Fix (Already Applied)
The code has been updated to:
- Return empty list on error instead of crashing
- Log errors for debugging
- Allow dashboard to load even if portfolios fail

This means the dashboard will work, but portfolios won't load until the database is fixed.

## Verification
After running the migration:
1. Restart the backend server
2. Refresh the dashboard
3. Check backend logs for any remaining errors
4. Portfolios should now load correctly

## Files Changed
- `PortfolioController.java` - Added graceful error handling
- `PortfolioService.java` - Added error handling in service layer
- `PortfolioRepository.java` - Added explicit @Query annotation

