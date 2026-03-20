import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ChevronDown, User, Settings, LogOut, Plus } from "lucide-react";

export default function TopBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">

      {/* LEFT - Greeting */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{user?.name || "User"}</span> 👋
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Ready to create amazing invoices?
        </p>
      </div>

      {/* RIGHT - Actions & Profile */}
      <div className="flex items-center gap-3">
        
        {/* Create Button */}
        <button
          onClick={() => navigate("/dashboard/create-invoice")}
          className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        >
          <Plus size={18} />
          <span className="font-medium">Create</span>
        </button>

        {/* Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 transition-all"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <ChevronDown size={16} className="text-gray-600" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
              
              {/* User Info */}
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-semibold text-gray-800">{user?.name || "User"}</p>
                <p className="text-xs text-gray-500">{user?.email || "user@example.com"}</p>
                {user?.plan && (
                  <span className="inline-block mt-2 px-2 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs rounded-full font-medium">
                    {user.plan} Plan
                  </span>
                )}
              </div>

              {/* Menu Items */}
              <button
                onClick={() => {
                  navigate("/dashboard/profile");
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors"
              >
                <User size={16} />
                <span className="text-sm font-medium">My Profile</span>
              </button>

              <button
                onClick={() => {
                  navigate("/dashboard/settings");
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors"
              >
                <Settings size={16} />
                <span className="text-sm font-medium">Settings</span>
              </button>

              <div className="border-t border-gray-100 mt-2 pt-2">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 hover:bg-red-50 flex items-center gap-3 text-red-600 transition-colors"
                >
                  <LogOut size={16} />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>

            </div>
          )}
        </div>

      </div>

      {/* Mobile Create Button */}
      <button
        onClick={() => navigate("/dashboard/create-invoice")}
        className="md:hidden w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-3 rounded-xl shadow-lg"
      >
        <Plus size={18} />
        <span className="font-medium">Create Invoice</span>
      </button>

    </div>
  );
}
