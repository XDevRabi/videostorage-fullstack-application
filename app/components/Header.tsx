"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Home, User } from "lucide-react";
import { useNotification } from "./Notification";

export default function Header() {
  const { data: session } = useSession();
  const { showNotification } = useNotification();

  const handleSignOut = async () => {
    try {
      await signOut();
      showNotification("Signed out successfully", "success");
    } catch {
      showNotification("Failed to sign out", "error");
    }
  };

  return (
    <div className="sticky top-0 z-40 bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center space-x-2 text-white text-xl font-bold hover:text-blue-400 transition duration-300"
            prefetch={true}
            onClick={() =>
              showNotification("Welcome to ImageKit ReelsPro", "info")
            }
          >
            <Home className="w-5 h-5" />
            <span>Video with AI</span>
          </Link>
        </div>
        <div className="flex items-center">
          <div className="relative group">
            <button
              className="p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-300"
              aria-label="User menu"
            >
              <User className="w-5 h-5" />
            </button>
            <ul className="absolute right-0 mt-2 w-64 bg-gray-700 rounded-xl shadow-xl py-2 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 transform group-focus-within:translate-y-0 group-hover:translate-y-0 translate-y-[-10px] transition-all duration-300 ease-in-out">
              {session ? (
                <>
                  <li className="px-4 py-2">
                    <span className="text-sm text-gray-300">
                      {session.user?.email?.split("@")[0]}
                    </span>
                  </li>
                  <li className="border-t border-gray-600 my-1"></li>
                  <li>
                    <Link
                      href="/upload"
                      className="block px-4 py-2 text-white hover:bg-gray-600 rounded-md transition duration-300"
                      onClick={() =>
                        showNotification("Welcome to Admin Dashboard", "info")
                      }
                    >
                      Video Upload
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-red-400 hover:bg-gray-600 hover:text-red-300 rounded-md transition duration-300"
                    >
                      Sign Out
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    href="/login"
                    className="block px-4 py-2 text-white hover:bg-gray-600 rounded-md transition duration-300"
                    onClick={() =>
                      showNotification("Please sign in to continue", "info")
                    }
                  >
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}