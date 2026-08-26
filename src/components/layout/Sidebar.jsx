import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  BarChart3,
  Settings,
  WalletCards,
} from "lucide-react";
import { FaMoneyBillWave } from "react-icons/fa";

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

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
      {/* Logo */}

      <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
          <FaMoneyBillWave size={20} />
        </div>

        <div>
          <h1 className="text-base font-bold text-slate-900">
            Cash Manager
          </h1>

          <p className="text-[11px] text-slate-400">
            Management System
          </p>
        </div>
      </div>

      {/* Navigation */}

      <nav className="flex-1 space-y-1 px-4 py-6">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Menu
        </p>

        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all",
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
                ].join(" ")
              }
            >
              <Icon size={19} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}

      <div className="border-t border-slate-100 p-4">
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <WalletCards
              size={16}
              className="text-slate-500"
            />

            <span className="text-xs font-semibold text-slate-700">
              Cash Management
            </span>
          </div>

          <p className="text-[11px] text-slate-400">
            Keep track of your money.
          </p>
        </div>
      </div>
    </aside>
  );
}