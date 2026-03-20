import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, Building2, CreditCard, Menu, X,
  Calendar, UserCheck, Megaphone, Bookmark, LogOut,
  ChevronRight, Bell, Settings, Star,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

const adminLinks = [
  { to: "/dashboard/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/dashboard/admin/users", label: "Manage Users", icon: Users },
  { to: "/dashboard/admin/clubs", label: "Manage Clubs", icon: Building2 },
  { to: "/dashboard/admin/payments", label: "Payments", icon: CreditCard },
];

const managerLinks = [
  { to: "/dashboard/manager", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/dashboard/manager/clubs", label: "My Clubs", icon: Building2 },
  { to: "/dashboard/manager/events", label: "Events", icon: Calendar },
  { to: "/dashboard/manager/announcements", label: "Announcements", icon: Megaphone },
];

const memberLinks = [
  { to: "/dashboard/member", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/dashboard/member/memberships", label: "My Clubs", icon: Building2 },
  { to: "/dashboard/member/events", label: "My Events", icon: Calendar },
  { to: "/dashboard/member/payments", label: "Payment History", icon: CreditCard },
  { to: "/dashboard/member/bookmarks", label: "Bookmarks", icon: Bookmark },
];

const DashboardLayout = () => {
  const { user, dbUser, logout, isAdmin, isManager } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links = isAdmin ? adminLinks : isManager ? managerLinks : memberLinks;
  const roleLabel = isAdmin ? "Administrator" : isManager ? "Club Manager" : "Member";
  const roleBadgeClass = isAdmin
    ? "bg-gold-500/20 text-gold-400 border-gold-500/30"
    : isManager
    ? "bg-primary-900/60 text-primary-300 border-primary-700/40"
    : "bg-green-900/40 text-green-400 border-green-700/40";

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-primary-900/40">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-gold-500 flex items-center justify-center">
            <Star className="w-5 h-5 text-white" fill="white" />
          </div>
          <span className="font-display font-bold text-xl text-white">
            Club<span className="text-gradient-gold">Sphere</span>
          </span>
        </NavLink>
      </div>

      {/* User Profile */}
      <div className="px-6 py-5 border-b border-primary-900/40">
        <div className="flex items-center gap-3">
          <img
            src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}&background=6414c4&color=fff`}
            alt={user?.displayName}
            className="w-11 h-11 rounded-xl object-cover border-2 border-primary-700/50"
          />
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm truncate">{user?.displayName}</p>
            <p className="text-gray-500 text-xs truncate">{user?.email}</p>
            <span className={`badge text-xs mt-1 border ${roleBadgeClass}`}>{roleLabel}</span>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        <p className="text-gray-600 text-xs uppercase tracking-widest px-3 pb-2 font-semibold">
          Navigation
        </p>
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span>{label}</span>
            <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100" />
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="px-4 py-4 border-t border-primary-900/40 space-y-1">
        <NavLink to="/" className="sidebar-link">
          <Settings className="w-5 h-5" />
          <span>Back to Site</span>
        </NavLink>
        <button onClick={handleLogout} className="sidebar-link w-full text-red-400 hover:bg-red-900/20 hover:text-red-300">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-dark-800 border-r border-primary-900/30 fixed h-full z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-0 h-full w-64 bg-dark-800 border-r border-primary-900/30 z-50 lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-dark-800/80 backdrop-blur-md border-b border-primary-900/30 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-dark-600 text-gray-400 hover:text-white transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="hidden lg:block">
            <h1 className="text-white font-semibold font-display">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button className="p-2 rounded-xl hover:bg-dark-600 text-gray-400 hover:text-white transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full"></span>
            </button>
            <img
              src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}&background=6414c4&color=fff`}
              alt={user?.displayName}
              className="w-9 h-9 rounded-xl object-cover border-2 border-primary-700/50 cursor-pointer"
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
