"use client";

import React, { useState, useEffect } from "react";
import { Building2, Layers, MapPin, Edit3, ArrowLeft, HelpCircle } from "lucide-react";

export interface CampusBuildingConfig {
  id: string;
  name: string;
  category: string;
  floors: string[];
}

export const CAMPUS_BUILDING_OPTIONS: CampusBuildingConfig[] = [
  {
    id: "ict-block",
    name: "ICT Block",
    category: "Information & Communication Technology (6 Floors)",
    floors: ["Floor 1", "Floor 2", "Floor 3", "Floor 4", "Floor 5", "Floor 6"],
  },
  {
    id: "cme-block",
    name: "CME Block",
    category: "Civil & Mechanical Engineering (6 Floors)",
    floors: ["Floor 1", "Floor 2", "Floor 3", "Floor 4", "Floor 5", "Floor 6"],
  },
  {
    id: "central-block",
    name: "Central Block",
    category: "Administration & Main Auditorium (6 Floors)",
    floors: ["Floor 1", "Floor 2", "Floor 3", "Floor 4", "Floor 5", "Floor 6"],
  },
  {
    id: "central-library",
    name: "Central Library",
    category: "Reading Halls & Book Stacks (Basement)",
    floors: ["Basement"],
  },
  {
    id: "canteen",
    name: "Campus Canteen",
    category: "Food Court & Student Commons",
    floors: ["Ground Floor (Main Food Court)", "Floor 1 (Mezzanine & Cafe)"],
  },
];

interface LocationPickerProps {
  value: string;
  onChange: (fullLocation: string) => void;
  required?: boolean;
  label?: string;
  helperText?: string;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  value,
  onChange,
  required = true,
  label = "Campus Location",
  helperText = "Select your building and floor, then enter room number or write custom location.",
}) => {
  const [isCustom, setIsCustom] = useState(false);
  const [building, setBuilding] = useState<string>(CAMPUS_BUILDING_OPTIONS[0].name);
  const [floor, setFloor] = useState<string>(CAMPUS_BUILDING_OPTIONS[0].floors[0]);
  const [roomNumber, setRoomNumber] = useState<string>("");
  const [customText, setCustomText] = useState<string>("");

  // Determine available floors for the currently selected building
  const activeBuildingConfig = CAMPUS_BUILDING_OPTIONS.find((b) => b.name === building) || CAMPUS_BUILDING_OPTIONS[0];

  // Whenever building changes, reset floor to the first available floor of that building
  const handleBuildingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "__custom__") {
      setIsCustom(true);
      return;
    }
    setBuilding(val);
    const newConfig = CAMPUS_BUILDING_OPTIONS.find((b) => b.name === val);
    if (newConfig && newConfig.floors.length > 0) {
      setFloor(newConfig.floors[0]);
    }
  };

  // Compile full location string and notify parent
  useEffect(() => {
    if (isCustom) {
      onChange(customText.trim());
    } else {
      const parts = [building, floor];
      if (roomNumber.trim()) {
        parts.push(roomNumber.trim());
      }
      onChange(parts.join(" • "));
    }
  }, [isCustom, building, floor, roomNumber, customText, onChange]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-findback-text">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <button
          type="button"
          onClick={() => {
            setIsCustom(!isCustom);
            if (!isCustom && !customText && roomNumber) {
              setCustomText(`${building}, ${floor}, ${roomNumber}`);
            }
          }}
          className="text-xs text-findback-primary hover:text-findback-primary-hover font-semibold transition-colors flex items-center gap-1"
        >
          {isCustom ? (
            <>
              <ArrowLeft className="w-3 h-3" />
              <span>Use Building / Floor Selector</span>
            </>
          ) : (
            <>
              <Edit3 className="w-3 h-3" />
              <span>Location not listed? Type custom</span>
            </>
          )}
        </button>
      </div>

      {isCustom ? (
        /* Custom Free-form Location Input */
        <div className="space-y-2 animate-in fade-in duration-150">
          <div className="relative">
            <input
              type="text"
              required={required}
              placeholder="e.g. Pathway between ICT and CME Block, Parking Lot Gate 2, Sports Pavilion..."
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-findback-border bg-findback-bg/50 focus:bg-white focus:border-findback-primary focus:ring-1 focus:ring-findback-primary text-sm text-findback-text outline-none transition-all"
            />
            <MapPin className="w-4 h-4 text-findback-accent absolute left-3 top-3" />
          </div>
          <p className="text-[11px] text-findback-muted">
            Enter any specific landmark, outdoor area, or pathway where the item was located.
          </p>
        </div>
      ) : (
        /* Structured Building -> Floor -> Room Input */
        <div className="space-y-3 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 1. Building Selector */}
            <div>
              <span className="block text-[11px] font-medium text-findback-muted mb-1 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-findback-primary" />
                1. Select Building / Block
              </span>
              <select
                value={building}
                onChange={handleBuildingChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-findback-border bg-findback-bg/50 focus:bg-white focus:border-findback-primary focus:ring-1 focus:ring-findback-primary text-sm font-medium text-findback-text outline-none transition-all"
              >
                {CAMPUS_BUILDING_OPTIONS.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
                <option value="__custom__">★ Other / Custom Location (Type yourself)...</option>
              </select>
            </div>

            {/* 2. Floor Selector */}
            <div>
              <span className="block text-[11px] font-medium text-findback-muted mb-1 flex items-center gap-1">
                <Layers className="w-3 h-3 text-findback-accent" />
                2. Select Floor
              </span>
              <select
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-findback-border bg-findback-bg/50 focus:bg-white focus:border-findback-primary focus:ring-1 focus:ring-findback-primary text-sm font-medium text-findback-text outline-none transition-all"
              >
                {activeBuildingConfig.floors.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Room Number Input */}
          <div>
            <span className="block text-[11px] font-medium text-findback-muted mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-findback-primary" />
              3. Room Number / Specific Area (Type yourself)
            </span>
            <input
              type="text"
              placeholder="e.g. Room 304, Lab 2, Lecture Theatre 101, Reading Desk 4..."
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-findback-border bg-findback-bg/50 focus:bg-white focus:border-findback-primary focus:ring-1 focus:ring-findback-primary text-sm text-findback-text outline-none transition-all"
            />
          </div>
        </div>
      )}

      {/* Selected Location Preview Badge */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-findback-sand/60 border border-findback-border/70 text-xs text-findback-text">
        <MapPin className="w-3.5 h-3.5 text-findback-accent shrink-0" />
        <span className="text-findback-muted">Compiled Location:</span>
        <strong className="text-findback-primary font-semibold truncate">
          {isCustom ? (customText.trim() || "Type custom location above") : `${building} • ${floor}${roomNumber.trim() ? ` • ${roomNumber.trim()}` : ""}`}
        </strong>
      </div>

      {helperText && !isCustom && (
        <p className="text-[11px] text-findback-muted">{helperText}</p>
      )}
    </div>
  );
};
