import { Gavel, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const UserNavbar = () => {
  const { token, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <Gavel className="w-6 h-6" />
          AuctionArena
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink
            to="/auctions"
            className={({ isActive }) =>
              isActive
                ? "text-black font-semibold"
                : "text-gray-600 hover:text-black"
            }
          >
            Browse
          </NavLink>

          {!token ? (
            <>
              <Link to="/login" className="text-gray-600 hover:text-black">
                Login
              </Link>

              <Link
                to="/signup"
                className="bg-black text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-gray-600 hover:text-black"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>

              <button
                onClick={logout}
                className="flex items-center gap-2 text-red-500 hover:text-red-600"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-6 pb-4 space-y-4 bg-white border-t">
          <Link
            to="/auctions"
            onClick={() => setIsOpen(false)}
            className="block text-gray-600"
          >
            Browse
          </Link>

          {!token ? (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block text-gray-600"
              >
                Login
              </Link>

              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="block text-gray-600"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block text-gray-600"
              >
                Dashboard
              </Link>

              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="block text-red-500"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
