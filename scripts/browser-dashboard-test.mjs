import { chromium } from "playwright";

const BASE = process.env.E2E_BASE_URL || "https://pipsangel.com";
const API = "https://api.pipsangel.com/api/v1";
const DEMO_EMAIL = "demo@pipangel.com";
const DEMO_PASSWORD = "demo12345";
const EXPECTED_BUILD = process.env.E2E_EXPECT_BUILD || "1.0.0+2026.08.23-auth-fix";

const results = [];

function record(step, ok, detail = "") {
  results.push({ step, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${step}${detail ? ` — ${detail}` : ""}`);
}

async function waitForDashboard(page) {
  await page.waitForURL(/\/dashboard/, { timeout: 25000 });
  await page.locator('[aria-label="Account navigation"]').waitFor({ timeout: 20000 });
}

async function dismissBlockingModals(page) {
  const goDashboard = page.getByRole("button", { name: "Go to dashboard" });
  if (await goDashboard.isVisible({ timeout: 2000 }).catch(() => false)) {
    await goDashboard.click();
    await page.waitForTimeout(500);
    return "pending-dismissed";
  }

  const skip = page.getByRole("button", { name: "Skip for now" });
  if (await skip.isVisible({ timeout: 2000 }).catch(() => false)) {
    await skip.click();
    await page.waitForTimeout(1500);
    return "skipped";
  }

  return "none";
}

async function loginViaUi(page) {
  await page.goto(`${BASE}/dashboard`, { waitUntil: "networkidle" });
  await page.locator("#login-email").waitFor({ timeout: 10000 });
  await page.locator("#login-email").fill(DEMO_EMAIL);
  await page.locator("#login-password").fill(DEMO_PASSWORD);
  await page
    .locator("form")
    .filter({ has: page.locator("#login-email") })
    .locator('button[type="submit"]')
    .click();
  await waitForDashboard(page);
}

async function visitPage(page, path, label, contentPattern) {
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
  await dismissBlockingModals(page);
  const ok = await page.getByText(contentPattern).first().isVisible({ timeout: 10000 }).catch(() => false);
  record(label, ok, page.url());
}

async function testDeployVersion(page) {
  const res = await page.goto(`${BASE}/api/version`, { waitUntil: "networkidle" });
  const body = await res?.json();
  const ok = body?.build === EXPECTED_BUILD;
  record("Deploy version label", ok, body?.build ?? "missing");
}

async function testAuthUi(browser) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  const authCalls = [];

  page.on("response", (resp) => {
    const url = resp.url();
    if (url.includes("/auth/signup") || url.includes("/auth/login")) {
      authCalls.push(`${resp.request().method()} ${resp.status()} ${url}`);
    }
  });

  await testDeployVersion(page);

  await page.goto(`${BASE}/signup`, { waitUntil: "networkidle" });
  await page.locator("#signup-email").fill(`e2e-${Date.now()}@example.com`);
  await page.locator("#signup-password").fill("TestPass123!");
  await page.getByRole("button", { name: /free trial/i }).click();
  await page.waitForTimeout(4000);
  const signupCalls = authCalls.filter((c) => c.includes("signup"));
  record(
    "Signup (UI → API)",
    signupCalls.some((c) => c.startsWith("POST 201")),
    signupCalls.join(" | ") || "no signup response"
  );

  authCalls.length = 0;
  await loginViaUi(page);
  const loginCalls = authCalls.filter((c) => c.includes("login"));
  record(
    "Login (UI → API)",
    loginCalls.some((c) => c.startsWith("POST 200")) || /\/dashboard/.test(page.url()),
    loginCalls.join(" | ") || page.url()
  );

  await context.close();
}

async function testOnboardingForNewUser(browser, request) {
  const email = `onboard-${Date.now()}@example.com`;
  const password = "TestPass123!";
  const signupRes = await request.post(`${API}/auth/signup/`, {
    data: { email, password },
  });
  record("New user signup (API)", signupRes.ok(), email);
  if (!signupRes.ok()) return;

  const loginData = await signupRes.json();
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await context.addInitScript(({ access, refresh }) => {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
  }, {
    access: loginData.access_token,
    refresh: loginData.refresh_token,
  });

  const page = await context.newPage();
  await page.goto(`${BASE}/dashboard`, { waitUntil: "networkidle" });
  const welcome = await page.getByRole("heading", { name: /connect your broker/i }).isVisible({ timeout: 10000 }).catch(() => false);
  record("Onboarding: broker modal shown", welcome);

  const skipResult = welcome ? await dismissBlockingModals(page) : "no modal";
  const modalGone = !(await page.getByRole("heading", { name: /connect your broker/i }).isVisible({ timeout: 2000 }).catch(() => false));
  record("Onboarding: skip for now", modalGone, skipResult);

  await context.close();
}

async function testDashboardFlow(browser) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  const apiErrors = [];

  page.on("response", (resp) => {
    const url = resp.url();
    if (url.includes("api.pipsangel.com") && resp.status() >= 400) {
      apiErrors.push(`${resp.status()} ${resp.request().method()} ${url}`);
    }
  });

  await loginViaUi(page);
  record("Dashboard shell loads", true);
  await dismissBlockingModals(page);

  record(
    "Dashboard: hero metrics",
    await page.getByText(/total account equity|overall profit|win rate/i).first().isVisible({ timeout: 8000 }).catch(() => false)
  );
  record(
    "Dashboard: profit chart",
    await page.getByRole("img", { name: /profit performance chart/i }).isVisible({ timeout: 8000 }).catch(() => false)
  );

  await visitPage(page, "/control", "Control page", /trading|automation|risk|settings|lot size/i);
  const toggle = page.getByRole("switch").first();
  if (await toggle.isVisible({ timeout: 5000 }).catch(() => false)) {
    await toggle.click();
    const saved = await page.getByText(/^saved$/i).isVisible({ timeout: 5000 }).catch(() => false);
    record("Control: auto-save on toggle", saved);
  } else {
    record("Control: auto-save on toggle", false, "toggle not found");
  }

  await visitPage(page, "/trades", "Trades page", /trade|history|executed|open|closed/i);
  await visitPage(page, "/store", "Store page", /pip|coin|store|redeem|balance/i);
  await visitPage(page, "/subscription", "Subscription page", /subscription|plan|trial|renew|extend/i);

  await page.goto(`${BASE}/dashboard`, { waitUntil: "networkidle" });
  await dismissBlockingModals(page);
  record("Return to dashboard", /\/dashboard/.test(page.url()));

  await page.getByRole("button", { name: "Log out" }).click();
  await page.waitForTimeout(2000);
  record(
    "Logout returns to auth gate",
    await page.getByText(/sign in to continue/i).isVisible({ timeout: 5000 }).catch(() => false)
  );

  const notable = [...new Set(apiErrors)].filter((e) => !e.startsWith("401"));
  if (notable.length) {
    console.log("\nNotable API errors during dashboard session:");
    notable.slice(0, 12).forEach((line) => console.log("  ", line));
  }

  await context.close();
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const request = await (await browser.newContext()).request;

  try {
    console.log(`\n=== Auth UI @ ${BASE} (expect ${EXPECTED_BUILD}) ===\n`);
    await testAuthUi(browser);

    console.log(`\n=== New user onboarding @ ${BASE} ===\n`);
    await testOnboardingForNewUser(browser, request);

    console.log(`\n=== Dashboard (demo user) @ ${BASE} ===\n`);
    await testDashboardFlow(browser);
  } catch (error) {
    record("Unhandled error", false, error.message);
  } finally {
    await browser.close();
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n=== Summary: ${results.length - failed.length}/${results.length} passed ===`);
  if (failed.length) {
    console.log("\nFailed:");
    failed.forEach((f) => console.log(`  - ${f.step}${f.detail ? `: ${f.detail}` : ""}`));
    process.exitCode = 1;
  }
}

main();
