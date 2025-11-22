"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Github, Linkedin, Globe, Mail } from "lucide-react";

export default function Footer() {
  const links = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Teams", href: "/teams" },
    { name: "Projects", href: "/projects" },
    { name: "Tasks", href: "/tasks" },
  ];

  const socials = [
    { icon: <Github className="w-5 h-5" />, href: "https://github.com" },
    { icon: <Linkedin className="w-5 h-5" />, href: "https://linkedin.com" },
    { icon: <Globe className="w-5 h-5" />, href: "https://yourwebsite.com" },
    { icon: <Mail className="w-5 h-5" />, href: "mailto:hello@example.com" },
  ];

  return (
    <footer className="relative mt-24 bg-gray-900 text-gray-300 py-14 px-6 md:px-16 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl font-bold text-white tracking-wide"
          >
            Smart Task Manager
          </motion.h2>
          <p className="mt-4 text-gray-400 text-sm leading-relaxed max-w-sm">
            A modern platform to manage teams, projects, tasks, and automate
            workload balancing with smart algorithms.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2">
            {links.map((link, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Link
                  href={link.href}
                  className="hover:text-blue-400 transition text-sm"
                >
                  {link.name}
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Connect</h3>
          <div className="flex items-center gap-4">
            {socials.map((social, i) => (
              <motion.a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.15 }}
                transition={{ duration: 0.3 }}
                className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 text-gray-300"
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-10 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Smart Task Manager — All rights reserved.
      </div>
    </footer>
  );
}
