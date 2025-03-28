import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useStoredPatterns } from "../hooks/useStoredPattern"; // Import the custom hook
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient"; // For gradient background

const PatternLock = () => {
  const [pattern, setPattern] = useState<number[]>([]);
  const { storedPatterns, savePattern } = useStoredPatterns(); // Use the hook to get and save patterns
  const savedPattern = [0, 1, 2, 4]; // Predefined pattern for demonstration

  const handlePress = (num: number) => {
    if (!pattern.includes(num)) {
      setPattern((prev) => [...prev, num]);
    }
  };

  const handleSubmit = async () => {
    // Save the current pattern using the custom hook
    await savePattern(pattern);
    setPattern([]); // Reset current pattern
  };

  const resetPattern = () => {
    setPattern([]);
  };

  return (
    <View style={styles.container}>
      {/* Enhanced App Bar */}
      <LinearGradient
        colors={["#388e3c", "#2e7d32"]} // Gradient colors
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>🔒 Pattern Lock</Text>
      </LinearGradient>

      {/* Grid */}
      <View style={styles.grid}>
        {Array.from({ length: 9 }, (_, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.gridBox,
              pattern.includes(i) && styles.selectedGridBox,
            ]}
            onPress={() => handlePress(i)}
          >
            <Text style={styles.gridBoxText}>{i}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Reset Button */}
      <TouchableOpacity style={styles.resetButton} onPress={resetPattern}>
        <Text style={styles.resetButtonText}>Reset Pattern</Text>
      </TouchableOpacity>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Pattern</Text>
      </TouchableOpacity>

      {/* Stored Pattern(s) */}
      <View style={styles.patternContainer}>
        <Text style={styles.patternLabel}>Stored Pattern(s):</Text>
        <Text>{storedPatterns.join(", ")}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8f5e9",
    alignItems: "center",
  },
  header: {
    width: "100%",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  backButton: {
    position: "absolute",
    left: 16,
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 240,
    marginVertical: 16,
    justifyContent: "space-between",
  },
  gridBox: {
    width: 60,
    height: 60,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  selectedGridBox: {
    backgroundColor: "#81c784",
    borderColor: "#388e3c",
    borderWidth: 2,
  },
  gridBoxText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#388e3c",
  },
  submitButton: {
    backgroundColor: "#388e3c",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    elevation: 2, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  resetButton: {
    backgroundColor: "#d32f2f",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    elevation: 2, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  patternContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#f0f4c3",
    borderRadius: 8,
    alignItems: "center",
    width: "80%",
  },
  patternLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#388e3c",
  },
  patternText: {
    fontSize: 14,
    color: "#388e3c",
    fontWeight: "bold",
    marginTop: 5,
  },
});

export default PatternLock;