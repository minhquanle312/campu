"use client";

import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import clsx from "clsx";

// Using local GeoJSON file
const VIETNAM_GEO_URL = "/vietnam.geojson";

interface VietnamMapProps {
  onProvinceClick: (provinceName: string) => void;
  highlightedProvinces?: string[];
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
              geographies.map((geo) => {
                const provinceName = geo.properties.Name || geo.properties.name;
                const isHighlighted =
                  highlightedProvinces.includes(provinceName);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content={provinceName}
                    onClick={() => onProvinceClick(provinceName)}
                    className={clsx(
                      "transition-all duration-300 outline-none cursor-pointer stroke-white stroke-[0.5px]",
                      isHighlighted
                        ? "fill-primary hover:fill-primary/80"
                        : "fill-muted-foreground/20 hover:fill-primary/60"
                    )}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none" },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      <Tooltip id="my-tooltip" />
    </>
  );
};

export default VietnamMap;
