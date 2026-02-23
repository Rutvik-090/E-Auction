import {
  Bell,
  Gavel,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const UserNavbar = () => {
  const { token, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const profileRef = useRef();
  const notificationRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
              {/* Notification Bell */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className="relative text-gray-600 hover:text-black"
                >
                  <Bell size={22} />

                  {/* Badge */}
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
                    3
                  </span>
                </button>

                {notificationOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white shadow-lg rounded-lg p-4">
                    <p className="text-sm font-semibold mb-2">Notifications</p>
                    <div className="text-sm text-gray-600 space-y-2">
                      <p>You were outbid on Luxury Watch</p>
                      <p>Auction ending in 10 minutes</p>
                      <p>You won Vintage Painting</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 text-gray-600 hover:text-black"
                >
                  <User size={22} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white shadow-lg rounded-lg py-2">
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Link>

                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                    >
                      <User size={16} />
                      Profile
                    </Link>

                    <button
                      onClick={logout}
                      className="flex items-center gap-2 px-4 py-2 w-full text-left text-red-500 hover:bg-gray-100"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>
    </nav>
  );
};
