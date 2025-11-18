"use client";
import {
  Menu,
  LogOut,
  User,
  LayoutDashboard,
  Users,
  FolderKanban,
  ListTodo,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { logout } from "@/store/slices/authSlice";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const navLinks = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    { name: "Teams", href: "/teams", icon: <Users className="w-4 h-4" /> },
    {
      name: "Projects",
      href: "/projects",
      icon: <FolderKanban className="w-4 h-4" />,
    },
    { name: "Tasks", href: "/tasks", icon: <ListTodo className="w-4 h-4" /> },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);

    // Add a small delay for better UX
    setTimeout(() => {
      dispatch(logout());
      setIsLoggingOut(false);
      router.push("/login");
    }, 500);
  };

  const handleProfile = () => {
    // You can implement profile functionality here
    console.log("Profile clicked");
  };

  return (
    <nav className="w-full fixed top-0 left-0 z-50 px-4 pt-4">
      <div className="max-w-7xl mx-auto backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-6 h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src={logo}
              alt="logo"
              width={60}
              height={60}
              className="w-12 md:w-16 h-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
                  pathname === item.href
                    ? "bg-white/20 text-gray-800 shadow-lg"
                    : "text-gray-800 hover:bg-white/10 hover:scale-105"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Profile & Logout */}
          <div className="hidden md:flex items-center gap-3">
            {/* User Info */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5">
              <User className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700 max-w-32 truncate">
                {user?.name || "User"}
              </span>
            </div>

            {/* Profile Button */}
            <button
              onClick={handleProfile}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-white/10 hover:text-gray-800
              
              transition-all duration-300 hover:scale-105"
            >
              <User className="w-4 h-4" /> Profile
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? (
                <>
                  <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                  <span>Logging out...</span>
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-white/10 transition-all duration-300"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 pb-4 space-y-2 border-t border-white/10 pt-4">
            {/* User Info in Mobile */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 mb-2">
              <User className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700 truncate">
                {user?.name || "User"}
              </span>
            </div>

            {/* Navigation Links */}
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
                  pathname === item.href
                    ? "bg-white/20 text-gray-800 shadow-lg"
                    : "text-gray-800 hover:bg-white/10"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile Profile & Logout */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <button
                onClick={() => {
                  handleProfile();
                  setOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-800 hover:bg-white/10 w-full text-left transition-all duration-300"
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>

              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                disabled={isLoggingOut}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/20 hover:text-red-300 w-full text-left transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? (
                  <>
                    <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                    <span>Logging out...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
