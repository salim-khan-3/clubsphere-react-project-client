import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, MapPin, Tag, Star, Bookmark, BookmarkCheck, DollarSign } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../utils/axiosInstance";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

// ── Club Card ─────────────────────────────────────────────────────────────────
export const ClubCard = ({ club, bookmarked = false, index = 0 }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const bookmarkMutation = useMutation({
    mutationFn: () => axiosInstance.post("/bookmarks/toggle", { clubId: club._id }),
    onSuccess: () => {
      queryClient.invalidateQueries(["bookmarks"]);
      queryClient.invalidateQueries(["clubs"]);
    },
    onError: () => toast.error("Failed to update bookmark"),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="card group"
    >
      {/* Banner */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={club.bannerImage || "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80"}
          alt={club.clubName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent" />

        {/* Bookmark Button */}
        {user && (
          <button
            onClick={(e) => { e.preventDefault(); bookmarkMutation.mutate(); }}
            className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-dark-800/80 backdrop-blur-sm border border-primary-900/40 flex items-center justify-center hover:bg-primary-900/60 hover:border-primary-700/50 transition-all duration-200"
          >
            {bookmarked
              ? <BookmarkCheck className="w-4 h-4 text-primary-400" />
              : <Bookmark className="w-4 h-4 text-gray-400" />}
          </button>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="badge-purple text-xs">{club.category}</span>
        </div>

        {/* Fee Badge */}
        <div className="absolute bottom-3 right-3">
          {club.membershipFee > 0
            ? <span className="badge-gold text-xs">${club.membershipFee}/yr</span>
            : <span className="badge-green text-xs">Free</span>}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display font-bold text-white text-lg leading-snug mb-2 group-hover:text-primary-300 transition-colors line-clamp-1">
          {club.clubName}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">
          {club.description}
        </p>

        <div className="flex items-center gap-4 text-xs text-gray-500 mb-5">
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-primary-500" />
            {club.memberCount || 0} members
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gold-500" />
            {club.location}
          </span>
        </div>

        <Link to={`/clubs/${club._id}`} className="btn-primary w-full text-center block text-sm py-2.5">
          View Club
        </Link>
      </div>
    </motion.div>
  );
};

// ── Event Card ────────────────────────────────────────────────────────────────
export const EventCard = ({ event, index = 0 }) => {
  const eventDate = new Date(event.eventDate);
  const isUpcoming = eventDate > new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="card group"
    >
      {/* Banner */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={event.bannerImage || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80"}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          {event.isPaid
            ? <span className="badge-gold text-xs">${event.eventFee}</span>
            : <span className="badge-green text-xs">Free</span>}
          {isUpcoming && <span className="badge-purple text-xs">Upcoming</span>}
        </div>

        {/* Date Box */}
        <div className="absolute bottom-3 left-3 bg-dark-800/90 backdrop-blur-sm rounded-xl px-3 py-2 text-center border border-primary-900/40">
          <p className="text-gold-400 text-xs font-bold uppercase tracking-wider">
            {eventDate.toLocaleDateString("en", { month: "short" })}
          </p>
          <p className="text-white text-xl font-display font-bold leading-none">
            {eventDate.getDate()}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-primary-400 text-xs font-medium mb-1">{event.clubName}</p>
        <h3 className="font-display font-bold text-white text-lg leading-snug mb-2 line-clamp-1 group-hover:text-primary-300 transition-colors">
          {event.title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4">{event.description}</p>

        <div className="flex items-center gap-4 text-xs text-gray-500 mb-5">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gold-500" />
            {event.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-primary-500" />
            {event.registrationCount || 0} registered
          </span>
        </div>

        <Link to={`/events/${event._id}`} className="btn-outline w-full text-center block text-sm py-2.5">
          View Details
        </Link>
      </div>
    </motion.div>
  );
};

export default ClubCard;
