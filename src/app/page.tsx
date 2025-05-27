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
    src: "/for-pu/pu-party.mp4", // Replace with your video URL
    // poster: "/placeholder.svg?height=600&width=400",
    caption: "Always in my heart",
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
          Our Special Moments
        </h1>
        <p className="mt-2 text-gray-600">
          A collection of our favorite memories together
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
                  <Image
                    src={item.src || "/placeholder.svg"}
                    alt={item.caption || ""}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-rose-600 border-b-8 border-b-transparent ml-1"></div>
                    </div>
                  </div>
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

      <footer className="container mx-auto py-8 text-center border-t border-rose-100">
        <p className="text-gray-600">Made with all of ❤️</p>
      </footer>
    </div>
  );
}
