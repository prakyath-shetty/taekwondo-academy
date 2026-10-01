const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const AUTH_DATA = JSON.stringify({
  user: {
    _id: 'demo-student',
    firstName: 'Prakyath',
    lastName: 'Student',
    email: 'prakyath@tkd.com',
    role: 'student',
    belt: 'Blue'
  },
  token: 'demo-token'
});

const SCREENSHOTS_DIR = 'C:/Users/ASUS-TUF/taekwondo/taekwondo/screenshots';
const BASE_URL = 'http://localhost:5174';

const BREAKPOINTS = [
  { name: 'desktop-1440', width: 1440, height: 900 },
  { name: 'laptop-1280', width: 1280, height: 800 },
  { name: 'tablet-1024', width: 1024, height: 768 },
  { name: 'mobile-390', width: 390, height: 844 },
];

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext();

  const page = await context.newPage();

  // Mock all API calls to return success so auth never gets invalidated
  await page.route('**/api/auth/**', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: { user: { _id: 'demo-student', firstName: 'Prakyath', lastName: 'Student', email: 'prakyath@tkd.com', role: 'student', belt: 'Blue' }, token: 'demo-token' }, message: 'OK' })
    });
  });

  // Pre-populate localStorage with mock auth
  await page.addInitScript((data) => {
    window.localStorage.setItem('tkd_user', data);
  }, AUTH_DATA);

  for (const bp of BREAKPOINTS) {
    await page.setViewportSize({ width: bp.width, height: bp.height });
    await page.goto(`${BASE_URL}/app/dashboard`, { waitUntil: 'networkidle', timeout: 15000 });
    // Wait for content to render
    await page.waitForSelector('.tkd-hero', { timeout: 10000 });
    await page.waitForTimeout(800);

    const screenshotPath = path.join(SCREENSHOTS_DIR, `${bp.name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`Screenshot saved: ${screenshotPath} (${bp.width}x${bp.height})`);
  }

  await browser.close();
  console.log('All screenshots captured successfully.');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
