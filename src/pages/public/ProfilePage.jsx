import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import { User, Mail, Shield, Camera, Save } from "lucide-react";
import { updateProfile } from "firebase/auth";
import { auth } from "../../utils/firebase";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { user, dbUser, fetchDBUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");

  const roleLabel = dbUser?.role === "admin"
    ? "Administrator"
    : dbUser?.role === "clubManager"
    ? "Club Manager"
    : "Member";

  const roleBadgeClass = dbUser?.role === "admin"
    ? "bg-gold-500/20 text-gold-400 border border-gold-500/30"
    : dbUser?.role === "clubManager"
    ? "bg-primary-900/60 text-primary-300 border border-primary-700/40"
    : "bg-green-900/40 text-green-400 border border-green-700/40";

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photoURL,
      });
      await fetchDBUser();
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-display font-bold text-white">My Profile</h1>
            <p className="text-gray-500 mt-2">Manage your account information</p>
          </div>

          {/* Profile Card */}
          <div className="card-glass p-8 rounded-3xl mb-6">
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-primary-900/30">
              <div className="relative">
                <img
                  src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}&background=6414c4&color=fff&size=128`}
                  alt={user?.displayName}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-primary-700/50"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center">
                  <Camera className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-white">
                  {user?.displayName}
                </h2>
                <p className="text-gray-500 mt-1">{user?.email}</p>
                <span className={`badge mt-2 inline-flex text-xs ${roleBadgeClass}`}>
                  {roleLabel}
                </span>
              </div>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleUpdate} className="space-y-5">
              <div>
                <label className="input-label">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="input-field pl-11"
                  />
                </div>
              </div>

              <div>
                <label className="input-label">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    value={user?.email}
                    disabled
                    className="input-field pl-11 opacity-50 cursor-not-allowed"
                  />
                </div>
                <p className="text-gray-600 text-xs mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="input-label">Photo URL</label>
                <div className="relative">
                  <Camera className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    value={photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="input-field pl-11"
                  />
                </div>
              </div>

              <div>
                <label className="input-label">Role</label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    value={roleLabel}
                    disabled
                    className="input-field pl-11 opacity-50 cursor-not-allowed"
                  />
                </div>
                <p className="text-gray-600 text-xs mt-1">Role is assigned by admin</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>

          {/* Account Info */}
          <div className="card-glass p-6 rounded-2xl">
            <h3 className="text-white font-semibold mb-4">Account Information</h3>
            <div className="space-y-3">
              {[
                { label: "Account Created", value: user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" }) : "—" },
                { label: "Last Sign In", value: user?.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" }) : "—" },
                { label: "Auth Provider", value: user?.providerData?.[0]?.providerId === "google.com" ? "Google" : "Email/Password" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-primary-900/20 last:border-0">
                  <span className="text-gray-500 text-sm">{label}</span>
                  <span className="text-gray-300 text-sm font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;