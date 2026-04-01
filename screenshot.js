import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'
;(async () => {
  const browser = await chromium.launch()

  // Ensure evidence directory exists
  const evidenceDir = '.sisyphus/evidence'
  if (!fs.existsSync(evidenceDir)) {
    fs.mkdirSync(evidenceDir, { recursive: true })
  }

  try {
    // Desktop screenshot (1440x900)
    const desktopPage = await browser.newPage({
      viewport: { width: 1440, height: 900 },
    })
    await desktopPage.goto('http://localhost:3282/vi/cv', {
      waitUntil: 'networkidle',
    })
    await desktopPage.screenshot({
      path: path.join(evidenceDir, 'task-5-sidebar-final-desktop.png'),
      fullPage: true,
    })
    console.log('✓ Desktop screenshot saved: task-5-sidebar-final-desktop.png')
    await desktopPage.close()

    // Mobile screenshot (390x844)
    const mobilePage = await browser.newPage({
      viewport: { width: 390, height: 844 },
    })
    await mobilePage.goto('http://localhost:3282/vi/cv', {
      waitUntil: 'networkidle',
    })
    await mobilePage.screenshot({
      path: path.join(evidenceDir, 'task-5-sidebar-final-mobile.png'),
      fullPage: true,
    })
    console.log('✓ Mobile screenshot saved: task-5-sidebar-final-mobile.png')
    await mobilePage.close()
  } catch (err) {
    console.error('Error:', err.message)
    process.exit(1)
  } finally {
    await browser.close()
  }
})()
