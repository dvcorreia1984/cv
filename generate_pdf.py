import asyncio
from playwright.async_api import async_playwright
import os

async def generate_pdf():
    async with async_playwright() as p:
        # Launch browser
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        # Set viewport to ensure proper rendering
        await page.set_viewport_size({'width': 1200, 'height': 1600})
        
        # Get the absolute path to the HTML file
        html_path = os.path.abspath('index.html')
        html_url = f'file:///{html_path}'.replace('\\', '/')
        
        print(f'Loading HTML from: {html_url}')
        
        # Navigate to the HTML file and wait for all resources
        await page.goto(html_url, wait_until='networkidle', timeout=30000)
        
        # Wait for fonts to load
        await page.evaluate('document.fonts.ready')
        
        # Wait a bit more for any animations or transitions
        await page.wait_for_timeout(1000)
        
        # Generate PDF with optimized settings for styling
        pdf_path = os.path.abspath('cv.pdf')
        await page.pdf(
            path=pdf_path,
            format='A4',
            print_background=True,  # Critical for background colors
            prefer_css_page_size=False,
            margin={
                'top': '0',
                'right': '0',
                'bottom': '0',
                'left': '0'
            },
            display_header_footer=False,
            scale=0.95  # Slight scale to ensure content fits
        )
        
        print(f'PDF generated successfully at: {pdf_path}')
        
        await browser.close()

if __name__ == '__main__':
    asyncio.run(generate_pdf())

