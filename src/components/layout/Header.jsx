import { Bell, Search, UserCircle } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      {/* Search */}

      <div className="relative hidden w-full max-w-md sm:block">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search transactions..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
        />
      </div>

      {/* Right */}

      <div className="ml-auto flex items-center gap-3">
        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50">
          <Bell size={19} />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
        </button>

        <div className="hidden h-8 w-px bg-slate-200 sm:block" />

        <div className="flex items-center gap-2">
          <UserCircle
            size={34}
            strokeWidth={1.5}
            className="text-slate-500"
          />

          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-slate-800">
              Admin
            </p>

            <p className="text-[10px] text-slate-400">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}