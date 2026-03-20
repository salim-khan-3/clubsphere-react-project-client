import { Link } from "react-router-dom";
import { Star, Github, Linkedin, Twitter, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-dark-800 border-t border-primary-900/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-gold-500 flex items-center justify-center">
                <Star className="w-5 h-5 text-white" fill="white" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                Club<span className="text-gradient-gold">Sphere</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Discover, join, and manage local clubs. Connect with your community through shared passions.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a href="https://github.com" target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-dark-600 border border-primary-900/40 flex items-center justify-center text-gray-500 hover:text-white hover:border-primary-700/50 transition-all duration-200">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-dark-600 border border-primary-900/40 flex items-center justify-center text-gray-500 hover:text-white hover:border-primary-700/50 transition-all duration-200">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://x.com" target="_blank" rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-dark-600 border border-primary-900/40 flex items-center justify-center text-gray-500 hover:text-white hover:border-primary-700/50 transition-all duration-200">
                {/* X (Twitter) logo */}
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold font-display mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { to: "/", label: "Home" },
                { to: "/clubs", label: "Browse Clubs" },
                { to: "/events", label: "Upcoming Events" },
                { to: "/register", label: "Join ClubSphere" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-gray-500 hover:text-primary-300 text-sm transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold font-display mb-4">Categories</h4>
            <ul className="space-y-2.5">
              {["Photography", "Sports", "Technology", "Book Clubs", "Hiking", "Music"].map((cat) => (
                <li key={cat}>
                  <Link to={`/clubs?category=${cat}`} className="text-gray-500 hover:text-primary-300 text-sm transition-colors duration-200">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold font-display mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-gray-500 text-sm">
                <Mail className="w-4 h-4 text-primary-500 flex-shrink-0" />
                hello@clubsphere.io
              </li>
              <li className="flex items-center gap-2.5 text-gray-500 text-sm">
                <MapPin className="w-4 h-4 text-primary-500 flex-shrink-0" />
                Dhaka, Bangladesh
              </li>
              <li className="flex items-center gap-2.5 text-gray-500 text-sm">
                <Phone className="w-4 h-4 text-primary-500 flex-shrink-0" />
                +880 1700-000000
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-primary-900/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} ClubSphere. All rights reserved.
          </p>
          <p className="text-gray-700 text-xs">
            Built with React, Node.js, MongoDB & Stripe
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
