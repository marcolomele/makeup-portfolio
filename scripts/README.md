# Portfolio Update Automation

This script automatically updates your portfolio website with new projects from Google Forms.

## Setup Steps

### 1. Google Cloud Setup
- Create a Google Cloud Project
- Enable Google Sheets API
- Create a Service Account
- Download credentials as `credentials.json`

### 2. Google Form Configuration
- Your form already has the correct column names:
  - `project_title`
  - `project_description`
  - `img_1` through `img_8`

### 3. Installation
```bash
cd scripts
pip install -r requirements.txt
```

### 4. Configuration
- ✅ Spreadsheet ID already configured: `1bAPDbB5L7LgomUB3RPLuVMBPGXb_ZLwY97_0qCufgGc`
- Place `credentials.json` in this directory

### 5. Test Setup
```bash
python test_setup.py
```

### 6. Test Run
```bash
python update_portfolio.py
```

### 7. Setup Automation (Monday 00:00)
```bash
chmod +x setup_automation.sh
./setup_automation.sh
```

## File Structure
```
scripts/
├── update_portfolio.py    # Main automation script
├── config.py             # Configuration settings
├── requirements.txt      # Python dependencies
├── credentials.json      # Google API credentials (you provide)
└── last_update.txt      # Tracks last update time
```
