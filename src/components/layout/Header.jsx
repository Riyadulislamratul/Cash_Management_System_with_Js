import { Bell, Search, UserCircle } from "lucide-react";

export default function Header() {
  return (
    <header className="header">
      <div className="header-search">
        <Search size={19} />
        <input
          type="text"
          placeholder="Search transactions..."
        />
      </div>

      <div className="header-actions">
        <button className="icon-button">
          <Bell size={20} />
        </button>

        <div className="profile">
          <UserCircle size={34} />

          <div>
            <strong>Admin</strong>
            <span>Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}