#!/usr/bin/env python3
"""
Test script to verify Google Sheets API connection and configuration
Run this before setting up automation to ensure everything works
"""

import os
import sys
from config import SPREADSHEET_ID, CREDENTIALS_FILE, COLUMNS

def test_config():
    """Test configuration values"""
    print("🔧 Testing configuration...")
    print(f"📊 Spreadsheet ID: {SPREADSHEET_ID}")
    print(f"🔑 Credentials file: {CREDENTIALS_FILE}")
    print(f"📝 Title column: {COLUMNS['title']}")
    print(f"📝 Description column: {COLUMNS['description']}")
    print(f"🖼️  Image columns: {COLUMNS['images']}")
    
    # Check if credentials file exists
    if os.path.exists(CREDENTIALS_FILE):
        print("✅ Credentials file found")
    else:
        print("❌ Credentials file not found")
        print(f"   Please place your Google service account credentials in: {CREDENTIALS_FILE}")
        return False
    
    return True

def test_api_connection():
    """Test Google Sheets API connection"""
    print("\n🔌 Testing API connection...")
    
    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
        
        # Authenticate
        credentials = service_account.Credentials.from_service_account_file(
            CREDENTIALS_FILE,
            scopes=['https://www.googleapis.com/auth/spreadsheets.readonly']
        )
        
        service = build('sheets', 'v4', credentials=credentials)
        print("✅ Authentication successful")
        
        # Test reading spreadsheet
        result = service.spreadsheets().values().get(
            spreadsheetId=SPREADSHEET_ID,
            range='A:Z'
        ).execute()
        
        values = result.get('values', [])
        if values:
            print(f"✅ Successfully read spreadsheet")
            print(f"   Found {len(values)} rows")
            print(f"   Headers: {values[0]}")
            
            # Check if required columns exist
            headers = values[0]
            missing_columns = []
            
            if COLUMNS['title'] not in headers:
                missing_columns.append(COLUMNS['title'])
            if COLUMNS['description'] not in headers:
                missing_columns.append(COLUMNS['description'])
            
            for img_col in COLUMNS['images']:
                if img_col not in headers:
                    missing_columns.append(img_col)
            
            if missing_columns:
                print(f"❌ Missing columns: {missing_columns}")
                return False
            else:
                print("✅ All required columns found")
                return True
        else:
            print("❌ No data found in spreadsheet")
            return False
            
    except Exception as e:
        print(f"❌ API connection failed: {e}")
        return False

def main():
    """Main test function"""
    print("🧪 Portfolio Automation Test Suite")
    print("=" * 40)
    
    # Test configuration
    if not test_config():
        print("\n❌ Configuration test failed")
        return
    
    # Test API connection
    if test_api_connection():
        print("\n🎉 All tests passed! You're ready to set up automation.")
        print("\n📋 Next steps:")
        print("1. Run: chmod +x setup_automation.sh")
        print("2. Run: ./setup_automation.sh")
        print("3. Test manually: python update_portfolio.py")
    else:
        print("\n❌ API connection test failed")
        print("   Please check your Google Cloud setup and credentials")

if __name__ == "__main__":
    main()
