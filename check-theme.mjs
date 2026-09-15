import { chromium } from "playwright";

const URL = "https://asronixtechagency.publicvm.com";

async function checkTheme() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log("Opening site...");
  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 15000 });
  await page.waitForTimeout(2000);

  // Check initial theme
  const htmlClass = await page.getAttribute("html", "class") || "";
  console.log(`Initial HTML class: "${htmlClass}"`);
  const isDark = !htmlClass.includes("light");
  console.log(`Is dark mode: ${isDark}`);

  const bgColor = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  console.log(`Body background: ${bgColor}`);

  // Find theme toggle
  const toggleBtn = page.locator('button[aria-label*="Switch to"]');
  const count = await toggleBtn.count();
  console.log(`Theme toggle found: ${count > 0}`);

  if (count > 0) {
    const label = await toggleBtn.getAttribute("aria-label");
    console.log(`Button label: "${label}"`);

    // Click toggle
    await toggleBtn.click();
    await page.waitForTimeout(500);

    const newClass = await page.getAttribute("html", "class") || "";
    console.log(`After toggle class: "${newClass}"`);
    const isLight = newClass.includes("light");
    console.log(`Switched to light: ${isLight}`);

    const newBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    console.log(`New background: ${newBg}`);

    // Toggle back
    await toggleBtn.click();
    await page.waitForTimeout(500);
    const finalClass = await page.getAttribute("html", "class") || "";
    console.log(`Toggled back class: "${finalClass}"`);
  }

  // Check localStorage
  const stored = await page.evaluate(() => localStorage.getItem("asronix-theme"));
  console.log(`localStorage: "${stored}"`);

  await browser.close();
  console.log("\nDone!");
}

checkTheme().catch(e => { console.error(e.message); process.exit(1); });
