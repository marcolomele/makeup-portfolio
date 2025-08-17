"""
Configuration file for portfolio update automation
"""

# Google Sheets API Configuration
SPREADSHEET_ID = "1bAPDbB5L7LgomUB3RPLuVMBPGXb_ZLwY97_0qCufgGc"
CREDENTIALS_FILE = "credentials.json"  # Service account credentials file

# Form Response Columns (your actual Google Form structure)
COLUMNS = {
    "title": "project_title",
    "description": "project_description", 
    "images": ["img_1", "img_2", "img_3", "img_4", "img_5", "img_6", "img_7", "img_8"]
}

# Output Configuration
OUTPUT_FILE = "../src/data/portfolio-dev.json"
LAST_UPDATE_FILE = "last_update.txt"

# Image Processing
# THUMBNAIL_WIDTH removed - now handled by separate methods in update_portfolio.py
