# Deployment Guide

This guide provides instructions for deploying the Job Portal application in production.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for local development)
- MongoDB 5.0+ (if not using Docker)

## Deployment Options

### 1. Docker Deployment (Recommended)

The easiest way to deploy the application is using Docker Compose:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd job-portal
   ```

2. Update the environment variables in `docker-compose.yml`:
   - Change the MongoDB root password
   - Update the JWT secret
   - Set the client URL

3. Build and start the services:
   ```bash
   docker-compose up -d
   ```

4. The application will be available at:
   - Backend API: http://localhost:5000
   - MongoDB: mongodb://admin:password@localhost:27017/jobportal

### 2. Manual Deployment

If you prefer to deploy manually:

1. Install dependencies:
   ```bash
   cd server
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file in the `server` directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/jobportal
   JWT_SECRET=your-super-secret-jwt-key
   CLIENT_URL=http://localhost:5173
   LOG_LEVEL=info
   LOG_DIR=./logs
   ```

3. Start the server:
   ```bash
   npm start
   ```

## Environment Variables

The following environment variables are required:

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/jobportal |
| JWT_SECRET | Secret key for JWT tokens | your-super-secret-jwt-key |
| CLIENT_URL | Frontend URL | http://localhost:5173 |
| LOG_LEVEL | Logging level | info |
| LOG_DIR | Log files directory | ./logs |

## Security Considerations

1. Always use a strong JWT secret
2. Use HTTPS in production
3. Set up proper firewall rules
4. Regularly update dependencies
5. Monitor logs for suspicious activity

## Monitoring

The application includes built-in logging with Winston:

- Error logs: `logs/error.log`
- Combined logs: `logs/combined.log`
- Request logs: `logs/requests.log`
- Error logs: `logs/errors.log`

## Scaling

For production deployments, consider:

1. Using a reverse proxy like Nginx
2. Setting up a load balancer
3. Using a managed MongoDB service
4. Implementing a CDN for static assets
5. Setting up automated backups

## Backup and Recovery

Regularly backup your MongoDB database:

```bash
mongodump --uri="mongodb://admin:password@localhost:27017/jobportal"
```

## Troubleshooting

If you encounter issues:

1. Check the logs in the `logs` directory
2. Ensure all environment variables are set correctly
3. Verify MongoDB is running and accessible
4. Check Docker container status if using Docker deployment