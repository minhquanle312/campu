"use client";

import { Heart } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export interface MediaItem {
  id?: string | number;
  type: "image" | "video";
  src: string;
  alt?: string;
  caption?: string;
}

interface MediaViewerModalProps {
  item: MediaItem | null;
  onClose: () => void;
}

export function MediaViewerModal({ item, onClose }: MediaViewerModalProps) {
  return (
    <Dialog open={!!item} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl bg-black/95 border-none text-white p-6">
        <VisuallyHidden>
          <DialogTitle>{item?.caption || "Media viewer"}</DialogTitle>
          <DialogDescription>
            {item?.type === "image" ? "Image viewer" : "Video viewer"}
          </DialogDescription>
        </VisuallyHidden>

        {item && (
          <div className="w-full">
            {item.type === "image" ? (
              <div className="relative w-full" style={{ maxHeight: "80vh" }}>
                <Image
                  src={item.src || "/placeholder.svg"}
                  alt={item.alt || ""}
                  width={1200}
                  height={800}
                  className="mx-auto object-contain max-h-[80vh]"
                />
              </div>
            ) : (
              <div className="relative w-full aspect-video">
                <video
                  src={item.src}
                  controls
                  className="w-full h-full"
                  autoPlay
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            {item.caption && (
              <div className="mt-4 text-center">
                <p className="text-white text-lg">{item.caption}</p>
                <button className="mt-2 flex items-center mx-auto gap-2 text-rose-400 hover:text-rose-300 transition-colors">
                  <Heart className="w-5 h-5" />
                  <span>Favorite</span>
                </button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
