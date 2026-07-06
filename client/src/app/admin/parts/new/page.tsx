"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AdminPartForm } from "@/components/AdminPartForm";
import { useCreatePart } from "@/hooks";
import { toast } from "sonner";

export default function NewPartPage() {
  const router = useRouter();
  const createMutation = useCreatePart();

  const handleSubmit = async (data: any) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success("Part created");
      router.push("/admin/parts");
    } catch {
      toast.error("Failed to create part");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <button onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </button>
          <h1 className="font-oswald text-xl text-gray-900">New Part</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminPartForm
          onSubmit={handleSubmit}
          isPending={createMutation.isPending}
        />
      </div>
    </div>
  );
}
