import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Building2, Calendar, CreditCard, Bookmark, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";
import { useAuth } from "../../../contexts/AuthContext";
import { StatCardSkeleton } from "../../../components/common/LoadingSpinner";

// ════════════════════════════════════════════════════════
// MEMBER OVERVIEW
// ════════════════════════════════════════════════════════
export const MemberOverview = () => {
  const { user } = useAuth();

  const { data: memberships } = useQuery({
    queryKey: ["my-memberships"],
    queryFn: () => axiosInstance.get("/memberships/my-memberships").then((r) => r.data.memberships),
  });

  const { data: events } = useQuery({
    queryKey: ["my-event-registrations"],
    queryFn: () => axiosInstance.get("/memberships/my-events").then((r) => r.data.registrations),
  });

  const { data: announcements } = useQuery({
    queryKey: ["member-announcements"],
    queryFn: () => axiosInstance.get("/announcements/member/feed").then((r) => r.data.announcements),
  });

  const cards = [
    { label: "Clubs Joined", value: memberships?.length || 0, icon: Building2, color: "from-primary-700 to-primary-500", link: "/dashboard/member/memberships" },
    { label: "Events Registered", value: events?.length || 0, icon: Calendar, color: "from-gold-600 to-gold-400", link: "/dashboard/member/events" },
    { label: "Upcoming Events", value: events?.filter((e) => e.event && new Date(e.event.eventDate) > new Date()).length || 0, icon: Star, color: "from-green-700 to-green-500", link: "/dashboard/member/events" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white">
          Welcome, <span className="text-gradient-purple">{user?.displayName?.split(" ")[0]}</span> 👋
        </h1>
        <p className="text-gray-500 mt-1">Your ClubSphere activity at a glance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {cards.map(({ label, value, icon: Icon, color, link }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Link to={link} className="stat-card hover:border-primary-700/50 hover:-translate-y-1 transition-all duration-200 block">
              <div className={`stat-icon bg-gradient-to-br ${color}`}><Icon className="w-6 h-6 text-white" /></div>
              <div>
                <p className="text-gray-500 text-sm">{label}</p>
                <p className="text-white text-2xl font-display font-bold mt-0.5">{value}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Announcements Feed */}
      {announcements?.length > 0 && (
        <div className="max-w-2xl">
          <h2 className="text-white font-display font-semibold text-lg mb-4">Latest Announcements</h2>
          <div className="space-y-3">
            {announcements.slice(0, 3).map((a) => (
              <div key={a._id} className="card-glass p-5">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-primary-400 text-xs">{a.clubName}</p>
                  <p className="text-gray-600 text-xs">{new Date(a.createdAt).toLocaleDateString()}</p>
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">{a.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-2">{a.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════
// MY MEMBERSHIPS
// ════════════════════════════════════════════════════════
export const MyMemberships = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["my-memberships"],
    queryFn: () => axiosInstance.get("/memberships/my-memberships").then((r) => r.data.memberships),
  });

  if (isLoading) return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{Array(3).fill(0).map((_, i) => <StatCardSkeleton key={i} />)}</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white">My Clubs</h1>
        <p className="text-gray-500 mt-1">{data?.length || 0} active memberships</p>
      </div>

      {!data?.length ? (
        <div className="text-center py-16 card-glass rounded-3xl max-w-md mx-auto">
          <Building2 className="w-14 h-14 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-400 font-semibold text-lg">No club memberships yet</p>
          <p className="text-gray-600 text-sm mt-1 mb-6">Discover and join clubs that match your interests</p>
          <Link to="/clubs" className="btn-primary">Browse Clubs</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.map((m, i) => (
            <motion.div key={m._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="card">
              <div className="relative h-40 overflow-hidden">
                <img src={m.club?.bannerImage} alt={m.club?.clubName} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className={m.status === "active" ? "badge-green text-xs" : "badge-yellow text-xs"}>{m.status}</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-white font-display font-bold text-lg mb-1">{m.club?.clubName}</h3>
                <p className="text-gray-500 text-xs flex items-center gap-1.5 mb-4">
                  <Building2 className="w-3.5 h-3.5 text-primary-500" /> {m.club?.location}
                </p>
                {m.expiresAt && (
                  <p className="text-gray-600 text-xs mb-3">Expires: {new Date(m.expiresAt).toLocaleDateString()}</p>
                )}
                <Link to={`/clubs/${m.clubId}`} className="btn-outline w-full text-center block text-sm py-2">
                  View Club
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════
// MY EVENTS
// ════════════════════════════════════════════════════════
export const MyEvents = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["my-event-registrations"],
    queryFn: () => axiosInstance.get("/memberships/my-events").then((r) => r.data.registrations),
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white">My Events</h1>
        <p className="text-gray-500 mt-1">Events you've registered for</p>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Club</th>
              <th>Date</th>
              <th>Status</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => <tr key={i}><td colSpan={5}><div className="skeleton h-4 rounded my-2" /></td></tr>)
            ) : !data?.length ? (
              <tr><td colSpan={5} className="text-center py-12 text-gray-500">No event registrations yet. <Link to="/events" className="text-primary-400 hover:underline">Browse events</Link></td></tr>
            ) : data.map((r) => (
              <tr key={r._id}>
                <td className="text-white font-medium">{r.event?.title || "—"}</td>
                <td className="text-gray-400 text-sm">{r.club?.clubName || "—"}</td>
                <td className="text-gray-400 text-sm">{r.event ? new Date(r.event.eventDate).toLocaleDateString() : "—"}</td>
                <td><span className={r.status === "registered" ? "badge-green text-xs" : "badge-red text-xs"}>{r.status}</span></td>
                <td className="text-gray-500 text-xs">{r.paymentId ? "Paid" : "Free"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════
// PAYMENT HISTORY
// ════════════════════════════════════════════════════════
export const PaymentHistory = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["my-payments"],
    queryFn: () => axiosInstance.get("/payments/my-payments").then((r) => r.data.payments),
  });

  const total = data?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white">Payment History</h1>
        <p className="text-gray-500 mt-1">Total spent: <span className="text-gold-400 font-semibold">${total.toFixed(2)}</span></p>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Type</th>
              <th>Club</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => <tr key={i}><td colSpan={5}><div className="skeleton h-4 rounded my-2" /></td></tr>)
            ) : !data?.length ? (
              <tr><td colSpan={5} className="text-center py-12 text-gray-500">No payments yet</td></tr>
            ) : data.map((p) => (
              <tr key={p._id}>
                <td className="text-gold-400 font-semibold">${p.amount?.toFixed(2)}</td>
                <td><span className={p.type === "membership" ? "badge-purple text-xs" : "badge-gold text-xs"}>{p.type}</span></td>
                <td className="text-gray-400 text-sm">{p.clubName || "—"}</td>
                <td className="text-gray-400 text-sm">{new Date(p.createdAt).toLocaleDateString()}</td>
                <td><span className={p.status === "completed" ? "badge-green text-xs" : "badge-yellow text-xs"}>{p.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════
// MY BOOKMARKS
// ════════════════════════════════════════════════════════
export const MyBookmarks = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: () => axiosInstance.get("/bookmarks").then((r) => r.data.bookmarks),
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white">Bookmarked Clubs</h1>
        <p className="text-gray-500 mt-1">{data?.length || 0} saved clubs</p>
      </div>

      {!data?.length ? (
        <div className="text-center py-16 card-glass rounded-3xl max-w-md mx-auto">
          <Bookmark className="w-14 h-14 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-400 font-semibold text-lg">No bookmarks yet</p>
          <p className="text-gray-600 text-sm mt-1 mb-6">Bookmark clubs you're interested in from the Clubs page</p>
          <Link to="/clubs" className="btn-primary">Browse Clubs</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.map((b, i) => (
            b.club && (
              <motion.div key={b._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="card">
                <div className="relative h-40 overflow-hidden">
                  <img src={b.club.bannerImage} alt={b.club.clubName} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
                </div>
                <div className="p-5">
                  <span className="badge-purple text-xs mb-2 inline-flex">{b.club.category}</span>
                  <h3 className="text-white font-display font-bold text-lg mb-1">{b.club.clubName}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">{b.club.description}</p>
                  <Link to={`/clubs/${b.clubId}`} className="btn-primary w-full text-center block text-sm py-2.5">View Club</Link>
                </div>
              </motion.div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default MemberOverview;
