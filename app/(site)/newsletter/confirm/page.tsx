import { Suspense } from "react";
import { NewsletterConfirm } from "../../../components/news/NewsletterConfirm";
import { buildPageMetadataFromConfig } from "../../../lib/seo";

export async function generateMetadata() {
  return buildPageMetadataFromConfig({
    title: "Confirm your subscription",
    description: "Confirm your email address for the PipsAngel weekly market brief.",
    path: "/newsletter/confirm",
    noIndex: true,
  });
}

export default function NewsletterConfirmPage() {
  return (
    <section className="px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-xl">
        <Suspense
          fallback={
            <p role="status" className="text-lg text-sage-300">
              Confirming your subscription…
            </p>
          }
        >
          <NewsletterConfirm />
        </Suspense>
      </div>
    </section>
  );
}
