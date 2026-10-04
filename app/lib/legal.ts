import { normalizeBrandText } from "./brand";
import { FREE_TRIAL_DAYS } from "./trial";
import type { SiteConfig } from "./types";

export const LEGAL_UPDATED = "3 October 2026";

/** CMS bodies written for the retired signals product are ignored in favour of the defaults below. */
const OUTDATED_LEGAL = /signal|pipangel\.com|metatrader 4|\bmt4\b/i;

export function currentCmsBody(body: string | undefined | null): string | null {
  const text = (body ?? "").trim();
  if (!text || OUTDATED_LEGAL.test(text)) return null;
  return normalizeBrandText(text);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function operator(config: SiteConfig): string {
  const name = escapeHtml(config.legal_name || config.brand_name);
  const details = [
    config.registration_number ? `registration number ${escapeHtml(config.registration_number)}` : "",
    config.registered_address ? `registered address ${escapeHtml(config.registered_address)}` : "",
  ].filter(Boolean);
  return details.length ? `${name} (${details.join(", ")})` : name;
}

function mailto(email: string): string {
  const safe = escapeHtml(email);
  return `<a href="mailto:${safe}">${safe}</a>`;
}

export function termsHtml(config: SiteConfig): string {
  const brand = escapeHtml(config.brand_name);
  const email = mailto(config.support_email ?? "");
  const law = config.governing_law
    ? `<h2>Governing law</h2><p>These terms are governed by the laws of ${escapeHtml(config.governing_law)}.</p>`
    : "";

  return `
<p>Last updated: ${LEGAL_UPDATED}</p>
<h2>Who we are</h2>
<p>${brand} is operated by ${operator(config)}. In these terms, "${brand}", "we" and "us" mean the operator, and "you" means the person using the service. By creating an account or using the service you agree to these terms.</p>

<h2>What ${brand} does</h2>
<p>${brand} provides automated copy trading for IC Markets MetaTrader 5 accounts. When you connect your account, we run an MT5 terminal for you on our servers, and trades we place are copied into your account, each opened with a stop loss and sized for your account.</p>
<p>${brand} is not a broker. We do not hold your money, and we do not give personal financial, investment or tax advice. Your trading account is held by IC Markets under IC Markets' own terms. ${brand} is independent of IC Markets and MetaQuotes.</p>

<h2>Risk</h2>
<p>Trading forex and CFDs on margin is high risk and not suitable for everyone. You could lose some or all of the money in your trading account. A stop loss limits the planned loss on a trade but can be filled at a worse price in fast or gapping markets. Results in your account can differ from ours because of account size, spreads, slippage and timing. Past results do not guarantee future results. Only trade with money you can afford to lose.</p>

<h2>Your responsibilities</h2>
<ul>
<li>You must be at least 18 and allowed to trade forex and CFDs where you live.</li>
<li>The information you give us must be accurate, and the IC Markets account you connect must be yours.</li>
<li>You are responsible for your IC Markets account, its costs, and any taxes on your trading.</li>
<li>Keep your ${brand} login private. Each customer may connect one MT5 account.</li>
</ul>

<h2>Permission to trade</h2>
<p>By connecting your MT5 account you authorise us to open, change and close trades in that account on your behalf. The permission lasts until you switch copying off, change your MT5 password, or ask us to disconnect you. Switching copying off stops new trades; trades already open continue to be managed. The MT5 login cannot withdraw or transfer money, and we will never ask for your IC Markets client-area login.</p>

<h2>Free trial</h2>
<p>New customers get a ${FREE_TRIAL_DAYS}-day free trial. It starts when your MT5 account is connected and verified, not when you sign up. At the end of the trial, copying stops unless you pay for a plan. One trial per customer.</p>

<h2>Plans and payment</h2>
<p>Current plans and prices are shown on our pricing page. You pay through PayPal. Each payment covers one period (for example 7 or 28 days) that starts straight away. Plans do not renew automatically: when a period ends, copying stops until you pay again. Paying before a period ends adds the new period on top. If we change prices, the change applies to periods you buy afterwards.</p>
<p>If you believe a charge is wrong, email ${email} with your account email and the PayPal transaction ID. Nothing in these terms limits rights you have under the law where you live.</p>

<h2>Stopping, suspension and closing accounts</h2>
<p>You can stop at any time by switching copying off and not paying for another period. You can ask us to delete your connection and account by emailing ${email}. We may suspend or stop the service, or close an account, if it is misused, if payment is not made, if we are required to by law, or if we stop offering the service. After a trial or paid period ends, we keep your setup for a short time so you can continue, then release your terminal and delete your stored MT5 password.</p>

<h2>Availability</h2>
<p>We work to keep the service running, but we cannot promise it will be uninterrupted. Outages at our servers, at IC Markets or on the internet can delay or prevent trades from being copied, changed or closed.</p>

<h2>Liability</h2>
<p>To the extent the law allows, we are not responsible for trading losses, for losses caused by IC Markets, MetaTrader or internet outages, or for trades that are delayed or not copied. Our total liability to you is limited to the fees you paid us in the 12 months before the claim. Nothing in these terms excludes liability that cannot be excluded by law.</p>

<h2>Changes to these terms</h2>
<p>We may update these terms. The date at the top shows the latest version. If a change materially affects you, we will tell you on the site or by email before it applies.</p>
${law}
<h2>Contact</h2>
<p>Questions about these terms: ${email}</p>
`.trim();
}

export function privacyHtml(config: SiteConfig): string {
  const brand = escapeHtml(config.brand_name);
  const email = mailto(config.support_email ?? "");

  return `
<p>Last updated: ${LEGAL_UPDATED}</p>
<h2>Who we are</h2>
<p>${brand} is operated by ${operator(config)}, which is responsible for the personal data described here. Contact us about privacy at ${email}.</p>

<h2>What we collect</h2>
<ul>
<li><strong>Account details:</strong> your email address, your ${brand} password (stored only as a one-way hash), your plan choice, and when you accepted our terms.</li>
<li><strong>Broker connection:</strong> your IC Markets MT5 login number and server name, your confirmation of the risk warning, and the status of your connection. Your MT5 password is passed once to our trading servers, where it is stored encrypted and used only to log your MT5 terminal in. Our website does not keep it.</li>
<li><strong>Trading data:</strong> the trades placed in your account through ${brand}, their results, and account information your MT5 terminal reports that we need to size and manage trades.</li>
<li><strong>Payments:</strong> PayPal order IDs, amounts and dates. We never receive your card or bank details.</li>
<li><strong>Messages:</strong> your name, email and message when you contact us.</li>
<li><strong>Weekly market brief:</strong> if you sign up, your email address, when you confirmed it, and the page and campaign that led you to the signup form.</li>
<li><strong>Website use:</strong> pages visited, browser and device details, and campaign information such as the ad or link that brought you to the site. Analytics and advertising cookies are only set if you allow them.</li>
</ul>

<h2>How we use it</h2>
<ul>
<li>To run the service: connect your account, copy trades, and show your dashboard.</li>
<li>To take payments and keep billing records.</li>
<li>To answer your messages and help with setup.</li>
<li>To send the weekly market brief to people who signed up and confirmed their address.</li>
<li>To keep accounts secure and prevent misuse.</li>
<li>To understand how people find and use the site, so we can improve it.</li>
<li>To meet legal and accounting obligations.</li>
</ul>
<p>Where data protection law requires a legal basis, we rely on performing our contract with you, our legitimate interests in running and improving the service, your consent for analytics and advertising cookies and for the weekly market brief, and legal obligations.</p>

<h2>Who we share it with</h2>
<p>We use service providers for hosting, email, payments (PayPal), website analytics (Google Analytics) and cookie consent (CookieHub). They process data only to provide their service to us. Your MT5 terminal connects to IC Markets' servers to trade; we do not otherwise share your data with IC Markets. We do not sell your personal data. Some providers may process data outside your country.</p>

<h2>How long we keep it</h2>
<p>We keep account and billing records while your account is open and afterwards for as long as the law requires. Your stored MT5 password is deleted when your connection is released. Messages are kept as long as needed to deal with them. Weekly brief signups are kept until you unsubscribe or ask us to remove them.</p>

<h2>Cookies</h2>
<p>We use cookies that the site needs to work, such as keeping you logged in. Analytics and advertising cookies are only used with your permission, which you can change at any time from the cookie settings button on the site.</p>

<h2>Your rights</h2>
<p>You can ask to see, correct or delete your personal data, object to how we use it, or withdraw consent, by emailing ${email}. You can also complain to your local data protection authority.</p>

<h2>Security</h2>
<p>The site uses HTTPS, account passwords are hashed, MT5 passwords are stored encrypted on our trading servers, and access to personal data is limited to people who need it.</p>

<h2>Children</h2>
<p>${brand} is not for anyone under 18, and we do not knowingly collect their data.</p>

<h2>Changes</h2>
<p>We may update this policy. The date at the top shows the latest version.</p>
`.trim();
}
