# Deployment Guide - AI Resume & Portfolio Builder

## Environment Variables

### Backend (.env or application.yml)

```yaml
# Database
spring:
  datasource:
    url: jdbc:postgresql://your-db-host:5432/resume_portfolio_builder
    username: your_db_user
    password: your_db_password

# JWT
jwt:
  secret: your_jwt_secret_key_here
  expiration: 86400000

# OpenAI
openai:
  api:
    key: your_openai_api_key
    url: https://api.openai.com/v1

# Google Vision OCR
GOOGLE_APPLICATION_CREDENTIALS: /path/to/service-account.json
GCP_PROJECT_ID: your-gcp-project-id

# Stripe
stripe:
  api:
    key: sk_test_your_stripe_key
  webhook:
    secret: whsec_your_webhook_secret

# Email (SMTP)
spring:
  mail:
    host: smtp.gmail.com
    port: 587
    username: your_email@gmail.com
    password: your_app_password
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true

app:
  email:
    enabled: true
  base:
    url: https://your-domain.com
  ai:
    monthly:
      free:
        calls: 20

# Server
server:
  port: 8081
```

### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:8081/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

## Database Setup

1. Run the SQL script:
```bash
psql -U postgres -d resume_portfolio_builder -f database/setup.sql
```

2. Verify tables are created:
```sql
\dt
```

## Build & Deploy

### Backend (Spring Boot)

```bash
cd backend
./mvnw clean package -DskipTests
java -jar target/ai-resume-portfolio-builder-0.0.1-SNAPSHOT.jar
```

### Frontend (React)

```bash
cd frontend
npm install
npm run build
# Serve build/ directory with nginx or deploy to Vercel/Netlify
```

## Deployment Platforms

### Render.com

1. **Backend**: Create new Web Service
   - Build: `cd backend && ./mvnw clean package`
   - Start: `java -jar target/ai-resume-portfolio-builder-0.0.1-SNAPSHOT.jar`
   - Add environment variables from above

2. **Database**: Create PostgreSQL database
   - Run `setup.sql` via Render SQL Editor

3. **Frontend**: Create Static Site
   - Build: `npm install && npm run build`
   - Publish: `build/` directory

### AWS EC2

1. Install Java 17, Node.js, PostgreSQL
2. Clone repository
3. Set up systemd service for backend
4. Configure nginx for frontend
5. Set up SSL with Let's Encrypt

### Railway

1. Connect GitHub repository
2. Add PostgreSQL service
3. Configure environment variables
4. Deploy both services

## Admin Setup

To create an admin user:

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

## Stripe Webhook Setup

1. Create webhook endpoint in Stripe Dashboard
2. URL: `https://your-domain.com/api/payment/webhook`
3. Events: `checkout.session.completed`, `payment_intent.succeeded`
4. Copy webhook secret to `stripe.webhook.secret`

## Monitoring

- Check logs: `tail -f logs/application.log`
- Monitor exports: `SELECT * FROM exports_log ORDER BY created_at DESC LIMIT 10;`
- Monitor AI usage: `SELECT * FROM ai_logs WHERE success = true;`

## Troubleshooting

1. **OCR not working**: Verify `GOOGLE_APPLICATION_CREDENTIALS` path
2. **Email not sending**: Check SMTP credentials and `app.email.enabled`
3. **Stripe errors**: Verify API keys and webhook secret
4. **Database connection**: Verify connection string and credentials

