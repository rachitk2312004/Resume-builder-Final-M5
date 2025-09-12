# Database Setup with Render PostgreSQL

## 🚀 Using Your Render PostgreSQL Database

Your Render PostgreSQL database is already configured and ready to use! Here's how to set it up:

### Database Connection Details
- **Host**: dpg-d3160s0dl3ps73e3lddg-a.oregon-postgres.render.com
- **Port**: 5432
- **Database**: resume_portfolio_builder
- **Username**: resume_portfolio_builder_user
- **Password**: ViEfLKIh9yeeno61M9pVOLpqjYrmzFtj

### Option 1: Automatic Setup (Recommended)

The Spring Boot application is configured with `ddl-auto: update`, which means it will automatically create the tables when you start the application. Simply run:

```bash
cd backend
mvn spring-boot:run
```

The application will automatically create all necessary tables and relationships.

### Option 2: Manual Setup

If you prefer to set up the database manually, you can run the SQL script:

1. **Connect to your Render database** using any PostgreSQL client (pgAdmin, DBeaver, etc.)
2. **Run the setup script**:
   ```sql
   -- Copy and paste the contents of database/setup-render.sql
   ```

### Option 3: Command Line Setup

If you have `psql` installed locally, you can run:

```bash
psql "postgresql://resume_portfolio_builder_user:ViEfLKIh9yeeno61M9pVOLpqjYrmzFtj@dpg-d3160s0dl3ps73e3lddg-a.oregon-postgres.render.com:5432/resume_portfolio_builder" -f database/setup-render.sql
```

## 🔧 Configuration

The application is already configured to use your Render database. The connection details are set in:

`backend/src/main/resources/application.yml`

```yaml
spring:
  datasource:
    url: jdbc:postgresql://dpg-d3160s0dl3ps73e3lddg-a.oregon-postgres.render.com:5432/resume_portfolio_builder
    username: resume_portfolio_builder_user
    password: ViEfLKIh9yeeno61M9pVOLpqjYrmzFtj
    driver-class-name: org.postgresql.Driver
```

## 🚀 Running the Application

1. **Start the Backend**:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. **Start the Frontend**:
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Access the Application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080

## ✅ Verification

To verify everything is working:

1. **Check Database Connection**: Look for "Started AiResumePortfolioBuilderApplication" in the backend logs
2. **Test Registration**: Try creating a new account on the frontend
3. **Check Tables**: You can verify tables were created by connecting to your Render database

## 🔒 Security Notes

- Your database credentials are now in the configuration files
- For production, consider using environment variables instead of hardcoded credentials
- Render provides SSL connections by default, so your data is encrypted in transit

## 🆘 Troubleshooting

If you encounter connection issues:

1. **Check Render Dashboard**: Ensure your database is running
2. **Verify Credentials**: Double-check the connection string
3. **Check Firewall**: Render databases are accessible from anywhere by default
4. **Test Connection**: Use a PostgreSQL client to test the connection

## 📊 Database Schema

The following tables will be created:

- **users**: User accounts and profiles
- **resumes**: Resume documents and metadata
- **portfolios**: Portfolio documents and metadata

All tables include proper relationships, indexes, and auto-updating timestamps.

---

Your Render PostgreSQL database is now ready to use! The application will automatically handle table creation and data management.
