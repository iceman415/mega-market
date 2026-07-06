"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Save, Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store";
import { useChangePassword } from "@/hooks";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Home } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const changePassword = useChangePassword();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    try {
      await changePassword.mutateAsync({ currentPassword, newPassword });
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? ((err as { response: { data: { error: string } } }).response?.data?.error ?? "Failed to update password")
          : "Failed to update password";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-y-2">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/admin/dashboard")}>
              <ArrowLeft className="w-5 h-5 text-gray-500 hover:text-gray-700" />
            </button>
            <h1 className="font-oswald text-xl text-gray-900">Settings</h1>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-1.5 rounded-xl">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="font-oswald text-lg text-gray-900 mb-4">Profile</h2>
          <div className="space-y-3 font-inter text-sm">
            <div className="flex items-center gap-3">
              <span className="text-gray-500 w-20">Name:</span>
              <span className="text-gray-900 font-medium">{user?.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-500 w-20">Email:</span>
              <span className="text-gray-900 font-medium">{user?.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-500 w-20">Role:</span>
              <span className="text-gray-900 font-medium capitalize">{user?.role}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="font-oswald text-lg text-gray-900 mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Change Password
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div>
              <label className="block font-inter text-sm text-gray-700 mb-1.5 font-medium">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-300 font-inter text-sm focus:border-mega-blue focus:ring-2 focus:ring-mega-blue/20 outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block font-inter text-sm text-gray-700 mb-1.5 font-medium">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-300 font-inter text-sm focus:border-mega-blue focus:ring-2 focus:ring-mega-blue/20 outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block font-inter text-sm text-gray-700 mb-1.5 font-medium">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 font-inter text-sm focus:border-mega-blue focus:ring-2 focus:ring-mega-blue/20 outline-none transition-all"
                required
              />
            </div>
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button
                type="submit"
                disabled={changePassword.isPending}
                className="w-full bg-mega-blue hover:bg-mega-blue-dark text-white py-2.5 rounded-xl font-oswald text-sm disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {changePassword.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {changePassword.isPending ? "Updating..." : "Change Password"}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
