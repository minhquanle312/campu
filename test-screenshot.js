import { chromium } from 'playwright'
import path from 'node:path'
import fs from 'node:fs'
;(async () => {
  const evidenceDir = path.join(process.cwd(), '.sisyphus', 'evidence')
  if (!fs.existsSync(evidenceDir)) {
    fs.mkdirSync(evidenceDir, { recursive: true })
  }

  const browser = await chromium.launch()
  const context = await browser.newContext()

  // Desktop
  const desktopPage = await context.newPage()
  await desktopPage.setViewportSize({ width: 1440, height: 900 })
  await desktopPage.goto('http://localhost:3282/en/cv', {
    waitUntil: 'networkidle',
  })
  await desktopPage.waitForTimeout(2000) // wait for styles to settle
  await desktopPage.screenshot({
    path: path.join(evidenceDir, 'task-5-sidebar-FIXED-desktop.png'),
    fullPage: true,
  })

  // Mobile
  const mobilePage = await context.newPage()
  await mobilePage.setViewportSize({ width: 375, height: 812 })
  await mobilePage.goto('http://localhost:3282/en/cv', {
    waitUntil: 'networkidle',
  })
  await mobilePage.waitForTimeout(2000) // wait for styles to settle
  await mobilePage.screenshot({
    path: path.join(evidenceDir, 'task-5-sidebar-FIXED-mobile.png'),
    fullPage: true,
  })

  await browser.close()
  console.log('Screenshots taken.')
})()
