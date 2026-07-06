"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Edit3,
  Trash2,
  ArrowLeft,
  Search,
  Home,
  Settings,
} from "lucide-react";
import { useVehicles, useDeleteVehicle } from "@/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AdminListSkeleton } from "@/components/AdminSkeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AdminVehiclesPage() {
  const router = useRouter();
  const { data: vehicles, isLoading } = useVehicles();
  const deleteMutation = useDeleteVehicle();
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const filtered = searchQuery
    ? vehicles?.filter(
        (v) =>
          v.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.year.includes(searchQuery),
      )
    : vehicles;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success("Vehicle deleted");
    } catch {
      toast.error("Failed to delete vehicle");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-y-2">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/admin/dashboard")}>
              <ArrowLeft className="w-5 h-5 text-gray-500 hover:text-gray-700" />
            </button>
            <h1 className="font-oswald text-xl text-gray-900">Vehicles</h1>
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
            <Link href="/admin/vehicles/new">
              <Button className="bg-mega-blue hover:bg-mega-blue-dark text-white flex items-center gap-2 rounded-xl">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Vehicle</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSearchSubmit} className="relative mb-6 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search vehicles..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 font-inter text-sm focus:border-mega-blue focus:ring-2 focus:ring-mega-blue/20 outline-none transition-all"
            />
          </div>
          <Button type="submit" size="sm" className="rounded-xl bg-mega-blue hover:bg-mega-blue-dark text-white">
            Search
          </Button>
        </form>

        {isLoading ? (
          <AdminListSkeleton />
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
            className="space-y-3"
          >
            {filtered?.length === 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center font-inter text-gray-500 py-12"
              >
                No vehicles found
              </motion.p>
            )}
            {filtered?.map((vehicle) => (
              <motion.div
                key={vehicle.id}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="bg-white rounded-xl shadow-sm p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:shadow-md transition-shadow"
              >
                <Dialog>
                  <DialogTrigger nativeButton={false} render={<span />}>
                    <button
                      type="button"
                      onClick={() => setPreviewUrl(vehicle.images[0] || null)}
                      className="relative w-16 h-14 sm:w-20 sm:h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      {vehicle.images[0] && (
                        <Image
                          src={vehicle.images[0]}
                          alt={vehicle.brand}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      )}
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl p-1 bg-black/90 border-0">
                    {previewUrl && (
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        width={1200}
                        height={800}
                        className="w-full h-auto object-contain rounded-lg"
                      />
                    )}
                  </DialogContent>
                </Dialog>
                <div className="flex-1 min-w-0">
                  <h3 className="font-oswald text-lg text-gray-900 truncate">
                    {vehicle.brand} {vehicle.model}
                  </h3>
                  <p className="font-inter text-sm text-gray-500">
                    {vehicle.year} &middot; ${Number(vehicle.price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    {vehicle.sold && (
                      <span className="ml-2 text-red-500 font-bold">SOLD</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href={`/admin/vehicles/${vehicle.id}/edit`}>
                    <Button variant="outline" size="icon" className="rounded-xl">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => setDeleteId(vehicle.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Vehicle</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The vehicle and its images will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
