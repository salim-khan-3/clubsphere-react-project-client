import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Users, MapPin, Star, Calendar, ArrowLeft, CheckCircle,
  DollarSign, MessageSquare, Tag, Clock,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import toast from "react-hot-toast";

const ClubDetailPage = () => {
  const { id } = useParams();
  const { user, dbUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("about");

  const { data: clubData, isLoading } = useQuery({
    queryKey: ["club", id],
    queryFn: () => axiosInstance.get(`/clubs/${id}`).then((r) => r.data.club),
  });

  const { data: reviewsData } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => axiosInstance.get(`/reviews/${id}`).then((r) => r.data.reviews),
  });

  const { data: announcementsData } = useQuery({
    queryKey: ["announcements", id],
    queryFn: () => axiosInstance.get(`/announcements/club/${id}`).then((r) => r.data.announcements),
  });

  const { data: membershipData } = useQuery({
    queryKey: ["membership-check", id],
    queryFn: () => axiosInstance.get("/memberships/my-memberships").then((r) => {
      return r.data.memberships?.find((m) => m.clubId === id && m.status === "active");
    }),
    enabled: !!user,
  });

  const joinFreeMutation = useMutation({
    mutationFn: () => axiosInstance.post("/memberships/join-free", { clubId: id }),
    onSuccess: () => {
      toast.success("Successfully joined the club!");
      queryClient.invalidateQueries(["membership-check", id]);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to join"),
  });

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (!clubData) return <div className="min-h-screen flex items-center justify-center text-gray-400">Club not found</div>;

  const isMember = !!membershipData;

  const handleJoin = () => {
    if (!user) return navigate("/login");
    if (clubData.membershipFee > 0) {
      navigate(`/clubs/${id}/checkout`);
    } else {
      joinFreeMutation.mutate();
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 pt-20">
      {/* Banner */}
      <div className="relative h-72 md:h-96">
        <img src={clubData.bannerImage} alt={clubData.clubName} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Link to="/clubs" className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to Clubs
                </Link>
              </div>
              <span className="badge-purple mb-3 inline-flex">{clubData.category}</span>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white">{clubData.clubName}</h1>
            </div>
            <div className="flex items-center gap-3">
              {isMember ? (
                <span className="flex items-center gap-2 bg-green-900/40 border border-green-700/40 text-green-400 px-5 py-3 rounded-xl font-semibold">
                  <CheckCircle className="w-5 h-5" /> Member
                </span>
              ) : (
                <button onClick={handleJoin} className="btn-gold px-8 py-3 text-base">
                  {clubData.membershipFee > 0 ? `Join – $${clubData.membershipFee}/yr` : "Join Free"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Users, label: "Members", value: clubData.memberCount },
            { icon: Calendar, label: "Events", value: clubData.eventCount },
            { icon: Star, label: "Rating", value: `${clubData.avgRating} / 5` },
            { icon: MapPin, label: "Location", value: clubData.location },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="card-glass p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-900/60 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <p className="text-gray-500 text-xs">{label}</p>
                <p className="text-white font-bold">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-primary-900/30">
          {["about", "announcements", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-4 text-sm font-semibold capitalize transition-all duration-200 border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-primary-500 text-primary-300"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "about" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl">
            <h2 className="text-2xl font-display font-bold text-white mb-4">About this Club</h2>
            <p className="text-gray-400 leading-relaxed">{clubData.description}</p>
          </motion.div>
        )}

        {activeTab === "announcements" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 max-w-3xl">
            {announcementsData?.length === 0 ? (
              <p className="text-gray-500">No announcements yet.</p>
            ) : announcementsData?.map((a) => (
              <div key={a._id} className="card-glass p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-white font-semibold">{a.title}</h3>
                  <span className="text-gray-600 text-xs">{new Date(a.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-400 text-sm">{a.content}</p>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === "reviews" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 max-w-3xl">
            {reviewsData?.length === 0 ? (
              <p className="text-gray-500">No reviews yet. Be the first!</p>
            ) : reviewsData?.map((r) => (
              <div key={r._id} className="card-glass p-6">
                <div className="flex items-center gap-3 mb-3">
                  <img src={r.userPhoto || `https://ui-avatars.com/api/?name=${r.userName}&background=6414c4&color=fff`}
                    alt={r.userName} className="w-9 h-9 rounded-xl object-cover" />
                  <div>
                    <p className="text-white font-semibold text-sm">{r.userName}</p>
                    <div className="flex gap-0.5 mt-0.5">
                      {Array(5).fill(0).map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < r.rating ? "text-gold-400 fill-gold-400" : "text-gray-700"}`} />
                      ))}
                    </div>
                  </div>
                  <span className="ml-auto text-gray-600 text-xs">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-400 text-sm">{r.comment}</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ClubDetailPage;
