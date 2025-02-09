# Frontend-Backend Integration Project

Simple integration between a Node.js frontend and Flask backend using Docker containers.

## Architecture Overview

- **Frontend**: Node.js/Express server serving HTML with client-side API calls
- **Backend**: Flask API server providing JSON responses
- **Docker**: Container orchestration with dedicated network for service communication
- **Configuration**: Environment variables for flexible deployment settings
- **Monitoring**: Prometheus-Grafana stack deployed with configured Prometheus scrape_configs and Grafana dashboards

## Requirements

- Docker and Docker Compose v3.8+
- Node.js 23+ (for local development)
- Python 3.13+ (for local development)
- Required packages listed in package.json and requirements.txt

## Setup Instructions

1. **install**
   ```bash
   chmod +x scripts/install.sh  
   scripts/install.sh 
   ```

2. **uninstall**
   ```bash
   chmod +x scripts/uninstall.sh  
   scripts/uninstall.sh 
   ```

3. **Access Services**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api/v1

### Environment Setup
Create `.env` files in respective directories:

**Frontend**
```
FRONTEND_PORT=3000
BROWSER_BACKEND_URL=http://localhost:5000/api/v1
```

**Backend**
```
API_BASE=/api/v1
MESSAGE_CONTENT=Hello, World!
```

## Troubleshooting

- **Connection Refused**: Check if containers are running (`docker-compose ps`)
- **API Unreachable**: Verify CORS configuration and port mappings
- **Container Issues**: Check logs (`docker-compose logs <service-name>`)
- **Prometheus UI**: Browse to http://localhost:9090/targets
- **Grafana Dashboards**: Browse to http://localhost:3000/ (`credentials: admin:grafana`)

For simple debugging:
```bash
# Check container status
docker-compose ps

# Test FronEnd (or use browser instead)
curl http://localhost:8080/

# Test API
curl http://localhost:5000/api/v1
```