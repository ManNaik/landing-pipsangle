import { safeApiGet } from "../lib/api";
import { formatRelativeTime } from "../lib/format";
import type { CommunityMessage, ListResponse } from "../lib/types";

export async function CommunityChats() {
  const data = await safeApiGet<ListResponse<CommunityMessage>>(
    "/community/messages/?limit=5",
    300
  );
  const messages = data?.results ?? [];

  return (
    <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 sm:p-5 w-full">
      <div className="flex items-center justify-between gap-2 mb-4">
        <h3 className="font-semibold text-white text-base sm:text-lg">Community Chats</h3>
        <span className="text-zinc-500" aria-hidden>→</span>
      </div>
      <ul className="space-y-4">
        {messages.map((chat) => (
          <li
            key={chat.id}
            className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-3 sm:p-3.5"
          >
            <div className="flex items-baseline justify-between gap-2 flex-wrap">
              <span className="font-medium text-white text-sm sm:text-base">
                {chat.username}
              </span>
              <span className="text-xs text-zinc-500 tabular-nums shrink-0">
                {formatRelativeTime(chat.created_at)}
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
