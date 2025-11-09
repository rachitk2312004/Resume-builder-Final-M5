package com.resumebuilder.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;

@Component
public class DatabaseMigrationRunner implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        try {
            System.out.println("Running database migration for portfolios table...");
            
            // Execute the migration SQL
            String migrationSQL = """
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
                """;
            
            jdbcTemplate.execute(migrationSQL);
            
            // Create indexes if they don't exist
            try {
                jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_portfolios_slug ON portfolios(slug)");
            } catch (Exception e) {
                System.out.println("Index idx_portfolios_slug might already exist: " + e.getMessage());
            }
            
            try {
                jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON portfolios(user_id)");
            } catch (Exception e) {
                System.out.println("Index idx_portfolios_user_id might already exist: " + e.getMessage());
            }
            
            try {
                jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_portfolios_public_link ON portfolios(public_link)");
            } catch (Exception e) {
                System.out.println("Index idx_portfolios_public_link might already exist: " + e.getMessage());
            }
            
            // Create trigger function if it doesn't exist
            String triggerFunctionSQL = """
                CREATE OR REPLACE FUNCTION update_updated_at_column()
                RETURNS TRIGGER AS $$
                BEGIN
                    NEW.updated_at = CURRENT_TIMESTAMP;
                    RETURN NEW;
                END;
                $$ language 'plpgsql';
                """;
            jdbcTemplate.execute(triggerFunctionSQL);
            
            // Create trigger if it doesn't exist
            try {
                jdbcTemplate.execute("DROP TRIGGER IF EXISTS update_portfolios_updated_at ON portfolios");
                jdbcTemplate.execute("""
                    CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON portfolios
                        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
                    """);
            } catch (Exception e) {
                System.out.println("Trigger might already exist: " + e.getMessage());
            }
            
            System.out.println("Database migration completed successfully!");
            
        } catch (Exception e) {
            System.err.println("Error running database migration: " + e.getMessage());
            e.printStackTrace();
            // Don't fail the application startup if migration fails
            // The graceful error handling will still allow the app to work
        }
    }
}

