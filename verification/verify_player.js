const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set viewport to a common desktop size
  await page.setViewportSize({ width: 1280, height: 720 });

  console.log('Navigating to http://localhost:3000/api/auth?password=2DSadowara');
  await page.goto('http://localhost:3000/api/auth?password=2DSadowara');

  console.log('Navigating to http://localhost:3000/memories');
  await page.goto('http://localhost:3000/memories');

  // Wait for the video section to be visible
  await page.waitForSelector('iframe', { timeout: 10000 });

  // Wait a bit for the player to initialize
  await page.waitForTimeout(5000);

  console.log('Capturing top screenshot...');
  await page.screenshot({ path: 'verification/screenshots/verification_top_v2.png' });

  // Click the play button (big one in the middle)
  console.log('Clicking play button...');
  await page.click('.aspect-video.relative.group');

  // Wait for video to start playing and controls to hide
  await page.waitForTimeout(5000);

  console.log('Capturing playing screenshot...');
  await page.screenshot({ path: 'verification/screenshots/verification_playing_v2.png' });

  await browser.close();
})();
