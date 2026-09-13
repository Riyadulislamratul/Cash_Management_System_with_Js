import { useState } from "react";
import { Menu, X } from "lucide-react";

import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-[1px] lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64
          transform bg-white
          shadow-xl
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:shadow-none
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* Mobile close button */}
        <button
          type="button"
          onClick={closeSidebar}
          aria-label="Close sidebar"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
        >
          <X size={20} />
        </button>

        <Sidebar onNavigate={closeSidebar} />
      </aside>

      {/* Main content */}
      <div className="min-h-screen lg:ml-64">
        {/* Mobile navigation bar */}
        <div className="flex h-16 items-center border-b border-slate-200 bg-white px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <Menu size={23} />
          </button>

          <div className="ml-3 min-w-0">
            <h1 className="truncate text-base font-bold text-slate-900">
              Cash Manager
            </h1>

            <p className="truncate text-[11px] text-slate-400">
              Personal Finance
            </p>
          </div>
        </div>

        {/* Desktop header */}
        <Header />

        {/* Page content */}
        <main className="w-full px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-[1600px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}