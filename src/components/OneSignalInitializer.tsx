"use client";
import { useEffect } from "react";
import { initOneSignal } from "@/lib/oneSignal";

export default function OneSignalInitializer() {
  useEffect(() => {
    initOneSignal();
  }, []);

  return null;
}
