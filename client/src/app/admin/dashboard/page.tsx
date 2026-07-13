"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Car,
  Package,
  ShoppingBag,
  LogOut,
  LayoutDashboard,
  Home,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store";
import { useVehicles, useParts, useClothing } from "@/hooks";
import { useRouter } from "next/navigation";
import { DashboardStatSkeleton } from "@/components/AdminSkeleton";

export default function AdminDashboard() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const { data: vehicles } = useVehicles();
  const { data: parts } = useParts();
  const { data: clothing } = useClothing();

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  const stats = [
    {
      label: "Vehicles",
      count: vehicles?.length ?? 0,
      icon: Car,
      color: "bg-blue-500",
      href: "/admin/vehicles",
    },
    {
      label: "Parts",
      count: parts?.length ?? 0,
      icon: Package,
      color: "bg-amber-500",
      href: "/admin/parts",
    },
    {
      label: "Clothing",
      count: clothing?.length ?? 0,
      icon: ShoppingBag,
      color: "bg-green-500",
      href: "/admin/clothing",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-y-2">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-6 h-6 text-mega-blue shrink-0" />
            <h1 className="font-oswald text-xl text-gray-900">
              Admin Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-1.5 rounded-xl">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            </Link>
            <Link href="/admin/settings">
              <Button variant="outline" size="sm" className="gap-1.5 rounded-xl">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
            </Link>
            <span className="font-inter text-sm text-gray-500 ml-2 hidden sm:inline">
              {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors font-inter text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {!vehicles || !parts ? (
          <DashboardStatSkeleton />
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.08 } },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Link href={stat.href}>
                  <motion.div
                    whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white rounded-xl shadow-sm p-6 cursor-pointer transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}
                      >
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-inter text-sm text-gray-500">
                          {stat.label}
                        </p>
                        {stat.count !== null && (
                          <p className="font-oswald text-2xl text-gray-900">
                            {stat.count}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid md:grid-cols-3 gap-6"
        >
          <Link href="/admin/vehicles/new">
            <motion.div
              whileHover={{ scale: 1.03, boxShadow: "0 10px 30px -10px rgba(30,64,175,0.3)" }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-mega-blue to-mega-blue-dark text-white rounded-xl p-8 text-center cursor-pointer transition-all"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                <Car className="w-10 h-10 mx-auto mb-3" />
              </motion.div>
              <p className="font-oswald text-xl">Add New Vehicle</p>
              <p className="font-inter text-sm text-white/70 mt-2">
                Create a new vehicle listing
              </p>
            </motion.div>
          </Link>
          <Link href="/admin/parts/new">
            <motion.div
              whileHover={{ scale: 1.03, boxShadow: "0 10px 30px -10px rgba(245,158,11,0.3)" }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl p-8 text-center cursor-pointer transition-all"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.5 }}
              >
                <Package className="w-10 h-10 mx-auto mb-3" />
              </motion.div>
              <p className="font-oswald text-xl">Add New Part</p>
              <p className="font-inter text-sm text-white/70 mt-2">
                Create a new part listing
              </p>
            </motion.div>
          </Link>
          <Link href="/admin/clothing/new">
            <motion.div
              whileHover={{ scale: 1.03, boxShadow: "0 10px 30px -10px rgba(34,197,94,0.3)" }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-8 text-center cursor-pointer transition-all"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 1 }}
              >
                <ShoppingBag className="w-10 h-10 mx-auto mb-3" />
              </motion.div>
              <p className="font-oswald text-xl">Add New Clothing</p>
              <p className="font-inter text-sm text-white/70 mt-2">
                Create a new clothing listing
              </p>
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
