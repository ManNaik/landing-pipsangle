import Link from "next/link";
import { Suspense } from "react";
import { FreeTrialBadge } from "../../components/FreeTrialBadge";
import { SignupForm } from "../../components/SignupForm";
import { buildPageMetadataFromConfig } from "../../lib/seo";
import { FREE_TRIAL_HEADLINE, FREE_TRIAL_SHORT } from "../../lib/trial";

export async function generateMetadata() {
  return buildPageMetadataFromConfig({
    title: "Sign Up",
    description: "Create your PipAngel account and start trading with signals or automation.",
    path: "/signup",
    noIndex: true,
  });
}

export default async function SignupPage() {
  return (
    <div className="min-w-0">
      <section className="border-b border-zinc-800 px-4 py-14 sm:px-6 sm:py-20 lg:py-28 lg:px-8">
        <div className="mx-auto max-w-md">
          <FreeTrialBadge variant="highlight" className="mx-auto mb-5" />
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl text-center">
            {FREE_TRIAL_HEADLINE}
          </h1>
          <p className="mt-4 text-base text-zinc-400 text-center">
            Create your account and {FREE_TRIAL_SHORT.toLowerCase()} — full access to forex signals and automation.
          </p>
          <Suspense fallback={<div className="mt-8 text-center text-zinc-500">Loading...</div>}>
            <SignupForm />
          </Suspense>
          <p className="mt-6 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link href="/" className="text-emerald-400 hover:text-emerald-300">
              Log in from the home page
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
