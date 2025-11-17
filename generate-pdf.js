const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Get the absolute path to the HTML file
  const htmlPath = path.join(__dirname, 'index.html');
  const htmlUrl = `file://${htmlPath}`;
  
  await page.goto(htmlUrl, {
    waitUntil: 'networkidle0'
  });
  
  // Generate PDF
  const pdfPath = path.join(__dirname, 'Victor_Correia_CV.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '0.5cm',
      right: '0.5cm',
      bottom: '0.5cm',
      left: '0.5cm'
    }
  });
  
  console.log(`PDF generated successfully at: ${pdfPath}`);
  
  await browser.close();
})();

