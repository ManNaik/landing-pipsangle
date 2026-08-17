import {
  buildBreadcrumbSchema,
  buildHowToSchema,
  buildPageMetadataFromConfig,
  buildServiceSchema,
  getSiteConfig,
  jsonLdScript,
  resolveSiteUrl,
} from "../../lib/seo";
import { AUTOMATION_PIPELINE } from "../../lib/automationContent";
import { AutomationHero } from "../../components/automation/AutomationHero";
import { AutomationPipeline } from "../../components/automation/AutomationPipeline";
import { AutomationFeatureGrid } from "../../components/automation/AutomationFeatureGrid";
import { RiskEngineVisualization } from "../../components/automation/RiskEngineVisualization";
import { BrokerConnection } from "../../components/automation/BrokerConnection";
import { ControlPanel } from "../../components/automation/ControlPanel";
import { ConnectionSteps } from "../../components/automation/ConnectionSteps";
import { PerformanceCTA } from "../../components/automation/PerformanceCTA";
import { AutomationFinalCTA } from "../../components/automation/AutomationFinalCTA";

export async function generateMetadata() {
  return buildPageMetadataFromConfig({
    title: "Automated Forex Trading | IC Markets MT5",
    description:
      "Connect your IC Markets MetaTrader 5 account and let PipAngel automatically execute validated forex trades with AI-driven analysis, professional trader validation, and built-in risk management.",
    path: "/automated-forex-trading",
    keywords: [
      "automated forex trading",
      "IC Markets MT5",
      "forex trading automation",
      "MetaTrader 5 automation",
      "forex risk management",
      "algorithmic forex trading",
    ],
  });
}

export default async function AutomatedForexTradingPage() {
  const siteConfig = await getSiteConfig();
  const siteUrl = resolveSiteUrl(siteConfig);
  const brandName = siteConfig?.brand_name ?? "PipAngel";

  const title = "Automated Forex Trading | IC Markets MT5";
  const description =
    "Connect your IC Markets MT5 account for automated, risk-managed forex trade execution.";

  const serviceSchema = buildServiceSchema(siteUrl, brandName, {
    name: title,
    description,
    path: "/automated-forex-trading",
    serviceType: "Automated Forex Trading",
  });

  const howToSchema = buildHowToSchema(siteUrl, {
    name: "How PipAngel Automated Execution Works",
    description:
      "From market intelligence through validation, risk calculation, and MT5 execution.",
    path: "/automated-forex-trading",
    steps: AUTOMATION_PIPELINE.map((s) => `${s.title}: ${s.description}`),
  });

  const breadcrumbSchema = buildBreadcrumbSchema(siteUrl, [
    { name: "Home", path: "/" },
    { name: "Automated Trading", path: "/automated-forex-trading" },
  ]);

  return (
    <div className="min-w-0 overflow-x-clip bg-[#050505]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLdScript([howToSchema, serviceSchema, breadcrumbSchema]),
        }}
      />

      <AutomationHero />
      <AutomationPipeline />
      <AutomationFeatureGrid />
      <RiskEngineVisualization />
      <BrokerConnection />
      <ControlPanel />
      <ConnectionSteps />
      <PerformanceCTA />
      <AutomationFinalCTA />
    </div>
  );
}
