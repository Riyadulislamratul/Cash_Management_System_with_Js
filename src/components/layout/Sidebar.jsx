import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  BarChart3,
  Settings,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navigation = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Transactions",
    path: "/transactions",
    icon: ArrowLeftRight,
  },
  {
    name: "Accounts",
    path: "/accounts",
    icon: Wallet,
  },
  {
    name: "Reports",
    path: "/reports",
    icon: BarChart3,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export default function Sidebar({ onNavigate }) {
  return (
    <div className="flex h-full min-h-screen w-64 flex-col bg-white">
      {/* Logo */}
      <div className="flex h-20 items-center border-b border-slate-200 px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
            <Wallet size={21} />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-base font-bold text-slate-900">
              Cash Manager
            </h2>

            <p className="truncate text-xs text-slate-500">
              Personal Finance
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={onNavigate}
              className={({ isActive }) =>
                `
                group flex items-center gap-3 rounded-xl px-4 py-3
                text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }
                `
              }
            >
              <Icon
                size={19}
                className="shrink-0"
              />

              <span className="truncate">
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200 p-4">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs font-medium text-slate-700">
            Cash Management System
          </p>

          <p className="mt-1 text-[11px] text-slate-500">
            Manage your money easily
          </p>
        </div>
      </div>
    </div>
  );
}