"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Upload, X, Loader2, Expand } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SiYoutube } from "react-icons/si";
import { Clothing } from "@/types";
import { uploadService } from "@/services";
import { compressImage } from "@/lib/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AdminClothingFormProps {
  initial?: Partial<Clothing>;
  onSubmit: (data: Partial<Clothing>) => Promise<void>;
  isPending: boolean;
}

export function AdminClothingForm({
  initial,
  onSubmit,
  isPending,
}: AdminClothingFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [price, setPrice] = useState(
    initial?.price ? Number(initial.price).toFixed(2) : ""
  );
  const [description, setDescription] = useState(initial?.description ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [sold, setSold] = useState(initial?.sold ?? false);
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [youtubeUrl, setYoutubeUrl] = useState(initial?.youtubeUrl ?? "");
  const [size, setSize] = useState(initial?.size ?? "");
  const [color, setColor] = useState(initial?.color ?? "");
  const [uploading, setUploading] = useState(false);
  const [deletingIdx, setDeletingIdx] = useState<number | null>(null);

  const handleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    const toastId = toast.loading(`Compressing ${files.length} image(s)...`);

    try {
      const compressed = await Promise.all(files.map(compressImage));
      toast.loading("Uploading to Cloudinary...", { id: toastId });

      const uploadFiles = compressed.map(
        (blob) => new File([blob], files[0].name.replace(/\.[^.]+$/, ".webp"), { type: "image/webp" })
      );

      const { urls } = await uploadService.uploadImages(uploadFiles);
      setImages((prev) => [...prev, ...urls]);
      toast.success(`${urls.length} image(s) uploaded`, { id: toastId });
    } catch {
      toast.error("Upload failed", { id: toastId });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = async (index: number) => {
    const url = images[index];
    setDeletingIdx(index);
    try {
      await uploadService.deleteImage(url);
      setImages((prev) => prev.filter((_, i) => i !== index));
    } catch {
      toast.error("Failed to delete image from Cloudinary");
      setImages((prev) => prev.filter((_, i) => i !== index));
    } finally {
      setDeletingIdx(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      name,
      price,
      description,
      location,
      sold,
      images,
      youtubeUrl: youtubeUrl || null,
      size: size || null,
      color: color || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block font-inter text-sm text-gray-700 mb-1.5 font-medium">
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Mega Market Logo Tee"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 font-inter text-sm focus:border-mega-blue focus:ring-2 focus:ring-mega-blue/20 outline-none transition-all"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-inter text-sm text-gray-700 mb-1.5 font-medium">
            Price
          </label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onBlur={() => {
              if (price !== "") setPrice(Number(price).toFixed(2));
            }}
            placeholder="e.g. 29.99"
            inputMode="decimal"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 font-inter text-sm focus:border-mega-blue focus:ring-2 focus:ring-mega-blue/20 outline-none transition-all"
            required
          />
        </div>
        <div>
          <label className="block font-inter text-sm text-gray-700 mb-1.5 font-medium">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Miami, FL"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 font-inter text-sm focus:border-mega-blue focus:ring-2 focus:ring-mega-blue/20 outline-none transition-all"
            required
          />
        </div>
      </div>

      <div>
        <label className="block font-inter text-sm text-gray-700 mb-1.5 font-medium">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="Describe the item, material, sizing info..."
          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 font-inter text-sm focus:border-mega-blue focus:ring-2 focus:ring-mega-blue/20 outline-none resize-none transition-all"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-inter text-sm text-gray-700 mb-1.5 font-medium">
            Size
          </label>
          <input
            type="text"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="e.g. S, M, L, XL"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 font-inter text-sm focus:border-mega-blue focus:ring-2 focus:ring-mega-blue/20 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block font-inter text-sm text-gray-700 mb-1.5 font-medium">
            Color
          </label>
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="e.g. Black, White, Red"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 font-inter text-sm focus:border-mega-blue focus:ring-2 focus:ring-mega-blue/20 outline-none transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block font-inter text-sm text-gray-700 mb-1.5 font-medium flex items-center gap-2">
          <SiYoutube className="w-4 h-4 text-red-500" />
          YouTube Video URL (optional)
        </label>
        <input
          type="url"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
          className="w-full px-4 py-2.5 rounded-xl border border-gray-300 font-inter text-sm focus:border-mega-blue focus:ring-2 focus:ring-mega-blue/20 outline-none transition-all"
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="sold"
          checked={sold}
          onChange={(e) => setSold(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-mega-blue focus:ring-mega-blue"
        />
        <label htmlFor="sold" className="font-inter text-sm text-gray-700 cursor-pointer select-none">
          Mark as Sold
        </label>
      </div>

      <div>
        <label className="block font-inter text-sm text-gray-700 mb-2 font-medium">
          Images
        </label>
        <div className="flex flex-wrap gap-3 mb-3">
          <AnimatePresence>
            {images.map((url, i) => (
              <Dialog key={url}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative w-24 h-24 rounded-xl overflow-hidden group bg-gray-100 shadow-sm"
                >
                  <DialogTrigger nativeButton={false} render={<span />}>
                    <button type="button" className="w-full h-full cursor-pointer">
                      <Image src={url} alt="" fill className="object-cover" sizes="96px" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <Expand className="w-5 h-5 text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity drop-shadow" />
                      </div>
                    </button>
                  </DialogTrigger>
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    disabled={deletingIdx === i}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity hover:bg-black/70 z-10 cursor-pointer disabled:opacity-100"
                  >
                    {deletingIdx === i ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}
                  </button>
                </motion.div>
                <DialogContent className="max-w-3xl p-1 bg-black/90 border-0">
                  <Image
                    src={url}
                    alt="Preview"
                    width={1200}
                    height={800}
                    className="w-full h-auto object-contain rounded-lg"
                  />
                </DialogContent>
              </Dialog>
            ))}
          </AnimatePresence>
          <label className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-mega-blue hover:bg-blue-50/50 transition-all bg-gray-50">
            {uploading ? (
              <Loader2 className="w-5 h-5 text-mega-blue animate-spin" />
            ) : (
              <Upload className="w-5 h-5 text-gray-400" />
            )}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImagesUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
        <p className="font-inter text-xs text-gray-400">
          PNG, JPG or WebP up to 15MB. Images are compressed and converted to WebP automatically.
        </p>
      </div>

      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
        <Button
          type="submit"
          disabled={isPending || uploading}
          className="w-full bg-mega-blue hover:bg-mega-blue-dark text-white py-3 rounded-xl font-oswald text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isPending ? (
            <span className="flex items-center gap-2 justify-center">
              <Loader2 className="w-4 h-4 animate-spin" />
              {initial ? "Updating..." : "Creating..."}
            </span>
          ) : initial ? (
            "Update Clothing"
          ) : (
            "Create Clothing"
          )}
        </Button>
      </motion.div>
    </form>
  );
}
