import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { EventCard } from "../../components/common/Cards";
import { CardSkeleton } from "../../components/common/LoadingSpinner";

export const EventsPage = () => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("eventDate_asc");
  const [page, setPage] = useState(1);

  const { sortField, sortOrder } = (() => {
    const [field, order] = sortBy.split("_");
    return { sortField: field, sortOrder: order };
  })();

  const { data, isLoading } = useQuery({
    queryKey: ["events", search, sortField, sortOrder, page],
    queryFn: () =>
      axiosInstance.get("/events", {
        params: { search, sortBy: sortField, order: sortOrder, page, limit: 9 },
      }).then((r) => r.data),
    keepPreviousData: true,
  });

  return (
    <div className="min-h-screen bg-dark-900 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="badge-gold mb-4 inline-flex">Upcoming Events</span>
          <h1 className="text-5xl font-display font-bold text-white mb-4">
            Discover <span className="text-gradient-gold">Events</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">Find and join events hosted by clubs in your community.</p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events..."
              className="input-field pl-12 w-full"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field w-full sm:w-52"
          >
            <option value="eventDate_asc">Soonest First</option>
            <option value="eventDate_desc">Latest First</option>
            <option value="createdAt_desc">Newest Added</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array(9).fill(0).map((_, i) => <CardSkeleton key={i} />)
            : data?.events?.length === 0
            ? (
              <div className="col-span-3 text-center py-20">
                <p className="text-gray-400 text-lg font-semibold">No upcoming events found</p>
              </div>
            )
            : data?.events?.map((event, i) => <EventCard key={event._id} event={event} index={i} />)
          }
        </div>

        {data?.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-5 py-2.5 rounded-xl border border-primary-900/40 text-gray-400 hover:text-white disabled:opacity-40 transition-all text-sm">
              Previous
            </button>
            {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${p === page ? "bg-primary-600 text-white" : "border border-primary-900/40 text-gray-400 hover:text-white"}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(data.totalPages, p + 1))} disabled={page === data?.totalPages}
              className="px-5 py-2.5 rounded-xl border border-primary-900/40 text-gray-400 hover:text-white disabled:opacity-40 transition-all text-sm">
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
