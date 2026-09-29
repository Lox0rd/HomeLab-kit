#!/bin/bash
set -e

echo "========================================"
echo "HOMELAB Platform Installer"
echo "========================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if running on Ubuntu
if ! grep -q "Ubuntu" /etc/os-release; then
    echo -e "${RED}Error: This installer is designed for Ubuntu 24.04 LTS${NC}"
    exit 1
fi

# Check Ubuntu version
if ! grep -q "24.04" /etc/os-release; then
    echo -e "${YELLOW}Warning: This is optimized for Ubuntu 24.04 LTS${NC}"
fi

# Check if running as root
if [[ $EUID -ne 0 ]]; then
    echo -e "${RED}Error: This script must be run as root (use sudo)${NC}"
    exit 1
fi

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo -e "${GREEN}✓ Ubuntu detected${NC}"

# Update system
echo ""
echo "Updating system packages..."
apt-get update
apt-get upgrade -y

# Add deadsnakes PPA for Python 3.12
echo ""
echo "Adding Python 3.12 repository..."
apt-get install -y software-properties-common
add-apt-repository -y ppa:deadsnakes/ppa
apt-get update

# Install dependencies
echo ""
echo "Installing dependencies..."
apt-get install -y \
    python3.12 \
    python3.12-venv \
    python3-pip \
    nodejs \
    npm \
    docker.io \
    nginx \
    curl \
    git \
    openssl \
    ufw

echo -e "${GREEN}✓ Dependencies installed${NC}"

# Create homelab user
echo ""
echo "Creating homelab user..."
if ! id -u homelab > /dev/null 2>&1; then
    useradd -r -s /usr/sbin/nologin -d /var/lib/homelab homelab
    mkdir -p /var/lib/homelab
    chown homelab:homelab /var/lib/homelab
    echo -e "${GREEN}✓ homelab user created${NC}"
else
    echo -e "${YELLOW}✓ homelab user already exists${NC}"
fi

# Ensure homelab user can read agent directory
chown -R homelab:homelab "$PROJECT_ROOT/agent"
chmod -R u+rx "$PROJECT_ROOT/agent"

# Setup admin credentials
echo ""
echo "Setting up admin credentials..."
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin"
mkdir -p /root/.homelab
echo "Username: $ADMIN_USERNAME" > /root/.homelab/admin_credentials.txt
echo "Password: $ADMIN_PASSWORD" >> /root/.homelab/admin_credentials.txt
chmod 600 /root/.homelab/admin_credentials.txt
echo -e "${GREEN}✓ Admin credentials: username='admin', password='admin'${NC}"

# Setup Agent
echo ""
echo "Setting up Homelab Agent..."
cd "$PROJECT_ROOT/agent"

# Create virtual environment
python3.12 -m venv venv
source venv/bin/activate
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
deactivate

# Create systemd service file
cat > /etc/systemd/system/homelab-agent.service << EOF
[Unit]
Description=HOMELAB Agent
After=network.target
Wants=network-online.target

[Service]
Type=simple
User=homelab
WorkingDirectory=$PROJECT_ROOT/agent
Environment="PATH=$PROJECT_ROOT/agent/venv/bin:\$PATH"
Environment="PYTHONPATH=$PROJECT_ROOT/agent"
ExecStart=$PROJECT_ROOT/agent/venv/bin/python -m homelab_agent
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable homelab-agent
echo -e "${GREEN}✓ Homelab Agent systemd service created${NC}"

# Setup Web
echo ""
echo "Building Homelab Web..."
cd "$PROJECT_ROOT/web"
npm install
npm run build
echo -e "${GREEN}✓ Homelab Web built${NC}"

# Setup Nginx
echo ""
echo "Configuring Nginx..."

# Generate self-signed certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/homelab.key \
    -out /etc/ssl/certs/homelab.crt \
    -subj "/CN=homelab.local"

# Create Nginx config
cat > /etc/nginx/sites-available/homelab << 'NGINX_CONFIG'
upstream homelab_agent {
    server 127.0.0.1:8000;
}

server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name homelab.local _;

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl default_server;
    listen [::]:443 ssl default_server;
    server_name homelab.local _;

    ssl_certificate /etc/ssl/certs/homelab.crt;
    ssl_certificate_key /etc/ssl/private/homelab.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    root REPLACE_WITH_WEB_ROOT;
    index index.html;

    location /api/v1/ {
        proxy_pass http://homelab_agent/api/v1/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
NGINX_CONFIG

# Replace placeholder
sed -i "s|REPLACE_WITH_WEB_ROOT|$PROJECT_ROOT/web/dist|g" /etc/nginx/sites-available/homelab

# Enable site
ln -sf /etc/nginx/sites-available/homelab /etc/nginx/sites-enabled/homelab
rm -f /etc/nginx/sites-enabled/default

# Test Nginx config
if ! nginx -t; then
    echo -e "${RED}✗ Nginx configuration test failed${NC}"
    exit 1
fi

systemctl enable nginx
echo -e "${GREEN}✓ Nginx configured${NC}"

# Setup /etc/hosts
if ! grep -q "homelab.local" /etc/hosts; then
    echo "127.0.0.1 homelab.local" >> /etc/hosts
    echo -e "${GREEN}✓ Added homelab.local to /etc/hosts${NC}"
fi

# Setup firewall
echo ""
echo "Configuring firewall..."
ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
echo -e "${GREEN}✓ Firewall configured${NC}"

# Create initial admin user
echo ""
echo "Creating initial admin user..."
cd "$PROJECT_ROOT/agent"
source venv/bin/activate

python3 << PYTHON_SCRIPT
import sys
sys.path.insert(0, "$PROJECT_ROOT/agent")

from homelab_agent.database import SessionLocal, User
from homelab_agent.api.auth import hash_password

db = SessionLocal()

# Check if admin already exists
admin = db.query(User).filter(User.username == "admin").first()
if not admin:
    admin_user = User(
        username="admin",
        hashed_password=hash_password("admin"),
        is_admin=True
    )
    db.add(admin_user)
    db.commit()
    print("✓ Admin user created")
else:
    print("✓ Admin user already exists")

db.close()
PYTHON_SCRIPT

deactivate

# Start services
echo ""
echo "Starting services..."
systemctl start homelab-agent
systemctl start nginx

sleep 3

# Check if services are running
if systemctl is-active --quiet homelab-agent; then
    echo -e "${GREEN}✓ Homelab Agent is running${NC}"
else
    echo -e "${RED}✗ Homelab Agent failed to start${NC}"
    systemctl status homelab-agent
    exit 1
fi

if systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✓ Nginx is running${NC}"
else
    echo -e "${RED}✗ Nginx failed to start${NC}"
    systemctl status nginx
    exit 1
fi

# Print summary
echo ""
echo "========================================"
echo -e "${GREEN}HOMELAB Installation Complete!${NC}"
echo "========================================"
echo ""
echo "Access the platform at:"
echo -e "${GREEN}  https://homelab.local${NC}"
echo ""
echo "Login credentials:"
echo "  Username: admin"
echo "  Password: admin"
echo ""
echo "Credentials saved to: /root/.homelab/admin_credentials.txt"
echo ""
echo "Services:"
echo "  - Homelab Agent: systemctl status homelab-agent"
echo "  - Nginx: systemctl status nginx"
echo ""
echo "Next steps:"
echo "  1. Open https://homelab.local in your browser"
echo "  2. Login with admin credentials"
echo "  3. Start with LAB 01"
echo ""
