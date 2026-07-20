import { buildPageMetadataFromConfig } from "../../lib/seo";
import { PipCoinStore } from "../_components/PipCoinStore";

export async function generateMetadata() {
  return buildPageMetadataFromConfig({
    title: "Referral and Store",
    description:
      "Refer friends to earn Pip Coins, then redeem them for Premium discounts and subscription extensions.",
    path: "/store",
    noIndex: true,
  });
}

export default function StorePage() {
  return <PipCoinStore />;
}
