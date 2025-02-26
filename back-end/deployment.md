# Deployment Instructions for JSON Storage Service

This guide provides step-by-step instructions for deploying the JSON storage service to various hosting platforms.

---

## Table of Contents

1. [Prepare Your Application for Deployment](#prepare-your-application-for-deployment)
2. [Choose a Hosting Platform](#choose-a-hosting-platform)
3. [Deploy to a VPS (DigitalOcean)](#deploy-to-a-vps-digitalocean)
4. [Configure DNS (Optional)](#configure-dns-optional)
5. [Secure Your Application](#secure-your-application)
6. [Monitor and Maintain](#monitor-and-maintain)

---

## Prepare Your Application for Deployment

1. **Environment Variables**:

   - Use environment variables for sensitive data (e.g., database credentials, API keys).
   - Install the `dotenv` package:
     ```bash
     npm install dotenv
     ```
   - Create a `.env` file:
     ```
     PORT=3000
     DATABASE_URL=./database.sqlite
     ```
   - Load environment variables in `server.js`:
     ```javascript
     require("dotenv").config();
     const port = process.env.PORT || 3000;
     ```

2. **Update Database Path**:

   - Make the SQLite database path configurable:
     ```javascript
     const db = new sqlite3.Database(
       process.env.DATABASE_URL || "./database.sqlite"
     );
     ```

3. **Add a Start Script**:

   - Update `package.json`:
     ```json
     "scripts": {
       "start": "node server.js"
     }
     ```

4. **Test Locally**:
   - Run your application:
     ```bash
     npm start
     ```

---

## Deploy to a VPS (Vultr)

Choose an Ubuntu image and a plan

SSH into the VPS:

```bash
ssh root@<your-vps-ip>
Install Node.js:
```

```bash
sudo apt update
sudo apt install nodejs npm
Clone Your Repository:
```

```bash
git clone <your-repo-url>
cd <your-repo-directory>
npm install
Install PM2:
```

```bash
sudo npm install -g pm2
pm2 start server.js --name "json-storage-service"
pm2 startup
pm2 save
Set Up a Reverse Proxy:

Install Nginx:
```

```bash
sudo apt install nginx
Configure Nginx:
```

```bash
sudo nano /etc/nginx/sites-available/default
Add the following configuration:
```

```nginx
server {
    listen 80;
    server_name <your-domain-or-ip>;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Restart Nginx:

```bash
sudo systemctl restart nginx
```

### Configure DNS (Optional)

Buy a Domain:

Purchase a domain from a registrar like Namecheap or Google Domains.

Update DNS Records:

Point the domain to your VPS's IP address.

Secure Your Application
Enable HTTPS:

Use Let's Encrypt to get a free SSL certificate.

On a VPS with Nginx:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d <your-domain>
```

### Firewall:

Enable a firewall to restrict access to necessary ports (e.g., 80, 443, 22):

```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
Monitor and Maintain
Logs:

Use pm2 logs to monitor your application:
```

```bash
pm2 logs
```

### Backups:

Regularly back up your SQLite database and application code.

### Updates:

Keep your server and dependencies up to date.
