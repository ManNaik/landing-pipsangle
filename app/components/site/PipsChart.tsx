import { formatDate } from "../../lib/format";

const WIDTH = 720;
const HEIGHT = 260;
const PAD = { top: 16, right: 16, bottom: 36, left: 64 };

/** Running total of pips after each closed trade. Server-rendered, no client JS. */
export function PipsChart({
  values,
  firstDate,
  lastDate,
}: {
  values: number[];
  firstDate: string | null;
  lastDate: string | null;
}) {
  if (values.length < 3) return null;

  const min = Math.min(0, ...values);
  const max = Math.max(0, ...values);
  const range = max - min || 1;
  const innerW = WIDTH - PAD.left - PAD.right;
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (i / (values.length - 1)) * innerW;
  const y = (v: number) => PAD.top + innerH - ((v - min) / range) * innerH;
  const path = values.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const ticks = Array.from(new Set([min, 0, max]));
  const final = values[values.length - 1];

  return (
    <figure>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Cumulative result in pips, ending at ${final} pips`}
      >
        {ticks.map((tick) => (
          <g key={tick}>
            <line
              x1={PAD.left}
              x2={WIDTH - PAD.right}
              y1={y(tick)}
              y2={y(tick)}
              stroke={tick === 0 ? "#3f3f46" : "#1c1c1f"}
              strokeDasharray={tick === 0 ? undefined : "4 4"}
            />
            <text x={PAD.left - 10} y={y(tick) + 4} textAnchor="end" fontSize="12" fill="#8e8e97">
              {tick > 0 ? `+${tick}` : tick}
            </text>
          </g>
        ))}
        <path d={path} fill="none" stroke="#34d399" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {firstDate ? (
          <text x={PAD.left} y={HEIGHT - 10} fontSize="12" fill="#8e8e97">
            {formatDate(firstDate)}
          </text>
        ) : null}
        {lastDate ? (
          <text x={WIDTH - PAD.right} y={HEIGHT - 10} textAnchor="end" fontSize="12" fill="#8e8e97">
            {formatDate(lastDate)}
          </text>
        ) : null}
      </svg>
      <figcaption className="mt-2 text-sm text-sage-400">
        Cumulative result in pips after each closed trade (vertical axis: pips; horizontal axis: trades in closing
        order).
      </figcaption>
    </figure>
  );
}
