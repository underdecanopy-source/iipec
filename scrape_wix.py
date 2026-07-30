import asyncio
from playwright.async_api import async_playwright
import json
import re
from urllib.parse import urljoin

async def scrape_website():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        
        try:
            # Navigate to the site
            await page.goto('https://pottershousecommand.wixsite.com/iipec-chaplaincy', wait_until='networkidle', timeout=30000)
            
            # Extract all images
            images = await page.locator('img').all()
            image_data = []
            for img in images:
                src = await img.get_attribute('src')
                alt = await img.get_attribute('alt')
                if src and ('wix' in src.lower() or 'static' in src.lower()):
                    image_data.append({'src': src[:200], 'alt': alt})
            
            # Get page text content to find sections
            content = await page.content()
            
            # Extract text content to identify main sections
            text_content = await page.evaluate('''() => {
                return document.body.innerText;
            }''')
            
            print("=== IMAGES FOUND ===")
            for idx, img in enumerate(image_data[:20]):
                print(f"{idx+1}. Alt: {img['alt']}")
                print(f"   Src: {img['src'][:100]}...")
            
            print("\n=== PAGE TEXT (FIRST 3000 CHARS) ===")
            print(text_content[:3000])
            
        except Exception as e:
            print(f"Error: {e}")
        finally:
            await browser.close()

asyncio.run(scrape_website())
