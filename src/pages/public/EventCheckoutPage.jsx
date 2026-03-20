import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, CheckCircle } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import toast from "react-hot-toast";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const EventCheckoutForm = ({ event, clientSecret, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError("");

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        { payment_method: { card: elements.getElement(CardElement) } }
      );

      if (stripeError) {
        setError(stripeError.message);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        await axiosInstance.post("/memberships/event/register", {
          eventId: event._id,
          paymentId: paymentIntent.id,
        });
        toast.success("Payment successful! You're registered! 🎉");
        onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Payment failed");
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-primary-900/20 border border-primary-700/30 rounded-xl p-4">
        <p className="text-primary-300 text-xs font-semibold mb-2">
          🧪 Test Mode — Use this card:
        </p>
        <p className="text-gray-300 text-sm font-mono">4242 4242 4242 4242</p>
        <p className="text-gray-500 text-xs mt-1">
          Any future expiry • Any CVC • Any ZIP
        </p>
      </div>

      <div>
        <label className="input-label">Card Details</label>
        <div className="input-field py-4">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "15px",
                  color: "#f0eaff",
                  fontFamily: "'DM Sans', sans-serif",
                  "::placeholder": { color: "#6b7280" },
                },
                invalid: { color: "#ef4444" },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-sm bg-red-900/20 border border-red-800/40 rounded-xl px-4 py-3">
          ⚠️ {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="btn-gold w-full py-4 text-base flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 rounded-full border-2 border-dark-900/30 border-t-dark-900 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Shield className="w-5 h-5" />
            Pay ${event.eventFee} & Register
          </>
        )}
      </button>

      <p className="text-center text-gray-600 text-xs flex items-center justify-center gap-1.5">
        <Shield className="w-3 h-3" />
        Secured by Stripe
      </p>
    </form>
  );
};

const EventCheckoutPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [clientSecret, setClientSecret] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: () => axiosInstance.get(`/events/${id}`).then((r) => r.data.event),
  });

  useEffect(() => {
    if (!event || !event.isPaid) return;
    axiosInstance
      .post("/payments/create-event-intent", { eventId: id })
      .then((r) => setClientSecret(r.data.clientSecret))
      .catch((err) => toast.error(err.response?.data?.message || "Failed to initialize payment"));
  }, [event, id]);

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (!event) return null;

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-hero-gradient flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 15 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 rounded-full bg-green-900/40 border-2 border-green-500/50 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <h1 className="text-4xl font-display font-bold text-white mb-4">
            You're Registered! 🎉
          </h1>
          <p className="text-gray-400 mb-8">
            You have successfully registered for{" "}
            <span className="text-primary-300 font-semibold">{event.title}</span>.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/dashboard/member/events" className="btn-primary">
              View My Events
            </Link>
            <Link to="/events" className="btn-outline">
              Browse More Events
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to={`/events/${id}`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Event
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left — Event Info */}
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">
              Register for{" "}
              <span className="text-gradient-purple">{event.title}</span>
            </h1>
            <p className="text-gray-400 mb-8">
              Complete payment to confirm your registration.
            </p>

            <div className="card-glass p-5">
              <h3 className="text-white font-semibold mb-3">Event Details:</h3>
              <ul className="space-y-2">
                {[
                  `📅 ${new Date(event.eventDate).toLocaleDateString("en", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`,
                  `📍 ${event.location}`,
                  `💰 Entry Fee: $${event.eventFee}`,
                  `👥 Max Attendees: ${event.maxAttendees || "Unlimited"}`,
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-gray-400 text-sm">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right — Payment */}
          <div>
            <div className="card-glass p-8 rounded-3xl">
              <h2 className="text-white font-display font-bold text-lg mb-1">
                Complete Payment
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Event registration · ${event.eventFee}
              </p>

              {clientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <EventCheckoutForm
                    event={event}
                    clientSecret={clientSecret}
                    onSuccess={() => setPaymentSuccess(true)}
                  />
                </Elements>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 rounded-full border-2 border-primary-900 border-t-primary-500 animate-spin" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCheckoutPage;