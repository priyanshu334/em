import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@service_centers";

// Custom hook to manage service centers in AsyncStorage
export const useServiceCenters = () => {
  const [centers, setCenters] = useState<any[]>([]);

  // Load service centers from AsyncStorage
  useEffect(() => {
    const loadCenters = async () => {
      try {
        const storedCenters = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedCenters) {
          setCenters(JSON.parse(storedCenters));
        }
      } catch (error) {
        console.error("Failed to load service centers:", error);
      }
    };
    loadCenters();
  }, []);

  // Save service centers to AsyncStorage
  useEffect(() => {
    const saveCenters = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(centers));
      } catch (error) {
        console.error("Failed to save service centers:", error);
      }
    };
    saveCenters();
  }, [centers]);

  // Add or update a service center
  const addOrUpdateCenter = (center: any) => {
    const updatedCenters = centers.some((existingCenter) => existingCenter.id === center.id)
      ? centers.map((existingCenter) =>
          existingCenter.id === center.id ? center : existingCenter
        )
      : [...centers, center];
    setCenters(updatedCenters);
  };

  // Delete a service center
  const deleteCenter = (id: string) => {
    setCenters(centers.filter((center) => center.id !== id));
  };

  return { centers, addOrUpdateCenter, deleteCenter };
};