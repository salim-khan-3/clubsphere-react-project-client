import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Users, Building2, CreditCard, Calendar,
  TrendingUp, Clock, CheckCircle, XCircle,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import axiosInstance from "../../../utils/axiosInstance";
import { StatCardSkeleton } from "../../../components/common/LoadingSpinner";

const COLORS = ["#9b35f5", "#f59e0b", "#10b981", "#ef4444", "#3b82f6"];

const AdminOverview = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => axiosInstance.get("/admin/stats").then((r) => r.data),
  });

  const stats = data?.stats;
  const charts = data?.charts;

  const statCards = stats
    ? [
        { label: "Total Users", value: stats.totalUsers, icon: Users, color: "from-primary-700 to-primary-500", bg: "bg-primary-900/30" },
        { label: "Total Clubs", value: stats.totalClubs, icon: Building2, color: "from-gold-600 to-gold-400", bg: "bg-gold-900/20" },
        { label: "Active Memberships", value: stats.totalMemberships, icon: CheckCircle, color: "from-green-700 to-green-500", bg: "bg-green-900/20" },
        { label: "Total Events", value: stats.totalEvents, icon: Calendar, color: "from-blue-700 to-blue-500", bg: "bg-blue-900/20" },
        { label: "Total Revenue", value: `$${stats.totalRevenue?.toFixed(2)}`, icon: CreditCard, color: "from-primary-600 to-gold-500", bg: "bg-primary-900/20" },
        { label: "Pending Clubs", value: stats.pendingClubs, icon: Clock, color: "from-yellow-700 to-yellow-500", bg: "bg-yellow-900/20" },
      ]
    : [];

  const clubStatusData = stats
    ? [
        { name: "Approved", value: stats.approvedClubs },
        { name: "Pending", value: stats.pendingClubs },
        { name: "Rejected", value: stats.rejectedClubs },
      ]
    : [];

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const revenueChartData = charts?.monthlyPayments?.map((d) => ({
    month: monthNames[d._id.month - 1],
    revenue: d.total,
    transactions: d.count,
  })) || [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white">Admin Overview</h1>
        <p className="text-gray-500 mt-1">Platform-wide statistics and insights</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-10">
        {isLoading
          ? Array(6).fill(0).map((_, i) => <StatCardSkeleton key={i} />)
          : statCards.map(({ label, value, icon: Icon, color, bg }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 card-glass p-6">
          <h2 className="text-white font-display font-semibold text-lg mb-6">Monthly Revenue</h2>
          {revenueChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={revenueChartData}>
                <XAxis dataKey="month" stroke="#4b5563" tick={{ fill: "#9ca3af", fontSize: 12 }} />
                <YAxis stroke="#4b5563" tick={{ fill: "#9ca3af", fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ background: "#1a1430", border: "1px solid rgba(155,53,245,0.3)", borderRadius: "12px", color: "#f0eaff" }}
                  formatter={(v) => [`$${v}`, "Revenue"]}
                />
                <Bar dataKey="revenue" fill="#9b35f5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-600">No revenue data yet</div>
          )}
        </div>

        {/* Club Status Pie */}
        <div className="card-glass p-6">
          <h2 className="text-white font-display font-semibold text-lg mb-6">Club Status</h2>
          {clubStatusData.some((d) => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={clubStatusData} cx="50%" cy="45%" innerRadius={60} outerRadius={90}
                  paddingAngle={4} dataKey="value">
                  {clubStatusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Legend formatter={(v) => <span className="text-gray-400 text-xs">{v}</span>} />
                <Tooltip contentStyle={{ background: "#1a1430", border: "1px solid rgba(155,53,245,0.3)", borderRadius: "12px", color: "#f0eaff" }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-600">No club data yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
