#!/bin/bash
# Setup script for weekly portfolio automation
# Runs every Monday at 00:00

echo "🚀 Setting up portfolio automation..."

# Get the current directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORTFOLIO_DIR="$(dirname "$SCRIPT_DIR")"

# Create cron job for Monday 00:00
CRON_JOB="0 0 * * 1 cd $PORTFOLIO_DIR/scripts && python update_portfolio.py >> automation.log 2>&1"

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "update_portfolio.py"; then
    echo "⚠️  Cron job already exists. Removing old one..."
    crontab -l 2>/dev/null | grep -v "update_portfolio.py" | crontab -
fi

# Add new cron job
(crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -

echo "✅ Cron job added successfully!"
echo "📅 Portfolio will update every Monday at 00:00"
echo "📁 Logs will be saved to: $PORTFOLIO_DIR/scripts/automation.log"

# Show current cron jobs
echo ""
echo "📋 Current cron jobs:"
crontab -l

echo ""
echo "🔧 To manually test the script, run:"
echo "   cd $PORTFOLIO_DIR/scripts && python update_portfolio.py"
