import { Link, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

function NavBar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const linkClass = (path) =>
    `transition-colors duration-200 text-sm tracking-wide ${
      currentPath === path ? "text-white font-bold" : "text-slate-400 hover:text-white font-medium"
    }`;

  return (
    <div className="w-full px-6 pt-6 pb-2 relative z-50">
      <nav className="max-w-7xl mx-auto flex justify-between items-center py-4 px-8 glass-nav rounded-2xl shadow-2xl shadow-indigo-500/10 transition-all duration-300">
        {/* Left Side: Logo */}
        <Link to="/" className="text-xl font-extrabold text-white tracking-widest flex items-center gap-2">
          <span className="bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent">L&F</span>
          <span className="hidden sm:inline">AI Tracker</span>
        </Link>

        {/* Center: Nav Links */}
        <ul className="hidden md:flex gap-10 items-center">
          <li>
            <Link to="/" className={linkClass("/")}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className={linkClass("/about")}>
              About
            </Link>
          </li>
          <li>
            <Link to="/contact" className={linkClass("/contact")}>
              Contact
            </Link>
          </li>
        </ul>

        {/* Right Side: Auth Buttons */}
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal" forceRedirectUrl="/app">
              <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-full group bg-gradient-to-br from-teal-300 to-indigo-500 group-hover:from-teal-300 group-hover:to-indigo-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-teal-200 dark:focus:ring-teal-800 transition-all shadow-lg shadow-teal-500/20 m-0">
                <span className="relative px-6 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-full group-hover:bg-opacity-0 font-bold whitespace-nowrap">
                  Login
                </span>
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton showName={true} />
          </SignedIn>
        </div>
      </nav>
    </div>
  );
}

export default NavBar;
