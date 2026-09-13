import {
  Bell,
  Search,
  UserCircle,
} from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 hidden h-20 items-center border-b border-slate-200 bg-white/95 px-5 backdrop-blur sm:px-6 lg:flex lg:px-8">
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="search"
          placeholder="Search transactions..."
          aria-label="Search transactions"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
        />
      </div>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-3">
        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
        >
          <Bell size={19} />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>

        {/* Divider */}
        <div className="hidden h-8 w-px bg-slate-200 sm:block" />

        {/* User */}
        <div className="flex min-w-0 items-center gap-2">
          <UserCircle
            size={34}
            strokeWidth={1.5}
            className="shrink-0 text-slate-500"
          />

          <div className="hidden min-w-0 md:block">
            <p className="truncate text-xs font-semibold text-slate-800">
              Admin
            </p>

            <p className="truncate text-[10px] text-slate-400">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}