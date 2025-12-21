'use client'

import VietnamMap from '@/components/vietnam-map'
import { ProvinceDetailSheet } from './_components/province-detail-sheet'
import { useState } from 'react'
import { Trip } from '@/models/trips.model'

type Props = {
  trips: Trip[]
}

export default function JourneyClient({ trips }: Props) {
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const provincesWithTrips = Array.from(new Set(trips.map(t => t.provinceId)))

  const handleProvinceClick = (provinceName: number) => {
    setSelectedProvince(provinceName)
    setIsSheetOpen(true)
  }

  return (
    <>
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
        trips={trips}
      />
    </>
  )
}
