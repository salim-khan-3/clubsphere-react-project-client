import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Building2, Users, Calendar, DollarSign } from "lucide-react";
import axiosInstance from "../../../utils/axiosInstance";
import { StatCardSkeleton } from "../../../components/common/LoadingSpinner";
import { useAuth } from "../../../contexts/AuthContext";

const ManagerOverview = () => {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["manager-stats"],
    queryFn: () => axiosInstance.get("/admin/manager-stats").then((r) => r.data),
  });

  const stats = data?.stats;

  const cards = stats
    ? [
        { label: "My Clubs", value: stats.totalClubs, icon: Building2, color: "from-primary-700 to-primary-500" },
        { label: "Total Members", value: stats.totalMembers, icon: Users, color: "from-gold-600 to-gold-400" },
        { label: "Total Events", value: stats.totalEvents, icon: Calendar, color: "from-green-700 to-green-500" },
        { label: "Total Revenue", value: `$${stats.totalRevenue?.toFixed(2)}`, icon: DollarSign, color: "from-blue-700 to-blue-500" },
      ]
    : [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white">
          Welcome back, <span className="text-gradient-purple">{user?.displayName?.split(" ")[0]}</span> 👋
        </h1>
        <p className="text-gray-500 mt-1">Here's an overview of your clubs and activities</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        {isLoading
          ? Array(4).fill(0).map((_, i) => <StatCardSkeleton key={i} />)
          : cards.map(({ label, value, icon: Icon, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="stat-card"
            >
              <div className={`stat-icon bg-gradient-to-br ${color}`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">{label}</p>
                <p className="text-white text-2xl font-display font-bold mt-0.5">{value}</p>
              </div>
            </motion.div>
          ))}
      </div>

      {/* Quick Tips */}
      <div className="card-glass p-6 max-w-2xl">
        <h2 className="text-white font-display font-semibold text-lg mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: "Create a new club", link: "/dashboard/manager/clubs", desc: "Submit a new club for admin approval" },
            { label: "Schedule an event", link: "/dashboard/manager/events", desc: "Create an event for your club members" },
            { label: "Post announcement", link: "/dashboard/manager/announcements", desc: "Notify your members with an update" },
            { label: "View members", link: "/dashboard/manager/clubs", desc: "See who joined your clubs" },
          ].map(({ label, link, desc }) => (
            <a key={label} href={link}
              className="p-4 rounded-xl border border-primary-900/40 hover:border-primary-700/50 hover:bg-primary-900/20 transition-all duration-200 group">
              <p className="text-white font-medium text-sm group-hover:text-primary-300 transition-colors">{label}</p>
              <p className="text-gray-600 text-xs mt-1">{desc}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManagerOverview;
