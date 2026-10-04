import { buildPageMetadataFromConfig } from "../../lib/seo";
import { TradingSettings } from "../_components/TradingSettings";

export async function generateMetadata() {
  return buildPageMetadataFromConfig({
    title: "Control",
    description: "Manage your PipsAngel trading and automation settings.",
    path: "/control",
    noIndex: true,
  });
}

export default function ControlPage() {
  return <TradingSettings />;
}
