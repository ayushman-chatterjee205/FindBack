"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { 
  Smartphone, 
  X, 
  RotateCcw, 
  ExternalLink, 
  Compass, 
  Sparkles, 
  Maximize2, 
  Minimize2, 
  Wifi, 
  Battery, 
  Signal, 
  ChevronDown,
  Layers,
  ArrowRight
} from "lucide-react";

interface DevicePreset {
  id: string;
  name: string;
  width: number;
  height: number;
  badge: string;
}

const DEVICE_PRESETS: DevicePreset[] = [
  { id: "iphone-15-pro", name: "iPhone 15 Pro", width: 393, height: 852, badge: "iOS" },
  { id: "pixel-8", name: "Google Pixel 8", width: 412, height: 892, badge: "Android" },
  { id: "compact", name: "Compact / SE", width: 375, height: 667, badge: "Compact" },
];

const DEMO_ROUTES = [
  { label: "Home", path: "/" },
  { label: "Browse Catalog", path: "/browse" },
  { label: "Report Lost", path: "/report-lost" },
  { label: "Report Found", path: "/report-found" },
  { label: "About FindBack", path: "/about" },
  { label: "Meet the Creator", path: "/team" },
  { label: "Campus Safety", path: "/safety" },
  { label: "FAQs", path: "/faqs" },
];

export const MobileSimulator: React.FC = () => {
  const currentPath = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isInsideIframe, setIsInsideIframe] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<DevicePreset>(DEVICE_PRESETS[0]);
  const [isLandscape, setIsLandscape] = useState(false);
  const [scale, setScale] = useState(0.85); // Default comfortable 85% scale for desktop screens
  const [iframeUrl, setIframeUrl] = useState("/");
  const [currentTime, setCurrentTime] = useState("09:41");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 1. Check if running inside an iframe (to prevent infinite nested simulators)
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        if (window.self !== window.top) {
          setIsInsideIframe(true);
        }
      } catch {
        setIsInsideIframe(true);
      }
    }
  }, []);

  // 2. Keep clock live
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // 3. When opening, default iframe to current website pathname
  useEffect(() => {
    if (isOpen) {
      setIframeUrl(currentPath || "/");
    }
  }, [isOpen, currentPath]);

  // 4. Handle Esc key to close simulator & Ctrl+M / Cmd+M to toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle with Ctrl+M or Cmd+M
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "m") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      // Close with Esc
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // 5. Auto-adjust scale based on window height
  useEffect(() => {
    if (!isOpen) return;
    const calculateScale = () => {
      const availableHeight = window.innerHeight - 140; // reserve space for toolbar and padding
      const targetHeight = isLandscape ? selectedDevice.width : selectedDevice.height;
      if (targetHeight > 0) {
        const fittingScale = Math.min(1, Math.max(0.65, availableHeight / targetHeight));
        setScale(Number(fittingScale.toFixed(2)));
      }
    };
    calculateScale();
    window.addEventListener("resize", calculateScale);
    return () => window.removeEventListener("resize", calculateScale);
  }, [isOpen, selectedDevice, isLandscape]);

  // If inside an iframe, never render the simulator
  if (isInsideIframe) {
    return null;
  }

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeUrl;
    }
  };

  const handleRouteChange = (newPath: string) => {
    setIframeUrl(newPath);
    if (iframeRef.current) {
      iframeRef.current.src = newPath;
    }
  };

  const deviceWidth = isLandscape ? selectedDevice.height : selectedDevice.width;
  const deviceHeight = isLandscape ? selectedDevice.width : selectedDevice.height;

  return (
    <>
      {/* Floating Trigger Button (Visible on desktop screens only) */}
      <div className="hidden md:block fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/95 hover:bg-slate-900 text-white backdrop-blur-md border border-slate-700/80 shadow-xl shadow-slate-950/20 hover:shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95"
          title="Open Mobile Simulation View (Ctrl+M)"
        >
          {/* Pulsing indicator */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>

          <Smartphone className="w-4 h-4 text-slate-200 group-hover:text-white transition-colors" />
          <span className="text-xs font-bold tracking-wide">Mobile View</span>

          <span className="px-1.5 py-0.5 rounded-md bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] font-mono font-bold">
            DEMO
          </span>
        </button>
      </div>

      {/* Fullscreen Simulation Stage */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-between p-3 sm:p-5 select-none animate-in fade-in duration-200">
          
          {/* Top Control Toolbar */}
          <header className="w-full max-w-4xl bg-slate-900/95 border border-slate-800 rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-2xl shrink-0">
            
            {/* Left: Device & Badge */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xs font-bold text-white tracking-wide">
                    FindBack Mobile Simulator
                  </h2>
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold">
                    LIVE
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {selectedDevice.name} • {deviceWidth}×{deviceHeight}px ({Math.round(scale * 100)}%)
                </p>
              </div>
            </div>

            {/* Middle: Controls */}
            <div className="flex items-center gap-2">
              {/* Device Selector */}
              <div className="flex items-center rounded-xl bg-slate-800/80 p-0.5 border border-slate-700/60">
                {DEVICE_PRESETS.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDevice(d)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selectedDevice.id === d.id
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {d.name.split(" ")[0]}
                  </button>
                ))}
              </div>

              {/* Quick Route Switcher */}
              <div className="relative group">
                <select
                  value={iframeUrl}
                  onChange={(e) => handleRouteChange(e.target.value)}
                  className="appearance-none bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium rounded-xl pl-3 pr-8 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  {DEMO_ROUTES.map((r) => (
                    <option key={r.path} value={r.path}>
                      Jump: {r.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Reload Button */}
              <button
                onClick={handleRefresh}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 transition-colors"
                title="Reload Page inside Simulator"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Orientation Toggle */}
              <button
                onClick={() => setIsLandscape(!isLandscape)}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition-colors ${
                  isLandscape
                    ? "bg-blue-600 text-white border-blue-500"
                    : "bg-slate-800 text-slate-300 hover:text-white border-slate-700"
                }`}
                title="Toggle Landscape / Portrait"
              >
                {isLandscape ? "Landscape" : "Portrait"}
              </button>
            </div>

            {/* Right: Close button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 border border-slate-700 hover:border-red-500/30 flex items-center justify-center transition-colors"
                title="Close Simulator (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Center Stage: Phone Hardware Mockup */}
          <main className="flex-1 flex items-center justify-center w-full overflow-hidden my-auto py-2">
            <div
              style={{
                transform: `scale(${scale})`,
                transformOrigin: "center center",
                width: `${deviceWidth + 24}px`,
                height: `${deviceHeight + 24}px`,
              }}
              className="relative transition-all duration-300 shrink-0"
            >
              {/* Outer Device Chassis (Titanium Bezel) */}
              <div className="w-full h-full rounded-[52px] bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 p-[12px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.15)] relative">
                
                {/* Side Buttons (Realistic hardware accents) */}
                {/* Volume Buttons (Left) */}
                <div className="absolute -left-[14px] top-28 w-[3px] h-12 bg-slate-700 rounded-l-md shadow-xs" />
                <div className="absolute -left-[14px] top-44 w-[3px] h-12 bg-slate-700 rounded-l-md shadow-xs" />
                {/* Power Button (Right) */}
                <div className="absolute -right-[14px] top-32 w-[3px] h-16 bg-slate-700 rounded-r-md shadow-xs" />

                {/* Inner Screen Bezel */}
                <div className="w-full h-full rounded-[42px] bg-black overflow-hidden relative flex flex-col border border-slate-900/60 shadow-inner">
                  
                  {/* Status Bar */}
                  <div className="h-11 bg-black/95 text-white px-7 flex items-center justify-between text-xs font-semibold shrink-0 z-20 relative select-none">
                    {/* Time */}
                    <span className="font-mono text-[13px] tracking-tight">{currentTime}</span>

                    {/* Dynamic Island Notch */}
                    {!isLandscape && (
                      <div className="w-24 h-6 bg-black rounded-full flex items-center justify-center gap-2 border border-slate-800/80 shadow-sm px-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                          <div className="w-1 h-1 rounded-full bg-blue-900/80" />
                        </div>
                        <div className="w-2 h-2 rounded-full bg-slate-900" />
                      </div>
                    )}

                    {/* Status Icons */}
                    <div className="flex items-center gap-1.5 text-white/90">
                      <Signal className="w-3.5 h-3.5 fill-current" />
                      <Wifi className="w-3.5 h-3.5" />
                      <div className="flex items-center gap-0.5">
                        <span className="text-[10px] font-mono">100%</span>
                        <Battery className="w-4 h-4 fill-current text-emerald-400" />
                      </div>
                    </div>
                  </div>

                  {/* Webview Screen (Live Interactive Iframe) */}
                  <div className="flex-1 w-full bg-[#F4F7FB] relative overflow-hidden">
                    <iframe
                      ref={iframeRef}
                      src={iframeUrl}
                      title="FindBack Mobile Simulation"
                      className="w-full h-full border-0 select-text"
                      sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                    />
                  </div>

                  {/* Bottom Home Indicator Bar */}
                  <div className="h-5 bg-black/95 flex items-center justify-center shrink-0 z-20">
                    <div className="w-32 h-1 bg-white/40 rounded-full" />
                  </div>

                </div>
              </div>
            </div>
          </main>

          {/* Bottom Hint Footer */}
          <footer className="text-center py-1 shrink-0">
            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-2">
              <span>Interactive Mobile Simulation</span>
              <span>•</span>
              <span>Scroll and tap to test mobile features</span>
              <span>•</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">Esc</kbd> to exit
            </p>
          </footer>

        </div>
      )}
    </>
  );
};
