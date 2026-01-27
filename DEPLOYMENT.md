# Five9 Dashboard Deployment Guide

## 🚀 Quick Start (Local Development)

The development server is already configured to run on port 8080:

```bash
cd five9-dashboard
npm install
npm run dev
```

Visit: http://localhost:8080

## 📦 Production Deployment

### Step 1: Build the Application

```bash
npm run build
```

This creates an optimized production build in `.next/` directory.

### Step 2: Start Production Server

```bash
npm start
```

The server will start on port 8080 (as configured in package.json).

## 🖥️ Ubuntu Server Deployment (147.182.254.60)

### Prerequisites

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js v18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should be v18.x
npm --version
```

### Deploy Application

```bash
# 1. Transfer files to server
scp -r five9-dashboard user@147.182.254.60:/var/www/

# 2. SSH into server
ssh user@147.182.254.60

# 3. Navigate to project
cd /var/www/five9-dashboard

# 4. Install dependencies
npm install --production

# 5. Build application
npm run build

# 6. Test production server
npm start
```

### Configure PM2 (Process Manager)

PM2 keeps the application running and restarts it on crashes:

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start application with PM2
pm2 start npm --name "five9-dashboard" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup

# Check status
pm2 status
pm2 logs five9-dashboard
```

### Configure Nginx Reverse Proxy

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/five9-dashboard
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name 147.182.254.60;  # Replace with your domain if you have one

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/five9-dashboard /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Add Basic Authentication (Optional but Recommended)

```bash
# Install apache2-utils
sudo apt install apache2-utils

# Create password file
sudo htpasswd -c /etc/nginx/.htpasswd admin

# Update Nginx configuration
sudo nano /etc/nginx/sites-available/five9-dashboard
```

Add these lines inside the `location /` block:

```nginx
auth_basic "Five9 Dashboard";
auth_basic_user_file /etc/nginx/.htpasswd;
```

Reload Nginx:

```bash
sudo systemctl reload nginx
```

### Configure Firewall

```bash
# Allow Nginx HTTP
sudo ufw allow 'Nginx HTTP'

# Or allow specific port
sudo ufw allow 80/tcp

# Check status
sudo ufw status
```

## 🔐 Security Checklist

- [ ] Enable Nginx basic authentication
- [ ] Configure UFW firewall
- [ ] Set up SSL/TLS with Let's Encrypt (if using domain)
- [ ] Regular system updates
- [ ] PM2 log rotation configured
- [ ] Environment variables secured (if added)

## 📊 Monitoring Commands

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs five9-dashboard

# Monitor resources
pm2 monit

# Restart application
pm2 restart five9-dashboard

# Stop application
pm2 stop five9-dashboard
```

## 🔄 Updating the Application

```bash
# Stop current version
pm2 stop five9-dashboard

# Pull latest changes (if using git)
git pull

# Or upload new files
# scp -r five9-dashboard user@147.182.254.60:/var/www/

# Install dependencies
npm install

# Rebuild
npm run build

# Restart with PM2
pm2 restart five9-dashboard
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using port 8080
sudo lsof -i :8080

# Kill process
sudo kill -9 <PID>
```

### Application Won't Start

```bash
# Check PM2 logs
pm2 logs five9-dashboard --lines 100

# Check system logs
journalctl -xe

# Verify Node.js version
node --version  # Should be v18+
```

### Nginx Issues

```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

## 📈 Performance Optimization

### Enable Gzip in Nginx

Add to Nginx server block:

```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
```

### Configure PM2 Cluster Mode

For better performance with multiple CPU cores:

```bash
pm2 delete five9-dashboard
pm2 start npm --name "five9-dashboard" -i max -- start
```

## 🔗 Access URLs

- **Local Development**: http://localhost:8080
- **Production Server**: http://147.182.254.60
- **With Domain** (if configured): https://yourdomain.com

## 📝 Environment Variables (Future)

If you need to add environment variables later:

```bash
# Create .env.local file
PORT=8080
NODE_ENV=production

# PM2 with env file
pm2 start npm --name "five9-dashboard" --env production -- start
```

## ✅ Post-Deployment Verification

1. Visit the dashboard URL
2. Verify all metrics load correctly
3. Test refresh functionality
4. Check console for errors (F12)
5. Verify mobile responsiveness
6. Test API endpoints:
   - http://your-server/api/metrics
   - http://your-server/api/call-volume

## 🎯 Next Steps

1. Replace mock data with real Five9 API integration
2. Set up monitoring alerts (e.g., Uptime Robot)
3. Configure SSL certificate with Let's Encrypt
4. Set up automated backups
5. Configure log rotation
6. Add Grafana/Prometheus for system monitoring

## 📞 Support

For deployment issues, refer to:
- Next.js Deployment Docs: https://nextjs.org/docs/deployment
- PM2 Documentation: https://pm2.keymetrics.io/
- Nginx Documentation: https://nginx.org/en/docs/
