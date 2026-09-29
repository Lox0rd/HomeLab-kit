#!/bin/bash
set -e

echo "========================================"
echo "HOMELAB Platform Uninstaller"
echo "========================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if running as root
if [[ $EUID -ne 0 ]]; then
    echo -e "${RED}Error: This script must be run as root (use sudo)${NC}"
    exit 1
fi

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo ""
echo "This will remove HOMELAB Platform and all its services."
echo -e "${YELLOW}WARNING: This action cannot be undone!${NC}"
echo ""
read -p "Are you sure you want to uninstall HOMELAB? (yes/no): " -r
echo ""
if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "Uninstall cancelled."
    exit 0
fi

# Stop services
echo "Stopping services..."
systemctl stop homelab-agent 2>/dev/null || true
systemctl stop nginx 2>/dev/null || true
echo -e "${GREEN}✓ Services stopped${NC}"

# Disable services
echo ""
echo "Disabling services..."
systemctl disable homelab-agent 2>/dev/null || true
systemctl disable nginx 2>/dev/null || true
echo -e "${GREEN}✓ Services disabled${NC}"

# Remove systemd service files
echo ""
echo "Removing systemd services..."
rm -f /etc/systemd/system/homelab-agent.service
systemctl daemon-reload
echo -e "${GREEN}✓ Systemd services removed${NC}"

# Remove Nginx configuration
echo ""
echo "Removing Nginx configuration..."
rm -f /etc/nginx/sites-available/homelab
rm -f /etc/nginx/sites-enabled/homelab
echo -e "${GREEN}✓ Nginx configuration removed${NC}"

# Remove SSL certificates
echo ""
echo "Removing SSL certificates..."
rm -f /etc/ssl/private/homelab.key
rm -f /etc/ssl/certs/homelab.crt
echo -e "${GREEN}✓ SSL certificates removed${NC}"

# Remove homelab.local from /etc/hosts
echo ""
echo "Removing homelab.local from /etc/hosts..."
sed -i '/homelab.local/d' /etc/hosts
echo -e "${GREEN}✓ Removed homelab.local from /etc/hosts${NC}"

# Remove homelab user
echo ""
echo "Removing homelab user..."
userdel -r homelab 2>/dev/null || true
echo -e "${GREEN}✓ Homelab user removed${NC}"

# Remove credentials file
echo ""
echo "Removing credentials..."
rm -f /root/.homelab/admin_credentials.txt
rmdir /root/.homelab 2>/dev/null || true
echo -e "${GREEN}✓ Credentials removed${NC}"

# Print summary
echo ""
echo "========================================"
echo -e "${GREEN}HOMELAB Uninstallation Complete!${NC}"
echo "========================================"
echo ""
echo "Remaining files (for manual removal if needed):"
echo "  - Project directory: $PROJECT_ROOT"
echo "  - Virtual environments and dependencies are still in place"
echo ""
echo "To remove all project files:"
echo "  rm -rf $PROJECT_ROOT"
echo ""
