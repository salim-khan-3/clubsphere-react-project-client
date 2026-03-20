import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { ClubCard } from "../../components/common/Cards";
import { CardSkeleton } from "../../components/common/LoadingSpinner";

const CATEGORIES = ["Photography", "Sports", "Technology", "Book Clubs", "Hiking", "Music", "Art", "Gaming", "Food", "Travel"];
const SORT_OPTIONS = [
  { value: "createdAt_desc", label: "Newest First" },
  { value: "createdAt_asc", label: "Oldest First" },
  { value: "membershipFee_asc", label: "Lowest Fee" },
  { value: "membershipFee_desc", label: "Highest Fee" },
  { value: "clubName_asc", label: "A → Z" },
];

const ClubsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [sortBy, setSortBy] = useState("createdAt_desc");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { sortField, sortOrder } = (() => {
    const [field, order] = sortBy.split("_");
    return { sortField: field, sortOrder: order };
  })();

  const { data, isLoading } = useQuery({
    queryKey: ["clubs", search, category, sortField, sortOrder, page],
    queryFn: () =>
      axiosInstance.get("/clubs", {
        params: { search, category, sortBy: sortField, order: sortOrder, page, limit: 9 },
      }).then((r) => r.data),
    keepPreviousData: true,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const clearFilters = () => {
    setSearch(""); setCategory(""); setSortBy("createdAt_desc"); setPage(1);
  };

  const hasFilters = search || category || sortBy !== "createdAt_desc";

  return (
    <div className="min-h-screen bg-dark-900 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="badge-purple mb-4 inline-flex">All Clubs</span>
          <h1 className="text-5xl font-display font-bold text-white mb-4">
            Discover <span className="text-gradient-purple">Clubs</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Find your community. Browse clubs by category, location, or membership type.
          </p>
        </motion.div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clubs by name..."
              className="input-field pl-12 pr-4 w-full"
            />
          </form>

          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="input-field w-full sm:w-48"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
            className="input-field w-full sm:w-48"
          >
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-2 px-4 py-3 rounded-xl border border-red-800/40 text-red-400 hover:bg-red-900/20 transition-colors whitespace-nowrap">
              <X className="w-4 h-4" /> Clear
            </button>
          )}
        </div>

        {/* Results Info */}
        {!isLoading && (
          <p className="text-gray-500 text-sm mb-6">
            Showing <span className="text-primary-400 font-medium">{data?.clubs?.length || 0}</span> of{" "}
            <span className="text-primary-400 font-medium">{data?.total || 0}</span> clubs
            {category && <> in <span className="text-gold-400">{category}</span></>}
          </p>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array(9).fill(0).map((_, i) => <CardSkeleton key={i} />)
            : data?.clubs?.length === 0
            ? (
              <div className="col-span-3 text-center py-20">
                <div className="w-20 h-20 rounded-2xl bg-dark-700 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-gray-600" />
                </div>
                <p className="text-gray-400 text-lg font-semibold">No clubs found</p>
                <p className="text-gray-600 text-sm mt-1">Try different search terms or clear filters</p>
                <button onClick={clearFilters} className="btn-outline mt-5 text-sm">Clear Filters</button>
              </div>
            )
            : data?.clubs?.map((club, i) => <ClubCard key={club._id} club={club} index={i} />)
          }
        </div>

        {/* Pagination */}
        {data?.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-5 py-2.5 rounded-xl border border-primary-900/40 text-gray-400 hover:text-white hover:border-primary-700/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
            >
              Previous
            </button>
            {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                  p === page ? "bg-primary-600 text-white shadow-glow-purple" : "border border-primary-900/40 text-gray-400 hover:text-white hover:border-primary-700/50"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
              disabled={page === data?.totalPages}
              className="px-5 py-2.5 rounded-xl border border-primary-900/40 text-gray-400 hover:text-white hover:border-primary-700/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubsPage;
