import { PLAN_COMPARISON } from "../../lib/pricing";

function CellValue({ value, emphasize }: { value: string; emphasize?: boolean }) {
  const included = value === "Included" || value === "Full control" || value === "Adjustable";
  const excluded = value === "Not included";

  return (
    <span
      className={
        excluded
          ? "text-zinc-600"
          : included && emphasize
            ? "font-medium text-emerald-300"
            : included
              ? "text-zinc-200"
              : "text-zinc-400"
      }
    >
      {value}
    </span>
  );
}

export function PricingCompare() {
  return (
    <section className="border-t border-white/[0.06] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Compare Plans
          </h2>
          <p className="mt-3 text-sm text-zinc-400 sm:text-base">
            See exactly what changes between Basic and Premium.
          </p>
        </div>

        <div className="mt-10 hidden overflow-hidden rounded-xl border border-white/[0.07] md:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/[0.03] text-[11px] uppercase tracking-[0.14em] text-zinc-500">
              <tr>
                <th className="px-5 py-3.5 font-medium">Feature</th>
                <th className="px-5 py-3.5 font-medium">Basic</th>
                <th className="px-5 py-3.5 font-medium text-emerald-400/90">Premium</th>
              </tr>
            </thead>
            <tbody>
              {PLAN_COMPARISON.map((row) => (
                <tr
                  key={row.feature}
                  className="border-t border-white/[0.05] transition-colors duration-150 hover:bg-white/[0.03] motion-reduce:transition-none"
                >
                  <td className="px-5 py-3.5 font-medium text-zinc-200">{row.feature}</td>
                  <td className="px-5 py-3.5">
                    <CellValue value={row.basic} />
                  </td>
                  <td className="px-5 py-3.5">
                    <CellValue value={row.premium} emphasize />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 space-y-3 md:hidden">
          {PLAN_COMPARISON.map((row) => (
            <div
              key={row.feature}
              className="rounded-xl border border-white/[0.07] bg-[#0a0a0a] px-4 py-3.5"
            >
              <p className="text-sm font-medium text-white">{row.feature}</p>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-600">Basic</p>
                  <p className="mt-1">
                    <CellValue value={row.basic} />
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-emerald-500/80">
                    Premium
                  </p>
                  <p className="mt-1">
                    <CellValue value={row.premium} emphasize />
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
