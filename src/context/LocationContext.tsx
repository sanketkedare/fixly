"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface LocationContextType {
  address: string;
  loading: boolean;
  error: string | null;
  refreshLocation: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState("Select Location"); // Removed hardcoded Noida
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Reverse geocoding using a free API (e.g. Nominatim)
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          
          const city = data.address.city || data.address.town || data.address.village || "";
          const suburb = data.address.suburb || data.address.neighbourhood || "";
          
          if (suburb || city) {
            setAddress(`${suburb}${suburb && city ? ", " : ""}${city}`);
          } else {
            setAddress("Location Detected");
          }
          setError(null);
        } catch (err) {
          console.error("Geocoding error:", err);
          setAddress("Unknown Location");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        setError("Location permission denied");
        setLoading(false);
        setAddress("Location Permission Denied");
      }
    );
  };

  // Attempt to detect location automatically on first load
  useEffect(() => {
    refreshLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ address, loading, error, refreshLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
