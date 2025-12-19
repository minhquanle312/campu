'use client'

import React, { useState, useMemo } from 'react'
import VietnamMap from '@/components/vietnam-map'
import { trips } from '@/config/trips'
import { ProvinceDetailSheet } from './_components/province-detail-sheet'
// import { getTrips } from "@/services/trips.service";

export default function JourneyPage() {
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  // const trips = await getTrips();
  // console.log("🚀 ~ page.tsx ~ JourneyPage ~ trips:", trips);

  // Get list of provinces that have trips
  const provincesWithTrips = useMemo(() => {
    return Array.from(new Set(trips.map(t => t.provinceId)))
  }, [])

  const handleProvinceClick = (provinceName: number) => {
    setSelectedProvince(provinceName)
    setIsSheetOpen(true)
  }

  return (
    <main className="container py-8 min-h-screen flex flex-col gap-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-pink-700">
          My Journey Map
        </h1>
        <p className="text-muted-foreground text-pink-700">
          Explore the memories across Vietnam. Click on a highlighted province
          to see the stories.
        </p>
      </div>

      <div className="relative flex-1 w-full">
        <div className="absolute inset-0 rounded-xl border border-border">
          <VietnamMap
            onProvinceClick={handleProvinceClick}
            highlightedProvinces={provincesWithTrips}
          />
        </div>
      </div>

      <ProvinceDetailSheet
        provinceId={selectedProvince}
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />
    </main>
  )
}
