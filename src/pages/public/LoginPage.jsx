import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Star, Chrome } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const LoginPage = () => {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async ({ email, password }) => {
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.code === "auth/invalid-credential" ? "Invalid email or password" : err.message;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await googleLogin();
      toast.success("Logged in with Google!");
      navigate(from, { replace: true });
    } catch {
      toast.error("Google login failed");
    }
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center px-4 pt-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary-700/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gold-500/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-gold-500 flex items-center justify-center shadow-glow-purple">
              <Star className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="font-display font-bold text-2xl text-white">
              Club<span className="text-gradient-gold">Sphere</span>
            </span>
          </Link>
          <h1 className="text-3xl font-display font-bold text-white">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Sign in to your account</p>
        </div>

        <div className="card-glass p-8 rounded-3xl">
          {/* Google Login */}
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 bg-dark-600/60 border border-primary-900/40 rounded-xl px-4 py-3.5 text-gray-300 hover:border-primary-700/50 hover:text-white transition-all duration-200 mb-6 font-medium"
          >
            <Chrome className="w-5 h-5 text-blue-400" />
            Continue with Google
          </button>

          <div className="relative mb-6">
            <hr className="border-primary-900/30" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-dark-700 px-3 text-gray-600 text-xs">
              or continue with email
            </span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="input-label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                  })}
                  type="email"
                  placeholder="you@example.com"
                  className="input-field pl-11"
                />
              </div>
              {errors.email && <p className="input-error">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="input-label">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  {...register("password", { required: "Password is required" })}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="input-field pl-11 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="input-error">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-base"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
