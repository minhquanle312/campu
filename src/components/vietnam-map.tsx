"use client";

import React, { useState, useEffect } from "react";
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    fetch(VIETNAM_GEO_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load map data: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => setGeoData(data))
      .catch((err) => console.error("Failed to load map data", err));
  }, []);

  if (!geoData) {
    return (
      <div className="flex items-center justify-center h-96 text-muted-foreground">
        Loading Map...
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[500px] relative bg-blue-50/30 rounded-xl overflow-hidden border border-border">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 4000,
          center: [106, 16], // Approximate center of Vietnam
        }}
        className="w-full h-full"
      >
        <ZoomableGroup zoom={1}>
          <Geographies geography={geoData}>
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
    </div>
  );
};

export default VietnamMap;
