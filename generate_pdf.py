import asyncio
from playwright.async_api import async_playwright
import os

async def generate_pdf():
    async with async_playwright() as p:
        # Launch browser
        browser = await p.chromium.launch()
        page = await browser.new_page()
        
        # Get the absolute path to the HTML file
        html_path = os.path.abspath('index.html')
        html_url = f'file:///{html_path}'.replace('\\', '/')
        
        # Navigate to the HTML file
        await page.goto(html_url, wait_until='networkidle')
        
        # Generate PDF
        pdf_path = os.path.abspath('Victor_Correia_CV.pdf')
        await page.pdf(
            path=pdf_path,
            format='A4',
            print_background=True,
            margin={
                'top': '0.5cm',
                'right': '0.5cm',
                'bottom': '0.5cm',
                'left': '0.5cm'
            }
        )
        
        print(f'PDF generated successfully at: {pdf_path}')
        
        await browser.close()

if __name__ == '__main__':
    asyncio.run(generate_pdf())

