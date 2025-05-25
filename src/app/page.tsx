"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Sample gallery items - replace with your own content
const galleryItems = [
  {
    id: 1,
    type: "image",
    src: "/for-pu/camping.jpg",
    alt: "Always in my heart",
    caption: "Always in my heart",
    aspectRatio: "portrait", // taller than wide
  },
  {
    id: 2,
    type: "image",
    src: "/for-pu/pu-class.jpg",
    alt: "Always in my heart",
    caption: "Always in my heart",
    aspectRatio: "landscape",
  },
  {
    id: 3,
    type: "image",
    src: "/for-pu/pu-is-soldier-1.jpg",
    alt: "Always in my heart",
    caption: "Always in my heart",
    aspectRatio: "square",
  },
  {
    id: 4,
    type: "image",
    src: "/for-pu/pu-is-soldier-2.jpg",
    alt: "Always in my heart",
    caption: "Always in my heart",
    aspectRatio: "portrait",
  },
  {
    id: 5,
    type: "image",
    src: "/for-pu/avatar.jpg",
    alt: "Always in my heart",
    caption: "Always in my heart",
    aspectRatio: "square",
  },
  {
    id: 6,
    type: "video",
    src: "/for-pu/pu-party.mp4",
    caption: "Always in my heart",
    aspectRatio: "portrait", // taller than wide
  },
  {
    id: 7,
    type: "video",
    src: "/for-pu/campu-travel.mp4",
    caption: "Always in my heart",
    aspectRatio: "landscape", // taller than wide
  },
  {
    id: 8,
    type: "video",
    src: "/for-pu/pu-on-the-bike.mp4",
    caption: "Pu on the bike",
    aspectRatio: "portrait", // taller than wide
  },
];

export default function Home() {
  const [selectedItem, setSelectedItem] = useState<
    (typeof galleryItems)[0] | null
  >(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <header className="container mx-auto py-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-rose-600">
          My Special Moments
        </h1>
        <p className="mt-2 text-gray-600">
          A collection of my favorite memories together
        </p>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Masonry Layout */}
        <div className="masonry-gallery">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className={cn(
                "masonry-item mb-4 break-inside-avoid",
                "relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
              )}
              onClick={() => setSelectedItem(item)}
            >
              {item.type === "image" ? (
                <div
                  className={cn(
                    "relative",
                    item.aspectRatio === "portrait"
                      ? "aspect-[3/4]"
                      : item.aspectRatio === "landscape"
                      ? "aspect-[4/3]"
                      : "aspect-square"
                  )}
                >
                  <Image
                    src={item.src || "/placeholder.svg"}
                    alt={item.alt || ""}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div
                  className={cn(
                    "relative",
                    item.aspectRatio === "portrait"
                      ? "aspect-[3/4]"
                      : item.aspectRatio === "landscape"
                      ? "aspect-[4/3]"
                      : "aspect-square"
                  )}
                >
                  <video
                    src={item.src}
                    controls
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-sm">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal for viewing selected item */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            className="absolute top-4 right-4 text-white hover:text-rose-400 transition-colors"
            onClick={() => setSelectedItem(null)}
          >
            <X className="w-8 h-8" />
          </button>

          <div className="max-w-4xl w-full">
            {selectedItem.type === "image" ? (
              <div className="relative w-full" style={{ maxHeight: "80vh" }}>
                <Image
                  src={selectedItem.src || "/placeholder.svg"}
                  alt={selectedItem.alt || ""}
                  width={1200}
                  height={800}
                  className="mx-auto object-contain max-h-[80vh]"
                />
              </div>
            ) : (
              <div className="relative w-full aspect-video">
                <video
                  src={selectedItem.src}
                  // poster={selectedItem.poster}
                  controls
                  className="w-full h-full"
                  autoPlay
                  muted
                  loop
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            <div className="mt-4 text-center">
              <p className="text-white text-lg">{selectedItem.caption}</p>
              <button className="mt-2 flex items-center mx-auto gap-2 text-rose-400 hover:text-rose-300 transition-colors">
                <Heart className="w-5 h-5" />
                <span>Favorite</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="container mx-auto py-5 text-center">
        <p className="text-pink-500 mb-1">
          May the world be gentle with you - MQL
        </p>
        <p className="text-gray-600">Made with all of ❤️</p>
      </footer>
    </div>
  );
}
