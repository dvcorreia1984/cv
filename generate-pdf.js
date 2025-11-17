const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // Set viewport to ensure proper rendering
  await page.setViewport({
    width: 1200,
    height: 1600,
    deviceScaleFactor: 2
  });
  
  // Get the absolute path to the HTML file
  const htmlPath = path.join(__dirname, 'index.html');
  const htmlUrl = `file:///${htmlPath.replace(/\\/g, '/')}`;
  
  console.log('Loading HTML from:', htmlUrl);
  
  // Navigate to the HTML file and wait for all resources
  await page.goto(htmlUrl, {
    waitUntil: 'networkidle0',
    timeout: 30000
  });
  
  // Wait for fonts to load
  await page.evaluateHandle(() => document.fonts.ready);
  
  // Wait a bit more for any animations or transitions
  await page.waitForTimeout(1000);
  
  // Generate PDF with optimized settings for styling
  const pdfPath = path.join(__dirname, 'cv.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true, // Critical for background colors
    preferCSSPageSize: false,
    margin: {
      top: '0',
      right: '0',
      bottom: '0',
      left: '0'
    },
    displayHeaderFooter: false,
    scale: 0.95 // Slight scale to ensure content fits
  });
  
  console.log(`PDF generated successfully at: ${pdfPath}`);
  
  await browser.close();
})();

