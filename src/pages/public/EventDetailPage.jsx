import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  MapPin,
  Calendar,
  Users,
  ArrowLeft,
  CheckCircle,
  Clock,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import toast from "react-hot-toast";

const EventDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: () => axiosInstance.get(`/events/${id}`).then((r) => r.data.event),
  });

  const { data: myRegistrations } = useQuery({
    queryKey: ["my-event-registrations"],
    queryFn: () =>
      axiosInstance
        .get("/memberships/my-events")
        .then((r) => r.data.registrations),
    enabled: !!user,
  });

  const isRegistered = myRegistrations?.some((r) => r.eventId === id);

  const registerMutation = useMutation({
    mutationFn: () =>
      axiosInstance.post("/memberships/event/register", { eventId: id }),
    onSuccess: () => {
      toast.success("Successfully registered!");
      queryClient.invalidateQueries(["my-event-registrations"]);
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Registration failed"),
  });

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (!event)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Event not found
      </div>
    );

  const eventDate = new Date(event.eventDate);

  return (
    <div className="min-h-screen bg-dark-900 pt-20">
      <div className="relative h-64 md:h-80">
        <img
          src={event.bannerImage || event.clubBanner}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="flex gap-2 mb-4">
              {event.isPaid ? (
                <span className="badge-gold">${event.eventFee}</span>
              ) : (
                <span className="badge-green">Free</span>
              )}
            </div>
            <h1 className="text-4xl font-display font-bold text-white mb-2">
              {event.title}
            </h1>
            <p className="text-primary-400 mb-6">{event.club?.clubName}</p>
            <p className="text-gray-400 leading-relaxed">{event.description}</p>

            <div className="grid grid-cols-2 gap-4 mt-8">
              {[
                {
                  icon: Calendar,
                  label: "Date",
                  value: eventDate.toLocaleDateString("en", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }),
                },
                {
                  icon: Clock,
                  label: "Time",
                  value: eventDate.toLocaleTimeString("en", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                },
                { icon: MapPin, label: "Location", value: event.location },
                {
                  icon: Users,
                  label: "Registered",
                  value: `${event.registrationCount}${event.maxAttendees ? ` / ${event.maxAttendees}` : ""}`,
                },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="card-glass p-4 flex items-center gap-3"
                >
                  <Icon className="w-5 h-5 text-primary-400 flex-shrink-0" />
                  <div>
                    <p className="text-gray-500 text-xs">{label}</p>
                    <p className="text-white text-sm font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-72">
            <div className="card-glass p-6 sticky top-24">
              <h3 className="text-white font-semibold font-display text-lg mb-4">
                Register for Event
              </h3>
              {isRegistered ? (
                <div className="flex items-center gap-2 text-green-400 font-semibold">
                  <CheckCircle className="w-5 h-5" /> You're registered!
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (!user) return navigate("/login");
                    if (event.isPaid) {
                      navigate(`/events/${id}/checkout`);
                    } else {
                      registerMutation.mutate();
                    }
                  }}
                  disabled={registerMutation.isPending}
                  className="btn-primary w-full"
                >
                  {registerMutation.isPending
                    ? "Registering..."
                    : event.isPaid
                      ? `Pay $${event.eventFee} & Register`
                      : "Register Free"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
