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

const HomeComponent = () => {
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
    <div className="relative px-6 md:px-16 pt-32 pb-20 bg-gray-50 min-h-screen overflow-hidden">
      {/* Background gradient circles */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1.2 }}
        className="absolute top-20 left-10 w-72 h-72 bg-blue-300 blur-[150px] rounded-full"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="absolute bottom-10 right-10 w-72 h-72 bg-purple-300 blur-[150px] rounded-full"
      />

      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto mb-20 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 drop-shadow-sm"
        >
          Smart Task Manager
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-gray-700 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
        >
          A modern platform to manage teams, projects, and tasks
          collaboratively. Experience smart automation, dynamic workload
          balancing, and a clean modern UI built for productivity.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="mt-10 flex justify-center gap-5"
        >
          <Link href="/dashboard">
            <Button className="px-7 py-3 text-lg rounded-xl shadow-md hover:shadow-xl transition-all">
              Go to Dashboard
            </Button>
          </Link>
          <Link href="/tasks">
            <Button
              variant="outline"
              className="px-7 py-3 text-lg rounded-xl border-gray-300 shadow-sm hover:shadow-lg transition-all"
            >
              View Tasks
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Features Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: {} }}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Link href={feature.href}>
              <Card className="cursor-pointer group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-5 bg-white rounded-3xl border border-gray-200">
                <CardContent className="space-y-4">
                  <motion.div
                    initial={{ rotate: -10 }}
                    whileHover={{ rotate: 0, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="text-blue-600"
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-lg font-semibold group-hover:text-blue-600 transition">
                    {feature.title}
                  </h3>
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
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mt-24 bg-white p-12 rounded-3xl shadow-xl max-w-5xl mx-auto text-center relative z-10"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "backOut" }}
          className="flex justify-center mb-4"
        >
          <Sparkles className="w-12 h-12 text-blue-600" />
        </motion.div>
        <h2 className="text-3xl font-bold mb-4 text-gray-900">
          Boost Productivity with Smart Automation
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Let Smart Task Manager handle workload balancing while your team
          focuses on meaningful work.
        </p>
        <Link href="/dashboard">
          <Button className="px-10 py-3 text-lg rounded-xl shadow-md hover:shadow-xl transition-all">
            Try Smart Reassignment
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};
export default HomeComponent;
