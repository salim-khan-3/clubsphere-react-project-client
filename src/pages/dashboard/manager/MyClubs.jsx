import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Users, X, Building2, CheckCircle, Clock, XCircle } from "lucide-react";
import axiosInstance from "../../../utils/axiosInstance";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import toast from "react-hot-toast";

const CATEGORIES = ["Photography", "Sports", "Technology", "Book Clubs", "Hiking", "Music", "Art", "Gaming", "Food", "Travel"];

const ClubFormModal = ({ club, onClose }) => {
  const queryClient = useQueryClient();
  const isEdit = !!club;

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: club || {},
  });

  const mutation = useMutation({
    mutationFn: (data) =>
      isEdit
        ? axiosInstance.put(`/clubs/${club._id}`, data)
        : axiosInstance.post("/clubs", data),
    onSuccess: () => {
      toast.success(isEdit ? "Club updated!" : "Club created! Awaiting approval.");
      queryClient.invalidateQueries(["manager-clubs"]);
      onClose();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed"),
  });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-dark-700 border border-primary-900/40 rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold text-white">
            {isEdit ? "Edit Club" : "Create New Club"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-dark-600 text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
          <div>
            <label className="input-label">Club Name</label>
            <input {...register("clubName", { required: "Club name is required" })}
              placeholder="e.g. Dhaka Photography Club" className="input-field" />
            {errors.clubName && <p className="input-error">{errors.clubName.message}</p>}
          </div>

          <div>
            <label className="input-label">Description</label>
            <textarea {...register("description", { required: "Description is required" })}
              rows={3} placeholder="Tell people what your club is about..."
              className="input-field resize-none" />
            {errors.description && <p className="input-error">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">Category</label>
              <select {...register("category", { required: "Category is required" })} className="input-field">
                <option value="">Select...</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="input-error">{errors.category.message}</p>}
            </div>
            <div>
              <label className="input-label">Location</label>
              <input {...register("location", { required: "Location is required" })}
                placeholder="e.g. Dhaka" className="input-field" />
              {errors.location && <p className="input-error">{errors.location.message}</p>}
            </div>
          </div>

          <div>
            <label className="input-label">Banner Image URL</label>
            <input {...register("bannerImage")}
              placeholder="https://..." className="input-field" />
          </div>

          <div>
            <label className="input-label">Membership Fee (USD, 0 for free)</label>
            <input {...register("membershipFee", { min: { value: 0, message: "Min 0" } })}
              type="number" step="0.01" min="0" placeholder="0.00" className="input-field" />
            {errors.membershipFee && <p className="input-error">{errors.membershipFee.message}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
            <button type="submit" disabled={mutation.isPending} className="btn-primary flex-1">
              {mutation.isPending ? "Saving..." : isEdit ? "Update Club" : "Create Club"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const MyClubs = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editClub, setEditClub] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["manager-clubs"],
    queryFn: () => axiosInstance.get("/clubs/manager/my-clubs").then((r) => r.data.clubs),
  });

  const statusIcon = { approved: CheckCircle, pending: Clock, rejected: XCircle };
  const statusClass = { approved: "text-green-400", pending: "text-yellow-400", rejected: "text-red-400" };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">My Clubs</h1>
          <p className="text-gray-500 mt-1">Create and manage your clubs</p>
        </div>
        <button onClick={() => { setEditClub(null); setModalOpen(true); }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Club
        </button>
      </div>

      {data?.length === 0 ? (
        <div className="text-center py-20 card-glass rounded-3xl">
          <Building2 className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-400 text-lg font-semibold">No clubs yet</p>
          <p className="text-gray-600 text-sm mt-1 mb-6">Create your first club and grow your community</p>
          <button onClick={() => setModalOpen(true)} className="btn-primary">Create Club</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {data?.map((club, i) => {
            const Icon = statusIcon[club.status] || Clock;
            return (
              <motion.div
                key={club._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="card"
              >
                <div className="relative h-40 overflow-hidden">
                  <img src={club.bannerImage} alt={club.clubName} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="badge-purple text-xs">{club.category}</span>
                  </div>
                  <div className={`absolute top-3 right-3 flex items-center gap-1.5 text-xs font-medium ${statusClass[club.status]}`}>
                    <Icon className="w-3.5 h-3.5" />
                    {club.status}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-white font-display font-bold text-lg mb-1">{club.clubName}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">{club.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-primary-500" />
                      {club.membershipFee > 0 ? `$${club.membershipFee}/yr` : "Free"}
                    </span>
                    <button
                      onClick={() => { setEditClub(club); setModalOpen(true); }}
                      className="flex items-center gap-1.5 text-xs text-primary-400 hover:text-primary-300 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {modalOpen && (
          <ClubFormModal
            club={editClub}
            onClose={() => { setModalOpen(false); setEditClub(null); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyClubs;
