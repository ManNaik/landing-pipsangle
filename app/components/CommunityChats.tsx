const COMMUNITY_CHATS = [
  {
    id: "1",
    username: "TraderMike",
    time: "2 min ago",
    message: "EURUSD looking strong above 1.0850. Took a long from the last signal.",
  },
  {
    id: "2",
    username: "ForexJane",
    time: "8 min ago",
    message: "Anyone else seeing that GBPUSD reversal? PipAngel signal was spot on.",
  },
  {
    id: "3",
    username: "London_Session",
    time: "15 min ago",
    message: "London open was wild today. Stick to the TP levels from the dashboard.",
  },
  {
    id: "4",
    username: "SignalFollower",
    time: "22 min ago",
    message: "First week with automation — already up 1.2%. Risk set to 0.5% per trade.",
  },
  {
    id: "5",
    username: "DayTrader_Alex",
    time: "31 min ago",
    message: "USDJPY hit take profit. Clean trade, no stress. Loving the transparency here.",
  },
];

export function CommunityChats() {
  return (
    <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 sm:p-5 w-full">
      <div className="flex items-center justify-between gap-2 mb-4">
        <h3 className="font-semibold text-white text-base sm:text-lg">Community Chats</h3>
        <span className="text-zinc-500" aria-hidden>→</span>
      </div>
      <ul className="space-y-4">
        {COMMUNITY_CHATS.map((chat) => (
          <li
            key={chat.id}
            className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-3 sm:p-3.5"
          >
            <div className="flex items-baseline justify-between gap-2 flex-wrap">
              <span className="font-medium text-white text-sm sm:text-base">
                {chat.username}
              </span>
              <span className="text-xs text-zinc-500 tabular-nums shrink-0">
                {chat.time}
              </span>
            </div>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              {chat.message}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
