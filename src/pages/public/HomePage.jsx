import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight, Search, Users, Calendar, Shield,
  Zap, Camera, Mountain, BookOpen, Cpu, Music, Dumbbell, Star,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { ClubCard } from "../../components/common/Cards";
import { CardSkeleton } from "../../components/common/LoadingSpinner";

// ── Animation Variants ────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
  }),
};

const steps = [
  { icon: Search, title: "Discover Clubs", desc: "Browse hundreds of local clubs across categories that match your interests and location.", color: "from-primary-700 to-primary-500" },
  { icon: Users, title: "Join & Connect", desc: "Join free clubs instantly or pay membership fee with Stripe. Connect with like-minded people.", color: "from-gold-600 to-gold-400" },
  { icon: Calendar, title: "Attend Events", desc: "Register for exclusive club events, workshops, and meetups curated by club managers.", color: "from-primary-600 to-gold-500" },
  { icon: Shield, title: "Manage & Grow", desc: "Club managers get powerful tools to grow their community, track members, and earn revenue.", color: "from-primary-800 to-primary-600" },
];

const categories = [
  { icon: Camera, label: "Photography", count: 24, color: "text-pink-400 bg-pink-900/20 border-pink-800/30" },
  { icon: Mountain, label: "Hiking", count: 18, color: "text-green-400 bg-green-900/20 border-green-800/30" },
  { icon: BookOpen, label: "Book Clubs", count: 31, color: "text-blue-400 bg-blue-900/20 border-blue-800/30" },
  { icon: Cpu, label: "Technology", count: 42, color: "text-cyan-400 bg-cyan-900/20 border-cyan-800/30" },
  { icon: Music, label: "Music", count: 15, color: "text-yellow-400 bg-yellow-900/20 border-yellow-800/30" },
  { icon: Dumbbell, label: "Sports", count: 27, color: "text-orange-400 bg-orange-900/20 border-orange-800/30" },
];

const stats = [
  { value: "2,400+", label: "Active Members" },
  { value: "180+", label: "Clubs" },
  { value: "500+", label: "Events Hosted" },
  { value: "98%", label: "Satisfaction Rate" },
];

const HomePage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["featured-clubs"],
    queryFn: () => axiosInstance.get("/clubs/featured").then((r) => r.data.clubs),
  });

  return (
    <div className="overflow-hidden">
      {/* ── Hero Section ──────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center bg-hero-gradient pt-20">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary-700/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gold-500/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary-900/20 blur-3xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: "linear-gradient(rgba(155,53,245,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(155,53,245,0.3) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="inline-flex items-center gap-2 bg-primary-900/40 border border-primary-700/40 rounded-full px-5 py-2 mb-8"
          >
            <Star className="w-4 h-4 text-gold-400" fill="currentColor" />
            <span className="text-primary-300 text-sm font-medium">The Ultimate Club Management Platform</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="font-display text-5xl sm:text-6xl lg:text-8xl font-bold text-white leading-none mb-6"
          >
            Find Your
            <br />
            <span className="text-gradient-gold">Perfect</span>{" "}
            <span className="text-gradient-purple">Club</span>
          </motion.h1>

          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Discover local clubs, join communities, and attend amazing events. ClubSphere connects passionate people with the clubs they love.
          </motion.p>

          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/clubs" className="btn-gold px-8 py-4 text-base flex items-center gap-2 group">
              Explore Clubs
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/events" className="btn-outline px-8 py-4 text-base">
              Browse Events
            </Link>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={4}
            className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-3xl lg:text-4xl font-display font-bold text-gradient-gold">{value}</p>
                <p className="text-gray-500 text-sm mt-1">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 w-6 h-10 rounded-full border-2 border-primary-700/50 flex items-start justify-center pt-2"
        >
          <div className="w-1.5 h-2.5 rounded-full bg-primary-500" />
        </motion.div>
      </section>

      {/* ── Featured Clubs ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="badge-purple mb-4 inline-flex">Featured Clubs</span>
            <h2 className="section-title">
              Discover <span className="text-gradient-purple">Amazing</span> Communities
            </h2>
            <p className="section-subtitle mx-auto text-center mt-3">
              Hand-picked clubs with active members and upcoming events just for you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading
              ? Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)
              : data?.map((club, i) => <ClubCard key={club._id} club={club} index={i} />)}
          </div>

          <div className="text-center mt-12">
            <Link to="/clubs" className="btn-outline px-10 py-3.5 inline-flex items-center gap-2 group">
              View All Clubs
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────────────────── */}
      <section className="py-24 bg-dark-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle, rgba(155,53,245,0.5) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge-gold mb-4 inline-flex">Simple Process</span>
            <h2 className="section-title">
              How <span className="text-gradient-gold">ClubSphere</span> Works
            </h2>
            <p className="section-subtitle mx-auto text-center mt-3">
              From discovery to membership in four easy steps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={title}
                variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i}
                className="card-glass p-7 text-center group hover:-translate-y-2"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300 shadow-glow-purple`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="w-7 h-7 rounded-full bg-dark-600 border border-primary-800/50 flex items-center justify-center mx-auto mb-4 text-primary-400 text-xs font-bold">
                  {i + 1}
                </div>
                <h3 className="font-display font-bold text-white text-lg mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ─────────────────────────────────────────────────────── */}
      <section className="py-24 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="badge-purple mb-4 inline-flex">Browse by Category</span>
            <h2 className="section-title">
              Find Clubs by <span className="text-gradient-purple">Interest</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(({ icon: Icon, label, count, color }, i) => (
              <motion.div
                key={label}
                variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }} custom={i}
              >
                <Link
                  to={`/clubs?category=${label}`}
                  className={`flex flex-col items-center gap-3 p-5 rounded-2xl border ${color} hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300 group`}
                >
                  <Icon className="w-8 h-8 group-hover:scale-110 transition-transform duration-200" />
                  <span className="text-white font-semibold text-sm">{label}</span>
                  <span className="text-xs opacity-60">{count} clubs</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ────────────────────────────────────────────────────── */}
      <section className="py-24 bg-dark-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="bg-gradient-to-br from-primary-900/50 to-dark-700 border border-primary-700/30 rounded-3xl p-12 lg:p-16 relative overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary-600/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-gold-500/5 blur-3xl" />
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-gold-500 flex items-center justify-center mx-auto mb-6 shadow-glow-purple">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-white mb-5">
                Ready to Join Your <span className="text-gradient-gold">Community?</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                Create your free account today and start discovering clubs that match your passions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="btn-gold px-10 py-4 text-base">
                  Get Started Free
                </Link>
                <Link to="/clubs" className="btn-outline px-10 py-4 text-base">
                  Explore First
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
