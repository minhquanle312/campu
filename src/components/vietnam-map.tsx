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
  onProvinceClick: (provinceName: number) => void
  highlightedProvinces?: number[]
}

const VietnamMap: React.FC<VietnamMapProps> = ({
  onProvinceClick,
  highlightedProvinces = [],
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
                const provinceId = geo.properties.id_1
                const isHighlighted = highlightedProvinces.includes(provinceId)

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content={
                      PROVINCES_GEO_MAPPING[
                        provinceId as keyof typeof PROVINCES_GEO_MAPPING
                      ]
                    }
                    onClick={() => onProvinceClick(provinceId)}
                    className={clsx(
                      'transition-all duration-300 outline-hidden cursor-pointer stroke-white stroke-[0.5px]',
                      isHighlighted
                        ? 'fill-primary hover:fill-primary/80'
                        : 'fill-muted-foreground/20 hover:fill-primary/60',
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
