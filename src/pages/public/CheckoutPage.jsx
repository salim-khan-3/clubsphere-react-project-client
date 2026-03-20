import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Star, CheckCircle } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import toast from "react-hot-toast";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// ── Payment Form ──────────────────────────────────────────────────────────────
const CheckoutForm = ({ club, clientSecret, onSuccess }) => {
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
        await axiosInstance.post("/payments/confirm-membership", {
          clubId: club._id,
          paymentIntentId: paymentIntent.id,
        });
        toast.success("Payment successful! Welcome to the club! 🎉");
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
      {/* Test Card Info */}
      <div className="bg-primary-900/20 border border-primary-700/30 rounded-xl p-4">
        <p className="text-primary-300 text-xs font-semibold mb-2">
          🧪 Test Mode — Use this card:
        </p>
        <p className="text-gray-300 text-sm font-mono">4242 4242 4242 4242</p>
        <p className="text-gray-500 text-xs mt-1">
          Any future expiry • Any CVC • Any ZIP
        </p>
      </div>

      {/* Card Input */}
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
            Pay ${club.membershipFee} & Join Club
          </>
        )}
      </button>

      <p className="text-center text-gray-600 text-xs flex items-center justify-center gap-1.5">
        <Shield className="w-3 h-3" />
        Secured by Stripe — your card info is never stored
      </p>
    </form>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const CheckoutPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [clientSecret, setClientSecret] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const { data: club, isLoading } = useQuery({
    queryKey: ["club", id],
    queryFn: () => axiosInstance.get(`/clubs/${id}`).then((r) => r.data.club),
  });

  useEffect(() => {
    if (!club || club.membershipFee <= 0) return;
    axiosInstance
      .post("/payments/create-membership-intent", { clubId: id })
      .then((r) => setClientSecret(r.data.clientSecret))
      .catch(() => toast.error("Failed to initialize payment"));
  }, [club, id]);

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (!club) return null;

  // Payment Success Screen
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
            Welcome to the Club! 🎉
          </h1>
          <p className="text-gray-400 mb-8">
            You are now a member of{" "}
            <span className="text-primary-300 font-semibold">{club.clubName}</span>.
            Your membership is active for 1 year.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/dashboard/member/memberships" className="btn-primary">
              View My Memberships
            </Link>
            <Link to="/clubs" className="btn-outline">
              Browse More Clubs
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to={`/clubs/${id}`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Club
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left — Club Info */}
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">
              Join <span className="text-gradient-purple">{club.clubName}</span>
            </h1>
            <p className="text-gray-400 mb-8">
              Complete your membership payment to get full access.
            </p>

            <div className="card overflow-hidden mb-6">
              <div className="h-48 overflow-hidden">
                <img src={club.bannerImage} alt={club.clubName} className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="badge-purple">{club.category}</span>
                  <span className="text-gold-400 font-bold text-lg">${club.membershipFee}/yr</span>
                </div>
                <p className="text-gray-400 text-sm line-clamp-2">{club.description}</p>
              </div>
            </div>

            <div className="card-glass p-5">
              <h3 className="text-white font-semibold mb-3">What you get:</h3>
              <ul className="space-y-2">
                {[
                  "Access to all club events",
                  "Member-only announcements",
                  "Connect with other members",
                  "1 year membership validity",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-gray-400 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right — Payment */}
          <div>
            <div className="card-glass p-8 rounded-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-gold-500 flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" fill="white" />
                </div>
                <div>
                  <h2 className="text-white font-display font-bold text-lg">Complete Payment</h2>
                  <p className="text-gray-500 text-sm">Annual membership · ${club.membershipFee}</p>
                </div>
              </div>

              {clientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm
                    club={club}
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

export default CheckoutPage;