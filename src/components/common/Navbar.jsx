import { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Star, ChevronDown, LayoutDashboard, LogOut, User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, dbUser, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    setDropdownOpen(false);
    navigate("/");
  };

  const getDashboardLink = () => {
    if (dbUser?.role === "admin") return "/dashboard/admin";
    if (dbUser?.role === "clubManager") return "/dashboard/manager";
    return "/dashboard/member";
  };

  const navLinks = [
    { to: "/", label: "Home", end: true },
    { to: "/clubs", label: "Clubs" },
    { to: "/events", label: "Events" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-dark-800/90 backdrop-blur-xl border-b border-primary-900/40 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-gold-500 flex items-center justify-center shadow-glow-purple group-hover:scale-110 transition-transform duration-300">
              <Star className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="font-display font-bold text-xl text-white">
              Club<span className="text-gradient-gold">Sphere</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-primary-300 bg-primary-900/40"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl bg-dark-600/60 border border-primary-900/40 text-gray-400 hover:text-primary-300 hover:border-primary-700/50 transition-all duration-200"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 bg-dark-600/60 border border-primary-900/40 rounded-xl px-3 py-2 hover:border-primary-700/50 transition-all duration-200"
                >
                  <img
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=6414c4&color=fff`}
                    alt={user.displayName}
                    className="w-7 h-7 rounded-lg object-cover"
                  />
                  <span className="text-sm text-gray-300 font-medium max-w-[100px] truncate">
                    {user.displayName}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 bg-dark-700 border border-primary-900/40 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-primary-900/30">
                        <p className="text-white text-sm font-semibold truncate">{user.displayName}</p>
                        <p className="text-gray-500 text-xs truncate">{user.email}</p>
                        <span className="badge-purple text-xs mt-1">
                          {dbUser?.role === "admin" ? "Admin" : dbUser?.role === "clubManager" ? "Club Manager" : "Member"}
                        </span>
                      </div>
                      <div className="p-2">
                        <Link
                          to={getDashboardLink()}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-300 hover:bg-primary-900/40 hover:text-primary-300 text-sm transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-300 hover:bg-primary-900/40 hover:text-primary-300 text-sm transition-colors"
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </Link>
                        <hr className="border-primary-900/30 my-1" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-900/20 text-sm transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2.5">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button onClick={toggleDarkMode} className="p-2 rounded-xl text-gray-400">
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl bg-dark-600/60 border border-primary-900/40 text-gray-300"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark-800/95 backdrop-blur-xl border-t border-primary-900/30"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(({ to, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive ? "text-primary-300 bg-primary-900/40" : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
              <hr className="border-primary-900/30 my-2" />
              {user ? (
                <>
                  <Link to={getDashboardLink()} onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/5">
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-900/20">
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-outline text-center text-sm">Login</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary text-center text-sm">Get Started</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
