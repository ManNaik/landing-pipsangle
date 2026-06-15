import { BROKER_SETS, type Broker, type BrokerTickerVariant } from "../lib/brokers";

type BrokerTickerProps = {
  variant?: BrokerTickerVariant;
  label?: string;
};

const LOOP_COPIES = 8;

function BrokerLogo({ broker }: { broker: Broker }) {
  return (
    <div className="flex shrink-0 items-center justify-center px-6 sm:px-8">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={broker.logo}
        alt={broker.name}
        width={140}
        height={40}
        className="h-8 w-auto max-w-[140px] object-contain opacity-75 transition-opacity duration-300 hover:opacity-100 sm:h-9"
        draggable={false}
        loading="lazy"
      />
    </div>
  );
}

export function BrokerTicker({
  variant = "tier1",
  label = "Compatible brokers & platforms",
}: BrokerTickerProps) {
  const brokers = BROKER_SETS[variant];
  const segment = Array.from({ length: LOOP_COPIES }, () => brokers).flat();
  const track = [...segment, ...segment];

  return (
    <div
      className="border-y border-zinc-800/80 bg-zinc-950/80 py-4 sm:py-5"
      aria-label={label}
    >
      <p className="mb-3 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500 sm:text-xs">
        {label}
      </p>
      <div className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-zinc-950 to-transparent sm:w-24"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-zinc-950 to-transparent sm:w-24"
          aria-hidden
        />
        <div className="broker-ticker-track flex w-max">
          {track.map((broker, i) => (
            <BrokerLogo key={`${broker.id}-${i}`} broker={broker} />
          ))}
        </div>
      </div>
    </div>
  );
}
