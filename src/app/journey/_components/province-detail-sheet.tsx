"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Calendar, Users, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { PROVINCES_GEO_MAPPING } from "@/config/province";
import { trips } from "@/config/trips";
import {
  MediaViewerModal,
  type MediaItem,
} from "@/components/media-viewer-modal";

interface ProvinceDetailSheetProps {
  provinceId: number | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProvinceDetailSheet({
  provinceId,
  isOpen,
  onOpenChange,
}: ProvinceDetailSheetProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  const selectedTrips = React.useMemo(() => {
    return trips.filter((t) => t.provinceId === provinceId);
  }, [provinceId]);

  const provinceName =
    provinceId !== null
      ? PROVINCES_GEO_MAPPING[provinceId as keyof typeof PROVINCES_GEO_MAPPING]
      : "";

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-hidden flex flex-col p-0">
        <SheetHeader className="p-6 pb-2">
          <SheetTitle className="flex items-center gap-2 text-2xl">
            <MapPin className="h-6 w-6 text-primary" />
            {provinceName}
          </SheetTitle>
          <SheetDescription>
            {selectedTrips.length > 0
              ? `Found ${selectedTrips.length} trip${
                  selectedTrips.length > 1 ? "s" : ""
                } in this province.`
              : "No trips recorded for this province yet."}
          </SheetDescription>
        </SheetHeader>

        <Separator />

        <ScrollArea className="flex-1 h-full p-6 pt-4">
          <div className="space-y-8 pb-8">
            {selectedTrips.map((trip) => (
              <div key={trip.id} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">{trip.title}</h3>
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Calendar className="h-3 w-3" />
                      {trip.date}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {trip.summary}
                  </p>
                </div>

                {/* Participants */}
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">With:</span>
                  <div className="flex -space-x-2">
                    {trip.participants.map((p, i) => (
                      <Avatar
                        key={i}
                        className="border-2 border-background w-8 h-8"
                      >
                        <AvatarImage src={p.avatar} alt={p.name} />
                        <AvatarFallback>{p.name[0]}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>

                {/* Images & Videos */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {trip.images.map((img, idx) => (
                    <div
                      key={`img-${idx}`}
                      className="relative aspect-video rounded-md overflow-hidden bg-muted group cursor-pointer"
                      onClick={() =>
                        setSelectedMedia({
                          type: "image",
                          src: img,
                          alt: trip.title,
                          caption: trip.title,
                        })
                      }
                    >
                      <Image
                        src={img}
                        alt={`Trip photo ${idx + 1}`}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  ))}
                  {trip.videos.map((video, idx) => (
                    <div
                      key={`video-${idx}`}
                      className="relative aspect-video rounded-md overflow-hidden bg-muted group cursor-pointer"
                      onClick={() =>
                        setSelectedMedia({
                          type: "video",
                          src: video,
                          caption: trip.title,
                        })
                      }
                    >
                      <video
                        src={video}
                        controls
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                <Separator className="mt-6" />
              </div>
            ))}

            {selectedTrips.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground space-y-4">
                <div className="bg-muted p-4 rounded-full">
                  <ImageIcon className="h-8 w-8 opacity-50" />
                </div>
                <p>We haven&apos;t visited here yet!</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
      <MediaViewerModal
        item={selectedMedia}
        onClose={() => setSelectedMedia(null)}
      />
    </Sheet>
  );
}
