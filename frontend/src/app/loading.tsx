import React from "react";
import { CustodyCrateLoader } from "@/components/CustodyCrateLoader";

export default function Loading() {
  return (
    <CustodyCrateLoader
      size="fullscreen"
      label="Reconnecting Belongings..."
      subtext="Synchronizing campus custody vault & verified registries..."
      showProgress={true}
    />
  );
}
