import { Section, SectionIntro, TextLink } from "./ui";

const POINTS = [
  {
    title: "Trading access only",
    body: "Your MT5 login lets our terminal place, change and close trades. It can't withdraw money. Withdrawals need your IC Markets client-area login, which we never ask for.",
  },
  {
    title: "Your password, sent once",
    body: "It travels from our website to our trading servers over a signed connection, is stored there encrypted, and is never returned by our systems or written to logs. Our website keeps no copy.",
  },
  {
    title: "You can cut access at any time",
    body: "Switch copying off in your dashboard to stop new trades. Change your MT5 password in IC Markets and our terminal can no longer log in at all.",
  },
];

export function SecurityBand({ showLink = true }: { showLink?: boolean }) {
  return (
    <Section tone="deep" id="security">
      <SectionIntro title="Your money stays with IC Markets">
        <p>
          Connecting your account means handing over your MT5 login, so here is exactly what that allows and
          how it&apos;s protected.
        </p>
      </SectionIntro>
      <div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
        {POINTS.map((point) => (
          <div key={point.title} className="border-t-2 border-mint-500/60 pt-5">
            <h3 className="text-lg font-bold">{point.title}</h3>
            <p className="mt-2 leading-relaxed text-sage-300">{point.body}</p>
          </div>
        ))}
      </div>
      {showLink ? (
        <p className="mt-10">
          <TextLink href="/security">Read the full security details</TextLink>
        </p>
      ) : null}
    </Section>
  );
}
