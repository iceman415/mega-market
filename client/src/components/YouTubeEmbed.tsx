"use client";

import { getYouTubeEmbedId } from "@/lib";
import { cn } from "@/lib/utils";

interface YouTubeEmbedProps {
  url: string | null;
  className?: string;
}

export default function YouTubeEmbed({ url, className }: YouTubeEmbedProps) {
  const videoId = getYouTubeEmbedId(url);

  if (!videoId) return null;

  return (
    <div className={cn("relative aspect-video w-full overflow-hidden rounded-lg", className)}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
