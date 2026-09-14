import { Heart, Wallet } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col items-center justify-between gap-3 px-4 py-5 text-center sm:flex-row sm:px-6 sm:py-4 sm:text-left lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
            <Wallet size={16} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              Cash Manager
            </p>
            <p className="text-[11px] text-slate-400">
              Personal Finance
            </p>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-xs text-slate-500">
          © {currentYear} Cash Manager. All rights reserved.
        </p>

        {/* Made with */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span>Made with</span>
          <Heart
            size={13}
            className="fill-current text-red-500"
          />
          <span>for better money management</span>
        </div>
      </div>
    </footer>
  );
}