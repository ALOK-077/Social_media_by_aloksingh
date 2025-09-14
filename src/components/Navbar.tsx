import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { signInWithGitHub, signOut, user } = useAuth();

  const displayName = user?.user_metadata.user_name || user?.email;

  return (
    <nav className="fixed top-0 w-full z-40 bg-[rgba(10,10,10,0.85)] backdrop-blur-lg border-b border-white/10 shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="font-mono text-2xl font-extrabold text-white tracking-tight">
            forum<span className="text-purple-500">.app</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-200 hover:text-purple-400 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              to="/create"
              className="text-gray-200 hover:text-purple-400 transition-colors font-medium"
            >
              Create Post
            </Link>
            <Link
              to="/communities"
              className="text-gray-200 hover:text-purple-400 transition-colors font-medium"
            >
              Communities
            </Link>
            <Link
              to="/community/create"
              className="text-gray-200 hover:text-purple-400 transition-colors font-medium"
            >
              Create Community
            </Link>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                {user.user_metadata?.avatar_url && (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="User Avatar"
                    className="w-9 h-9 rounded-full object-cover border border-gray-600"
                  />
                )}
                <span className="text-gray-100 font-medium">{displayName}</span>
                <button
                  onClick={signOut}
                  className="bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded-md text-white font-medium transition"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGitHub}
                className="bg-blue-500 hover:bg-blue-600 px-4 py-1.5 rounded-md text-white font-medium transition"
              >
                Sign in with GitHub
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-gray-200 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[rgba(10,10,10,0.95)] border-t border-white/10 shadow-lg">
          <div className="px-4 pt-3 pb-4 space-y-2">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:text-white hover:bg-gray-800 transition"
            >
              Home
            </Link>
            <Link
              to="/create"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:text-white hover:bg-gray-800 transition"
            >
              Create Post
            </Link>
            <Link
              to="/communities"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:text-white hover:bg-gray-800 transition"
            >
              Communities
            </Link>
            <Link
              to="/community/create"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:text-white hover:bg-gray-800 transition"
            >
              Create Community
            </Link>

            {/* Mobile Auth */}
            <div className="pt-3 border-t border-gray-700">
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {user.user_metadata?.avatar_url && (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full object-cover border border-gray-600"
                      />
                    )}
                    <span className="text-gray-100 text-sm font-medium">
                      {displayName}
                    </span>
                  </div>
                  <button
                    onClick={signOut}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-white text-sm font-medium transition"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={signInWithGitHub}
                  className="w-full mt-2 bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded-md text-white text-sm font-medium transition"
                >
                  Sign in with GitHub
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
