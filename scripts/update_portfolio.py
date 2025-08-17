#!/usr/bin/env python3
"""
Portfolio Update Automation Script
Fetches new project submissions from Google Sheets and updates portfolio.json
"""

import json
import os
import sys
from datetime import datetime, timedelta
from typing import List, Dict, Any
import re

# Add current directory to path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from google.oauth2 import service_account
from googleapiclient.discovery import build
from config import SPREADSHEET_ID, CREDENTIALS_FILE, COLUMNS, OUTPUT_FILE, LAST_UPDATE_FILE, THUMBNAIL_WIDTH

class PortfolioUpdater:
    def __init__(self):
        self.service = None
        self.last_update = self._get_last_update()
        
    def _get_last_update(self) -> datetime:
        """Get the timestamp of last update"""
        try:
            with open(LAST_UPDATE_FILE, 'r') as f:
                timestamp = f.read().strip()
                return datetime.fromisoformat(timestamp)
        except FileNotFoundError:
            # If no last update file, start from 7 days ago
            return datetime.now() - timedelta(days=7)
    
    def _authenticate(self):
        """Authenticate with Google Sheets API"""
        try:
            credentials = service_account.Credentials.from_service_account_file(
                CREDENTIALS_FILE,
                scopes=['https://www.googleapis.com/auth/spreadsheets.readonly']
            )
            self.service = build('sheets', 'v4', credentials=credentials)
            print("✅ Google Sheets API authentication successful")
        except Exception as e:
            print(f"❌ Authentication failed: {e}")
            sys.exit(1)
    
    def _fetch_new_submissions(self) -> List[Dict[str, Any]]:
        """Fetch new submissions from Google Sheets"""
        try:
            # Get all data from the sheet
            result = self.service.spreadsheets().values().get(
                spreadsheetId=SPREADSHEET_ID,
                range='A:Z'  # Read all columns
            ).execute()
            
            values = result.get('values', [])
            if not values:
                print("No data found in spreadsheet")
                return []
            
            # First row contains headers
            headers = values[0]
            data_rows = values[1:]
            
            # Find column indices
            title_idx = headers.index(COLUMNS['title']) if COLUMNS['title'] in headers else None
            desc_idx = headers.index(COLUMNS['description']) if COLUMNS['description'] in headers else None
            image_indices = [headers.index(col) if col in headers else None for col in COLUMNS['images']]
            
            if title_idx is None or desc_idx is None:
                print("❌ Required columns not found in spreadsheet")
                return []
            
            new_submissions = []
            for row in data_rows:
                if len(row) > max(title_idx, desc_idx):
                    # Check if this is a new submission (simple check for now)
                    title = row[title_idx].strip()
                    description = row[desc_idx].strip()
                    
                    if title and description:  # Basic validation
                        # Get image URLs (filter out empty ones)
                        images = []
                        for idx in image_indices:
                            if idx is not None and idx < len(row) and row[idx].strip():
                                img_url = row[idx].strip()
                                # Convert Google Drive link to export format for better loading
                                img_url = self._convert_to_thumbnail(img_url)
                                images.append(img_url)
                        
                        if images:  # Only add if we have at least one image
                            submission = {
                                'title': title,
                                'description': description,
                                'images': images,
                                'thumbnail': self._convert_to_thumbnail_small(images[0])  # Convert first image to small thumbnail
                            }
                            new_submissions.append(submission)
            
            print(f"📊 Found {len(new_submissions)} new submissions")
            return new_submissions
            
        except Exception as e:
            print(f"❌ Error fetching submissions: {e}")
            return []
    
    def _convert_to_thumbnail(self, drive_url: str) -> str:
        """Convert Google Drive URL to appropriate format for optimal loading"""
        # Extract file ID from various Google Drive URL formats
        patterns = [
            r'https://drive\.google\.com/open\?id=([a-zA-Z0-9_-]+)',
            r'https://drive\.google\.com/file/d/([a-zA-Z0-9_-]+)',
            r'https://drive\.google\.com/uc\?id=([a-zA-Z0-9_-]+)',
            r'https://drive\.google\.com/uc\?export=view&id=([a-zA-Z0-9_-]+)',
            r'https://drive\.google\.com/thumbnail\?id=([a-zA-Z0-9_-]+)'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, drive_url)
            if match:
                file_id = match.group(1)
                # Use export format for main images (better loading performance)
                return f"https://drive.google.com/uc?export=view&id={file_id}"
        
        # If no pattern matches, return original URL
        return drive_url
    
    def _convert_to_thumbnail_small(self, drive_url: str) -> str:
        """Convert Google Drive URL to small thumbnail format for portfolio grid"""
        # Extract file ID from various Google Drive URL formats
        patterns = [
            r'https://drive\.google\.com/open\?id=([a-zA-Z0-9_-]+)',
            r'https://drive\.google\.com/file/d/([a-zA-Z0-9_-]+)',
            r'https://drive\.google\.com/uc\?id=([a-zA-Z0-9_-]+)',
            r'https://drive\.google\.com/uc\?export=view&id=([a-zA-Z0-9_-]+)',
            r'https://drive\.google\.com/thumbnail\?id=([a-zA-Z0-9_-]+)'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, drive_url)
            if match:
                file_id = match.group(1)
                # Use thumbnail format for grid thumbnails (faster loading)
                return f"https://drive.google.com/thumbnail?id={file_id}&sz=w400"
        
        # If no pattern matches, return original URL
        return drive_url
    
    def _update_portfolio(self, new_submissions: List[Dict[str, Any]]):
        """Update portfolio.json with new submissions"""
        try:
            # Read existing portfolio
            with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
                portfolio = json.load(f)
            
            # Generate new project entries
            for i, submission in enumerate(new_submissions):
                # Create unique ID from title
                project_id = self._generate_id(submission['title'])
                
                # Create new project entry
                new_project = {
                    "id": project_id,
                    "title": submission['title'],
                    "description": submission['description'],
                    "category": "New Project",  # Default category
                    "images": submission['images'],
                    "thumbnail": submission['thumbnail'],
                    "date": datetime.now().strftime("%Y-%m-%d")
                }
                
                # Add to beginning of projects list (most recent first)
                portfolio['projects'].insert(0, new_project)
                print(f"✅ Added project: {submission['title']}")
            
            # Write updated portfolio
            with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
                json.dump(portfolio, f, indent=2, ensure_ascii=False)
            
            print(f"✅ Portfolio updated with {len(new_submissions)} new projects")
            
        except Exception as e:
            print(f"❌ Error updating portfolio: {e}")
    
    def _generate_id(self, title: str) -> str:
        """Generate a unique ID from project title"""
        # Convert to lowercase, replace spaces with hyphens, remove special chars
        id_str = re.sub(r'[^a-zA-Z0-9\s-]', '', title.lower())
        id_str = re.sub(r'\s+', '-', id_str.strip())
        return id_str
    
    def _save_last_update(self):
        """Save current timestamp as last update"""
        with open(LAST_UPDATE_FILE, 'w') as f:
            f.write(datetime.now().isoformat())
    
    def run(self):
        """Main execution method"""
        print("🚀 Starting portfolio update...")
        print(f"📅 Last update: {self.last_update}")
        
        # Authenticate
        self._authenticate()
        
        # Fetch new submissions
        new_submissions = self._fetch_new_submissions()
        
        if new_submissions:
            # Update portfolio
            self._update_portfolio(new_submissions)
            
            # Save update timestamp
            self._save_last_update()
            
            print("🎉 Portfolio update completed successfully!")
        else:
            print("ℹ️ No new submissions found")
        
        print(f"📅 Next update scheduled for: Monday 00:00:00")

def main():
    """Main function"""
    updater = PortfolioUpdater()
    updater.run()

if __name__ == "__main__":
    main()
