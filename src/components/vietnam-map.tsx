'use client'

import React from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import clsx from 'clsx'
import { PROVINCES_GEO_MAPPING } from '@/config/province'

// Using local GeoJSON file
const VIETNAM_GEO_URL = '/vietnam.geojson'

interface VietnamMapProps {
  onProvinceClick: (provinceCode: number) => void
  highlightedProvinces?: number[]
  isProvinceInteractive?: (provinceCode: number) => boolean
  getProvinceTestId?: (provinceCode: number) => string
}

const VietnamMap: React.FC<VietnamMapProps> = ({
  onProvinceClick,
  highlightedProvinces = [],
  isProvinceInteractive,
  getProvinceTestId,
}) => {
  return (
    <>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 2000,
          center: [106, 16], // Approximate center of Vietnam
        }}
        className="w-full h-full"
      >
        <ZoomableGroup zoom={1}>
          <Geographies geography={VIETNAM_GEO_URL}>
            {({ geographies }) =>
              geographies.map(geo => {
                const provinceCode = geo.properties.id_1 as number
                const isHighlighted =
                  highlightedProvinces.includes(provinceCode)
                const interactive = isProvinceInteractive
                  ? isProvinceInteractive(provinceCode)
                  : true

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    data-testid={getProvinceTestId?.(provinceCode)}
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content={
                      PROVINCES_GEO_MAPPING[
                        provinceCode as keyof typeof PROVINCES_GEO_MAPPING
                      ]
                    }
                    onClick={() => {
                      if (!interactive) {
                        return
                      }

                      onProvinceClick(provinceCode)
                    }}
                    className={clsx(
                      'transition-all duration-300 outline-hidden stroke-white stroke-[0.5px]',
                      interactive ? 'cursor-pointer' : 'cursor-not-allowed',
                      isHighlighted
                        ? 'fill-primary hover:fill-primary/80'
                        : interactive
                          ? 'fill-muted-foreground/20 hover:fill-primary/60'
                          : 'fill-muted-foreground/10 opacity-50',
                    )}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none' },
                      pressed: { outline: 'none' },
                    }}
                  />
                )
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      <Tooltip id="my-tooltip" />
    </>
  )
}

export default VietnamMap
