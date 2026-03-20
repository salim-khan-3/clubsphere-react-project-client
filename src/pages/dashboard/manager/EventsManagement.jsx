import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, X, Calendar, Users } from "lucide-react";
import axiosInstance from "../../../utils/axiosInstance";
import LoadingSpinner, { TableRowSkeleton } from "../../../components/common/LoadingSpinner";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

// ── Event Form Modal ─────────────────────────────────────────────────────────
const EventFormModal = ({ event, clubs, onClose }) => {
  const queryClient = useQueryClient();
  const isEdit = !!event;

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: event
      ? { ...event, eventDate: new Date(event.eventDate).toISOString().slice(0, 16) }
      : { isPaid: false },
  });

  const isPaid = watch("isPaid");

  const mutation = useMutation({
    mutationFn: (data) =>
      isEdit
        ? axiosInstance.put(`/events/${event._id}`, data)
        : axiosInstance.post("/events", data),
    onSuccess: () => {
      toast.success(isEdit ? "Event updated!" : "Event created!");
      queryClient.invalidateQueries(["manager-events"]);
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
            {isEdit ? "Edit Event" : "Create Event"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-dark-600 text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
          {!isEdit && (
            <div>
              <label className="input-label">Club</label>
              <select {...register("clubId", { required: "Select a club" })} className="input-field">
                <option value="">Select club...</option>
                {clubs?.filter((c) => c.status === "approved").map((c) => (
                  <option key={c._id} value={c._id}>{c.clubName}</option>
                ))}
              </select>
              {errors.clubId && <p className="input-error">{errors.clubId.message}</p>}
            </div>
          )}

          <div>
            <label className="input-label">Event Title</label>
            <input {...register("title", { required: "Title is required" })}
              placeholder="e.g. Monthly Photography Walk" className="input-field" />
            {errors.title && <p className="input-error">{errors.title.message}</p>}
          </div>

          <div>
            <label className="input-label">Description</label>
            <textarea {...register("description", { required: "Description is required" })}
              rows={3} className="input-field resize-none" />
            {errors.description && <p className="input-error">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">Date & Time</label>
              <input {...register("eventDate", { required: "Date is required" })}
                type="datetime-local" className="input-field" />
              {errors.eventDate && <p className="input-error">{errors.eventDate.message}</p>}
            </div>
            <div>
              <label className="input-label">Location</label>
              <input {...register("location", { required: "Location is required" })}
                placeholder="e.g. Hatirjheel, Dhaka" className="input-field" />
              {errors.location && <p className="input-error">{errors.location.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">Max Attendees (optional)</label>
              <input {...register("maxAttendees")} type="number" min="1"
                placeholder="Unlimited" className="input-field" />
            </div>
            <div>
              <label className="input-label">Banner Image URL (optional)</label>
              <input {...register("bannerImage")} placeholder="https://..." className="input-field" />
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-dark-600/50 border border-primary-900/30">
            <input {...register("isPaid")} type="checkbox" id="isPaid"
              className="w-4 h-4 accent-primary-500 cursor-pointer" />
            <label htmlFor="isPaid" className="text-gray-300 text-sm cursor-pointer">This is a paid event</label>
          </div>

          {isPaid && (
            <div>
              <label className="input-label">Event Fee (USD)</label>
              <input {...register("eventFee", { required: isPaid ? "Fee required for paid events" : false })}
                type="number" step="0.01" min="0.01" placeholder="10.00" className="input-field" />
              {errors.eventFee && <p className="input-error">{errors.eventFee.message}</p>}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
            <button type="submit" disabled={mutation.isPending} className="btn-primary flex-1">
              {mutation.isPending ? "Saving..." : isEdit ? "Update Event" : "Create Event"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// ── Events Management Page ────────────────────────────────────────────────────
const EventsManagement = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const queryClient = useQueryClient();

  const { data: events, isLoading } = useQuery({
    queryKey: ["manager-events"],
    queryFn: () => axiosInstance.get("/events/manager/my-events").then((r) => r.data.events),
  });

  const { data: clubs } = useQuery({
    queryKey: ["manager-clubs"],
    queryFn: () => axiosInstance.get("/clubs/manager/my-clubs").then((r) => r.data.clubs),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axiosInstance.delete(`/events/${id}`),
    onSuccess: () => {
      toast.success("Event deleted");
      queryClient.invalidateQueries(["manager-events"]);
    },
  });

  const handleDelete = (event) => {
    Swal.fire({
      title: "Delete Event?",
      text: `Delete "${event.title}"? This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#374151",
      background: "#1a1430",
      color: "#f0eaff",
    }).then((r) => { if (r.isConfirmed) deleteMutation.mutate(event._id); });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Events Management</h1>
          <p className="text-gray-500 mt-1">Create and manage events for your clubs</p>
        </div>
        <button onClick={() => { setEditEvent(null); setModalOpen(true); }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Event
        </button>
      </div>

      {isLoading ? <LoadingSpinner /> : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Club</th>
                <th>Date</th>
                <th>Type</th>
                <th>Registrations</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events?.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-500">No events yet. Create your first event!</td></tr>
              ) : events?.map((event) => (
                <tr key={event._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img src={event.bannerImage} alt={event.title}
                        className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                      <span className="text-white font-medium text-sm">{event.title}</span>
                    </div>
                  </td>
                  <td className="text-gray-400 text-sm">{event.clubName}</td>
                  <td className="text-gray-400 text-sm">{new Date(event.eventDate).toLocaleDateString()}</td>
                  <td>
                    {event.isPaid
                      ? <span className="badge-gold text-xs">${event.eventFee}</span>
                      : <span className="badge-green text-xs">Free</span>}
                  </td>
                  <td>
                    <span className="flex items-center gap-1.5 text-gray-400 text-sm">
                      <Users className="w-3.5 h-3.5 text-primary-500" />
                      {event.registrationCount}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditEvent(event); setModalOpen(true); }}
                        className="p-1.5 rounded-lg hover:bg-primary-900/40 text-primary-400 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(event)}
                        className="p-1.5 rounded-lg hover:bg-red-900/30 text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {modalOpen && (
          <EventFormModal
            event={editEvent}
            clubs={clubs}
            onClose={() => { setModalOpen(false); setEditEvent(null); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventsManagement;
