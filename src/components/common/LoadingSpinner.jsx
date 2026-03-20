import { motion } from "framer-motion";
import { Star } from "lucide-react";

// ── Full-screen or inline loading spinner ─────────────────────────────────────
export const LoadingSpinner = ({ fullScreen = false, size = "md" }) => {
  const sizes = { sm: "w-6 h-6", md: "w-10 h-10", lg: "w-16 h-16" };

  const spinner = (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={`${sizes[size]} rounded-full border-2 border-primary-900 border-t-primary-500`}
      />
      {fullScreen && (
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-gold-400" fill="currentColor" />
          <span className="text-gray-400 text-sm font-medium">Loading ClubSphere...</span>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-12">{spinner}</div>;
};

// ── Club / Event Card Skeleton ────────────────────────────────────────────────
export const CardSkeleton = () => (
  <div className="card p-0 overflow-hidden">
    <div className="skeleton h-48 w-full rounded-none" />
    <div className="p-5 space-y-3">
      <div className="skeleton h-4 w-3/4 rounded-lg" />
      <div className="skeleton h-3 w-full rounded-lg" />
      <div className="skeleton h-3 w-5/6 rounded-lg" />
      <div className="flex gap-2 mt-4">
        <div className="skeleton h-6 w-20 rounded-full" />
        <div className="skeleton h-6 w-16 rounded-full" />
      </div>
      <div className="skeleton h-10 w-full rounded-xl mt-2" />
    </div>
  </div>
);

// ── Table Row Skeleton ────────────────────────────────────────────────────────
export const TableRowSkeleton = ({ cols = 4 }) => (
  <>
    {Array(5).fill(0).map((_, i) => (
      <tr key={i} className="border-t border-dark-600">
        {Array(cols).fill(0).map((_, j) => (
          <td key={j} className="px-6 py-4">
            <div className="skeleton h-4 rounded-lg w-full" />
          </td>
        ))}
      </tr>
    ))}
  </>
);

// ── Stat Card Skeleton ────────────────────────────────────────────────────────
export const StatCardSkeleton = () => (
  <div className="stat-card">
    <div className="skeleton w-12 h-12 rounded-xl flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="skeleton h-3 w-24 rounded" />
      <div className="skeleton h-7 w-16 rounded" />
    </div>
  </div>
);

export default LoadingSpinner;
