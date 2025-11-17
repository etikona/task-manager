"use client";
import { useState } from "react";
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
import logo from "@/public/logo.png";
const Navbar = () => {
  const [pathname, setPathname] = useState("/dashboard");
  const [open, setOpen] = useState(false);

  const navItems = [
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

  return (
    <nav className="w-full fixed top-0 left-0 z-50 px-4 pt-4">
      <div className="max-w-7xl mx-auto backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-6 h-16">
          <div className="text-xl font-bold tracking-wide bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            <Image
              src={logo}
              alt="logo"
              width={60}
              height={60}
              className="w-12 md:w-16 h-auto object-contain"
              priority
            />
          </div>

          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  setPathname(item.href);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
                  pathname === item.href
                    ? "bg-white/20 text-gray-800 shadow-lg"
                    : "text-gray-800 hover:bg-white/10 hover:text-gray-800 hover:scale-105"
                }`}
              >
                {item.name}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-white/10 hover:text-white transition-all duration-300 hover:scale-105">
              <User className="w-4 h-4" /> Profile
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-300 hover:scale-105">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>

          <button
            className="md:hidden p-2 rounded-xl hover:bg-white/10 transition-all duration-300"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <X className="w-6 h-6 text-gray-300" />
            ) : (
              <Menu className="w-6 h-6 text-gray-300" />
            )}
          </button>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 pb-4 space-y-2 border-t border-white/10 pt-4 ">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  setPathname(item.href);
                  setOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
                  pathname === item.href
                    ? "bg-white/20 text-gray-800 shadow-lg"
                    : "text-gray-800 hover:bg-white/10 hover:text-gray-800"
                }`}
              >
                {item.name}
              </a>
            ))}

            <div className="h-px bg-white/10 my-2" />

            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-800 hover:bg-white/10 hover:text-gray-500 transition-all duration-300 w-full">
              <User className="w-4 h-4" /> Profile
            </button>

            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-300 w-full">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
