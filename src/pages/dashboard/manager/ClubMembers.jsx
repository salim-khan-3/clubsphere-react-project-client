import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, ArrowLeft, Plus, Trash2, X, Megaphone } from "lucide-react";
import { Link } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";
import LoadingSpinner, { TableRowSkeleton } from "../../../components/common/LoadingSpinner";
import toast from "react-hot-toast";

// ════════════════════════════════════════════════════════
// CLUB MEMBERS
// ════════════════════════════════════════════════════════
export const ClubMembers = () => {
  const { clubId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["club-members", clubId],
    queryFn: () => axiosInstance.get(`/memberships/club/${clubId}/members`).then((r) => r.data.members),
  });

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link to="/dashboard/manager/clubs" className="p-2 rounded-xl hover:bg-dark-700 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Club Members</h1>
          <p className="text-gray-500 mt-1">All members of this club</p>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Email</th>
              <th>Joined</th>
              <th>Status</th>
              <th>Expires</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? <TableRowSkeleton cols={5} /> : (
              data?.length === 0
                ? <tr><td colSpan={5} className="text-center py-12 text-gray-500">No members yet</td></tr>
                : data?.map((m) => (
                  <tr key={m._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <img
                          src={m.user?.photoURL || `https://ui-avatars.com/api/?name=${m.user?.name}&background=6414c4&color=fff`}
                          alt={m.user?.name} className="w-9 h-9 rounded-xl object-cover" />
                        <span className="text-white font-medium">{m.user?.name}</span>
                      </div>
                    </td>
                    <td className="text-gray-400 text-sm">{m.userEmail}</td>
                    <td className="text-gray-400 text-sm">{new Date(m.joinedAt).toLocaleDateString()}</td>
                    <td>
                      <span className={m.status === "active" ? "badge-green text-xs" : "badge-yellow text-xs"}>
                        {m.status}
                      </span>
                    </td>
                    <td className="text-gray-500 text-sm">
                      {m.expiresAt ? new Date(m.expiresAt).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════
// EVENT REGISTRATIONS
// ════════════════════════════════════════════════════════
export const EventRegistrations = () => {
  const { eventId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["event-registrations", eventId],
    queryFn: () => axiosInstance.get(`/events/${eventId}/registrations`).then((r) => r.data.registrations),
  });

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link to="/dashboard/manager/events" className="p-2 rounded-xl hover:bg-dark-700 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Event Registrations</h1>
          <p className="text-gray-500 mt-1">{data?.length || 0} registrations</p>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Registered At</th>
              <th>Status</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? <TableRowSkeleton cols={4} /> : (
              data?.length === 0
                ? <tr><td colSpan={4} className="text-center py-12 text-gray-500">No registrations yet</td></tr>
                : data?.map((r) => (
                  <tr key={r._id}>
                    <td className="text-gray-300">{r.userEmail}</td>
                    <td className="text-gray-400 text-sm">{new Date(r.registeredAt).toLocaleDateString()}</td>
                    <td>
                      <span className={r.status === "registered" ? "badge-green text-xs" : "badge-red text-xs"}>
                        {r.status}
                      </span>
                    </td>
                    <td className="text-gray-500 text-xs font-mono">{r.paymentId ? r.paymentId.slice(0, 16) + "..." : "Free"}</td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════
// MANAGE ANNOUNCEMENTS
// ════════════════════════════════════════════════════════
export const ManageAnnouncements = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: clubs } = useQuery({
    queryKey: ["manager-clubs"],
    queryFn: () => axiosInstance.get("/clubs/manager/my-clubs").then((r) => r.data.clubs),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const createMutation = useMutation({
    mutationFn: (data) => axiosInstance.post("/announcements", data),
    onSuccess: () => {
      toast.success("Announcement posted!");
      queryClient.invalidateQueries(["manager-announcements"]);
      reset();
      setModalOpen(false);
    },
    onError: () => toast.error("Failed to post announcement"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axiosInstance.delete(`/announcements/${id}`),
    onSuccess: () => {
      toast.success("Deleted");
      queryClient.invalidateQueries(["manager-announcements"]);
    },
  });

  const approvedClubs = clubs?.filter((c) => c.status === "approved") || [];

  const { data: allAnnouncements, isLoading } = useQuery({
    queryKey: ["manager-announcements"],
    queryFn: async () => {
      if (!approvedClubs.length) return [];
      const results = await Promise.all(
        approvedClubs.map((c) => axiosInstance.get(`/announcements/club/${c._id}`).then((r) => r.data.announcements))
      );
      return results.flat().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    enabled: !!approvedClubs.length,
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Announcements</h1>
          <p className="text-gray-500 mt-1">Post updates to your club members</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      {isLoading ? <LoadingSpinner /> : (
        <div className="space-y-4 max-w-3xl">
          {allAnnouncements?.length === 0 ? (
            <div className="text-center py-16 card-glass rounded-3xl">
              <Megaphone className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-400">No announcements yet</p>
            </div>
          ) : allAnnouncements?.map((a) => (
            <motion.div key={a._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-glass p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-primary-400 text-xs mb-1">{a.clubName}</p>
                  <h3 className="text-white font-semibold">{a.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 text-xs">{new Date(a.createdAt).toLocaleDateString()}</span>
                  <button onClick={() => deleteMutation.mutate(a._id)}
                    className="p-1.5 rounded-lg hover:bg-red-900/30 text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{a.content}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="bg-dark-700 border border-primary-900/40 rounded-3xl p-8 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-white">Post Announcement</h2>
                <button onClick={() => setModalOpen(false)} className="p-2 rounded-xl hover:bg-dark-600 text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
                <div>
                  <label className="input-label">Club</label>
                  <select {...register("clubId", { required: true })} className="input-field">
                    <option value="">Select club...</option>
                    {approvedClubs.map((c) => <option key={c._id} value={c._id}>{c.clubName}</option>)}
                  </select>
                </div>
                <div>
                  <label className="input-label">Title</label>
                  <input {...register("title", { required: true })} placeholder="Announcement title" className="input-field" />
                </div>
                <div>
                  <label className="input-label">Content</label>
                  <textarea {...register("content", { required: true })} rows={4}
                    placeholder="Write your announcement..." className="input-field resize-none" />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setModalOpen(false)} className="btn-outline flex-1">Cancel</button>
                  <button type="submit" disabled={createMutation.isPending} className="btn-primary flex-1">
                    {createMutation.isPending ? "Posting..." : "Post"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClubMembers;

