import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary-900/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center relative"
      >
        <motion.h1
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12 }}
          className="text-[12rem] font-display font-black leading-none text-gradient-purple opacity-20 select-none"
        >
          404
        </motion.h1>
        <div className="-mt-16 relative">
          <h2 className="text-4xl font-display font-bold text-white mb-4">Page Not Found</h2>
          <p className="text-gray-400 max-w-md mx-auto mb-8">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn-primary inline-flex items-center gap-2">
              <Home className="w-4 h-4" /> Back to Home
            </Link>
            <button onClick={() => window.history.back()} className="btn-outline inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Go Back
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
