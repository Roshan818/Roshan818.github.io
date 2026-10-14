// Compare the live site with a pull request's version of it, page by page.
//
//   BASE_URL=http://127.0.0.1:4100 CAND_URL=http://127.0.0.1:4000 OUT=site-diff node test/visual/site-diff.js
//
// For each page and view (desktop light, desktop dark, mobile) it saves the live
// screenshot, the new screenshot and an image highlighting what changed, and writes
// a summary table. Content changes are expected, so a big difference is reported,
// not failed. The script fails only if a page that exists on the live site is
// broken in the new version (missing, or an error status).
const fs = require("fs");
const path = require("path");
const { chromium } = require("@playwright/test");
const { PNG } = require("pngjs");
const pixelmatchModule = require("pixelmatch");
const pixelmatch = pixelmatchModule.default || pixelmatchModule;

const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:4100";
const CAND_URL = process.env.CAND_URL || "http://127.0.0.1:4000";
const OUT = process.env.OUT || "site-diff";

const PAGES = [
  { id: "home", path: "/" },
  { id: "projects", path: "/projects/" },
  { id: "blog", path: "/blog/" },
  { id: "cv", path: "/cv/" },
  { id: "repositories", path: "/repositories/" },
];
const VIEWS = [
  { id: "desktop-light", viewport: { width: 1280, height: 800 }, theme: "light" },
  { id: "desktop-dark", viewport: { width: 1280, height: 800 }, theme: "dark" },
  { id: "mobile-light", viewport: { width: 390, height: 844 }, theme: "light" },
];

// Third-party widgets that load differently on every visit
const BLOCKED = ["google-analytics.com", "plausible.io", "giscus.app", "github-stats-extended.vercel.app"];

async function capture(browser, url, view) {
  const context = await browser.newContext({ viewport: view.viewport, colorScheme: view.theme });
  const page = await context.newPage();
  await page.addInitScript((theme) => window.localStorage.setItem("theme", theme), view.theme);
  await page.route("**/*", (route) => {
    const host = new URL(route.request().url()).hostname;
    return BLOCKED.some((b) => host === b || host.endsWith("." + b)) ? route.abort() : route.continue();
  });
  let status = 0;
  try {
    const response = await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    status = response ? response.status() : 0;
  } catch (error) {
    status = 0;
  }
  await page.addStyleTag({
    content: "*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}",
  });
  await page.waitForTimeout(300);
  const image = PNG.sync.read(await page.screenshot({ fullPage: true }));
  await context.close();
  return { status, image };
}

// Pads both screenshots to the same size so pages of different length can be compared
function compare(a, b) {
  const width = Math.max(a.width, b.width);
  const height = Math.max(a.height, b.height);
  const pad = (img) => {
    const out = new PNG({ width, height });
    out.data.fill(255);
    PNG.bitblt(img, out, 0, 0, img.width, img.height, 0, 0);
    return out;
  };
  const pa = pad(a);
  const pb = pad(b);
  const diff = new PNG({ width, height });
  const changed = pixelmatch(pa.data, pb.data, diff.data, width, height, { threshold: 0.1 });
  return { ratio: changed / (width * height), diff };
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  // CHROMIUM_PATH lets it run with a locally installed Chromium instead of Playwright's own
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const rows = [];
  let broken = 0;

  for (const pg of PAGES) {
    for (const view of VIEWS) {
      const base = await capture(browser, BASE_URL + pg.path, view);
      const cand = await capture(browser, CAND_URL + pg.path, view);
      const name = `${pg.id}-${view.id}`;
      fs.writeFileSync(path.join(OUT, `${name}-live.png`), PNG.sync.write(base.image));
      fs.writeFileSync(path.join(OUT, `${name}-new.png`), PNG.sync.write(cand.image));

      let note = "";
      let percent = "";
      if (base.status === 200 && cand.status !== 200) {
        broken += 1;
        note = `**broken** (status ${cand.status})`;
      } else if (base.status !== 200 && cand.status === 200) {
        note = "new page";
      } else {
        const { ratio, diff } = compare(base.image, cand.image);
        fs.writeFileSync(path.join(OUT, `${name}-diff.png`), PNG.sync.write(diff));
        percent = (100 * ratio).toFixed(1) + "%";
        note = ratio === 0 ? "unchanged" : ratio < 0.01 ? "tiny change" : "changed";
      }
      rows.push(`| ${pg.id} | ${view.id} | ${percent} | ${note} |`);
      console.log(`${name.padEnd(28)} ${percent.padStart(7)}  ${note}`);
    }
  }
  await browser.close();

  const summary = [
    "### Visual comparison with the live site",
    "",
    "Screenshots of the live site and this pull request, with the share of pixels that differ.",
    "Download the `site-diff` artifact to see the images (`-live`, `-new`, and `-diff` with changes in red).",
    "",
    "| Page | View | Pixels changed | Result |",
    "|---|---|---|---|",
    ...rows,
    "",
  ].join("\n");
  fs.writeFileSync(path.join(OUT, "summary.md"), summary);
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
  }
  if (broken > 0) {
    console.error(`${broken} page view(s) are broken in this version`);
    process.exit(1);
  }
})();
