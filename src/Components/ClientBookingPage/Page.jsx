

import React, { useRef, useState } from "react";

const ConstructionMap = ({
  onAreaSelect,
  units = [],
  spaces = [],
  floorPlanImage,
}) => {
  const imageRef = useRef(null);
  const [highlightBox, setHighlightBox] = useState(null);

  const handleAreaClick = (e, coords, area) => {
    e.preventDefault();
    if (area.availability === "available") {
      onAreaSelect(area);
      console.log(area);

      highlightSelectedArea(coords);
    }
  };

  const highlightSelectedArea = (coordsString) => {
    if (!coordsString) return;

    // Ensure coordsString is a string
    const coordsStr = String(coordsString);
    const coords = coordsStr.split(",").map(Number);
    const mapImg = imageRef.current;

    if (!mapImg || coords.length === 0) return;

    const scaleX = mapImg.offsetWidth / mapImg.naturalWidth;
    const scaleY = mapImg.offsetHeight / mapImg.naturalHeight;

    let minX = coords[0],
      maxX = coords[0];
    let minY = coords[1],
      maxY = coords[1];

    for (let i = 0; i < coords.length; i += 2) {
      const x = coords[i];
      const y = coords[i + 1];
      if (x !== undefined && y !== undefined) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }

    const box = {
      left: minX * scaleX,
      top: minY * scaleY,
      width: (maxX - minX) * scaleX,
      height: (maxY - minY) * scaleY,
    };
    setHighlightBox(box);
  };

  return (
    <div className="relative w-full border-2 border-gray-600 rounded overflow-hidden">
      {floorPlanImage ? (
        <>
          <map name="floorPlanMap">
            {units.map((space) => {
              // Extract coordinates - handle different data structures
              let coords =
                space.coordinates?.[space.unitNumber] ||
                (typeof space.coordinates === "string"
                  ? space.coordinates
                  : "") ||
                (Array.isArray(space.coordinates)
                  ? space.coordinates.join(",")
                  : "");

              // Skip if no coordinates found
              if (!coords) {
                console.warn(
                  `No coordinates found for unit ${space.unitNumber}`
                );
                return null;
              }

              // Ensure coords is a string and convert rectangle coords if needed
              coords = String(coords);
              const coordsArray = coords.split(",").map(Number);
              if (coordsArray.length === 4) {
                const [x1, y1, x2, y2] = coordsArray;
                coords = `${x1},${y1},${x2},${y1},${x2},${y2},${x1},${y2}`;
              }
              

              console.log(`Unit ${space.unitNumber} coordinates:`, coords);

              return (
                <area
                  key={space._id}
                  shape="poly"
                  coords={coords}
                  alt={space.unitNumber}
                  onClick={(e) => handleAreaClick(e, coords, space)}
                  style={{
                    cursor:
                      space.availability === "available"
                        ? "pointer"
                        : "not-allowed",
                  }}
                />
              );
            })}
          </map>
          <img
            ref={imageRef}
            src={floorPlanImage}
            alt="Floor Plan"
            useMap="#floorPlanMap"
            className="w-full h-auto"
            onLoad={() => {
              // Clear highlight when image loads/reloads
              setHighlightBox(null);
            }}
          />
        </>
      ) : (
        <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
          No floor plan image available
        </div>
      )}

      {highlightBox && (
        <div
          className="absolute border-4 border-amber-500 bg-amber-300 bg-opacity-20 pointer-events-none z-10"
          style={{
            left: `${highlightBox.left}px`,
            top: `${highlightBox.top}px`,
            width: `${highlightBox.width}px`,
            height: `${highlightBox.height}px`,
          }}
        />
      )}
    </div>
  );
};

export default ConstructionMap;
