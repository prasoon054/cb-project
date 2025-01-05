# Deployment Guide: Building, Running, and Deploying the Project
## I. Local Development: Building and Running with Docker Compose
### 1. Prerequisites:

- Install Docker and Docker Compose.
- Clone the repository to your local machine:

```bash
git clone https://github.com/prasoon054/cb-project
cd cb-project
```

### 2. Environment Variables:

- Create .env files for each service (e.g., user-service/.env, blog-service/.env, comment-service/.env):
```bash
# Example .env file for user-service
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=200521
DB_NAME=cb_db
JWT_SECRET=<your-secret>
```
- Update docker-compose.yaml to reference these .env files if not already configured.

### 3. Build and Run Services:

- Use Docker Compose to build and start all services:
```bash
docker-compose up --build
```
- Verify services are running:
    - User Service: http://localhost:5000
    - Blog Service: http://localhost:5001
    - Comment Service: http://localhost:5002

### 4. Testing Locally:

- Test API endpoints using tools like Postman or cURL. Example:
```bash
curl -X POST http://localhost:5000/api/users/register \
-H "Content-Type: application/json" \
-d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

## II. Deploying to AWS

### 1. Setting Up AWS Infrastructure:

- Launch an AWS EC2 instance:
- Use the Amazon Linux 2 or Ubuntu 22.04.
- Configure security groups:
    - Open ports 80, 443 (for HTTPS), and 22 (for SSH).
    - Ensure Docker-specific ports (e.g., 5000, 5001, 5002) are open for local debugging but not for production use.
- SSH into the instance:
```bash
ssh -i <your-key.pem> ec2-user@<public-ip>
```

### 2. Install Docker and Docker Compose on EC2:

``` bash
sudo apt update
sudo apt install -y docker.io docker-compose
sudo systemctl enable docker --now
```

### 3. Transfer Files to EC2:

- Upload project files to the EC2 instance:
```bash
scp -i <your-key.pem> -r <local-project-path> ec2-user@<public-ip>:~/project
```

### 4. Run the Application:

- Navigate to the project directory and deploy:
```bash
cd ~/project
docker-compose up --build -d
```

### 5. Set Up Reverse Proxy with Caddy:

- Install Caddy:
```bash
sudo apt install -y caddy
```
- Configure /etc/caddy/Caddyfile:
```bash
:80 {
    handle /api/users/* {
        reverse_proxy localhost:5000
    }
    handle /api/blogs/* {
        reverse_proxy localhost:5001
    }
    handle /api/comments/* {
        reverse_proxy localhost:5002
    }
}
```
- Reload Caddy:
``` bash
sudo systemctl reload caddy
```

## III. Live Deployment
- Public URL: http://ec2-34-230-79-142.compute-1.amazonaws.com 
- Endpoints:
    - User Service: http://ec2-34-230-79-142.compute-1.amazonaws.com/api/users
    - Blog Service: http://ec2-34-230-79-142.compute-1.amazonaws.com/api/blogs
    - Comment Service: http://ec2-34-230-79-142.compute-1.amazonaws.com/api/comments

## IV. API Documentation
- Google Docs: https://docs.google.com/document/d/1Hx3LQN14CY4v0iZTHijTuEk2E6B8XHZ6roKQwaBw-EQ/
