# Coolify Deployment Guide for Wahy Frontend

## Prerequisites
- Coolify instance running
- GitHub repository connected to Coolify
- Backend API URL ready

## Deployment Steps

### 1. Connect to Coolify
1. Open your Coolify dashboard
2. Go to **Applications** → **Add Application**
3. Select **Docker Compose**
4. Connect your GitHub repository (Wahy-inc/Wahy-frontend)

### 2. Configure Deployment
- **Repository**: Wahy-inc/Wahy-frontend
- **Branch**: main
- **Compose File Path**: `docker-compose.yaml` (default)

### 3. Set Environment Variables
In Coolify dashboard, add:
```
BACKEND_URL=https://your-api-backend.com  (required)
NODE_ENV=production                         (optional, defaults to production)
PORT=3000                                   (optional, defaults to 3000)
```

### 4. Port Configuration
- **Internal Port**: 3000
- **External Port**: Configured by Coolify (or specify in docker-compose.yaml)

### 5. Deployment Trigger
- Push to `main` branch
- Coolify automatically builds and deploys
- Build time: ~3-5 minutes

## Monitoring
- Logs: Check in Coolify dashboard
- Health Check: Automatic every 30 seconds
- Restarts: Automatic on failure

## Important Notes
- The app builds inside Docker (not pre-built)
- `.env.local` on server is not used; use Coolify environment variables
- Consider setting up a reverse proxy (Nginx) in front for:
  - SSL/HTTPS
  - Caching static assets
  - Load balancing (if multiple instances)

## Troubleshooting

### Build fails
- Check `BACKEND_URL` is valid
- Ensure Node 18+ (specified in package.json)
- Check Docker logs

### App crashes on start
- Verify `BACKEND_URL` environment variable is set
- Check health check logs
- Ensure port 3000 is available

### API calls fail
- Verify `BACKEND_URL` points to correct backend
- Check CORS headers in next.config.ts
- Test backend connectivity

## Additional Resources
- [Coolify Documentation](https://coolify.io)
- [Docker Compose Reference](https://docs.docker.com/compose)
- [Next.js Production Checklist](https://nextjs.org/docs/going-to-production)
