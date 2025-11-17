"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Users,
  FolderKanban,
  ListTodo,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomeComponent() {
  const features = [
    {
      title: "Team Management",
      desc: "Create teams, add members, set capacities, and track workloads.",
      icon: <Users className="w-8 h-8" />,
      href: "/teams",
    },
    {
      title: "Project Handling",
      desc: "Organize work into projects and bind each project to its team.",
      icon: <FolderKanban className="w-8 h-8" />,
      href: "/projects",
    },
    {
      title: "Task Management",
      desc: "Create, assign, edit, filter, and track tasks easily.",
      icon: <ListTodo className="w-8 h-8" />,
      href: "/tasks",
    },
    {
      title: "Smart Reassignment",
      desc: "Automatically balance workload using intelligent task distribution.",
      icon: <BarChart3 className="w-8 h-8" />,
      href: "/dashboard",
    },
  ];

  return (
    <div className="px-6 md:px-16 pt-28 pb-20 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4"
        >
          Smart Task Manager
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-gray-600 text-lg md:text-xl leading-relaxed"
        >
          A modern, intelligent platform to manage teams, projects, and tasks
          efficiently. Auto-balance workloads, track progress, and stay
          productive.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8 flex justify-center gap-4"
        >
          <Link href="/dashboard">
            <Button className="px-6 py-3 text-lg">Go to Dashboard</Button>
          </Link>
          <Link href="/tasks">
            <Button variant="outline" className="px-6 py-3 text-lg">
              View Tasks
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link href={feature.href}>
              <Card className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition p-4 bg-white rounded-2xl">
                <CardContent className="space-y-4">
                  <div className="text-blue-600">{feature.icon}</div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-20 bg-white p-10 rounded-3xl shadow-md max-w-5xl mx-auto text-center"
      >
        <div className="flex justify-center mb-4">
          <Sparkles className="w-10 h-10 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold mb-4 text-gray-900">
          Boost Productivity with Smart Automation
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Let the Smart Task Manager handle workload distribution so your team
          can focus on meaningful work.
        </p>
        <Link href="/dashboard">
          <Button className="px-8 py-3 text-lg">Try Smart Reassignment</Button>
        </Link>
      </motion.div>
    </div>
  );
}
