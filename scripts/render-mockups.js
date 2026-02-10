const path = require("path");
const fs = require("fs/promises");
const fsSync = require("fs");
const { pathToFileURL } = require("url");
let chromium;
try {
  // Prefer full Playwright if installed (it bundles browsers).
  ({ chromium } = require("playwright"));
} catch {
  // Fallback to playwright-core (requires a system browser/channel).
  ({ chromium } = require("playwright-core"));
}

const breakpoints = [320, 768, 1024, 1440];
const pageArg = process.argv[2] || "Layouts/Mockups/idea-detail.html";
const baseName = path.basename(pageArg, path.extname(pageArg));
const outArg = process.argv[3] || `Layouts/Mockups/renders/${baseName}`;

const pagePath = path.resolve(process.cwd(), pageArg);
const outDir = path.resolve(process.cwd(), outArg);
const fileUrl = pathToFileURL(pagePath).href;

// WSL/CI environments may miss shared libs required by Playwright's bundled
// chromium_headless_shell. If we have a local lib bundle, prepend it.
const localLibDir = path.resolve(
  process.cwd(),
  ".tmp/playwright-libs/usr/lib/x86_64-linux-gnu",
);
if (fsSync.existsSync(localLibDir)) {
  const existing = process.env.LD_LIBRARY_PATH || "";
  process.env.LD_LIBRARY_PATH = existing ? `${localLibDir}:${existing}` : localLibDir;
}

const render = async () => {
  await fs.mkdir(outDir, { recursive: true });
  let browser;
  try {
    browser = await chromium.launch({ channel: "msedge", headless: true });
  } catch {
    browser = await chromium.launch({ headless: true });
  }
  const context = await browser.newContext();

  for (const width of breakpoints) {
    const page = await context.newPage();
    await page.setViewportSize({ width, height: 900 });
    await page.goto(fileUrl, { waitUntil: "networkidle" });
    await page.waitForTimeout(300);
    await page.addStyleTag({
      content: "body::before, body::after { display: none !important; }",
    });
    await page.screenshot({
      path: path.join(outDir, `${baseName}-${width}.png`),
      fullPage: true,
    });
    await page.close();
  }

  await browser.close();
};

render().catch((error) => {
  console.error(error);
  process.exit(1);
});
