import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Custom hook to get and set stored patterns
export const useStoredPatterns = () => {
  const [storedPatterns, setStoredPatterns] = useState<number[][]>([]);

  useEffect(() => {
    const loadStoredPatterns = async () => {
      try {
        const storedPatternsJson = await AsyncStorage.getItem("patterns");
        if (storedPatternsJson) {
          setStoredPatterns(JSON.parse(storedPatternsJson));
        }
      } catch (error) {
        console.error("Error loading patterns from AsyncStorage", error);
      }
    };
    loadStoredPatterns();
  }, []);

  const savePattern = async (newPattern: number[]) => {
    try {
      const updatedPatterns = [ newPattern];
      await AsyncStorage.setItem("patterns", JSON.stringify(updatedPatterns));
      setStoredPatterns(updatedPatterns); // Update state after saving
    } catch (error) {
      console.error("Error saving patterns to AsyncStorage", error);
    }
  };

  return { storedPatterns, savePattern };
};