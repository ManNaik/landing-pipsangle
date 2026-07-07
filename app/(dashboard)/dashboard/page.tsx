import { buildPageMetadataFromConfig } from "../../lib/seo";
import { DashboardContent } from "../_components/DashboardContent";

export async function generateMetadata() {
  return buildPageMetadataFromConfig({
    title: "Dashboard",
    description: "Your PipAngel profit performance and account overview.",
    path: "/dashboard",
    noIndex: true,
  });
}

export default function DashboardPage() {
  return <DashboardContent />;
}
