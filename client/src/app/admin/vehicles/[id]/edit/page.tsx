"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AdminVehicleForm } from "@/components/AdminVehicleForm";
import { useVehicle, useUpdateVehicle } from "@/hooks";
import { toast } from "sonner";

export default function EditVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: vehicle, isLoading } = useVehicle(id);
  const updateMutation = useUpdateVehicle();

  const handleSubmit = async (data: any) => {
    try {
      await updateMutation.mutateAsync({ id, data });
      toast.success("Vehicle updated");
      router.push("/admin/vehicles");
    } catch {
      toast.error("Failed to update vehicle");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-mega-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-inter text-gray-500">Vehicle not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <button onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </button>
          <h1 className="font-oswald text-xl text-gray-900">
            Edit Vehicle
          </h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminVehicleForm
          initial={vehicle}
          onSubmit={handleSubmit}
          isPending={updateMutation.isPending}
        />
      </div>
    </div>
  );
}
