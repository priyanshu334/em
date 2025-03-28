import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { useCameraStorage } from "@/hooks/useCameraImagesStorage"; // Import your custom hook

const Photos: React.FC = () => {
  const { photos } = useCameraStorage(); // Get stored photos
  console.log(photos)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Photos</Text>
      <View style={styles.grid}>
        {photos.map((photo, index) =>
          photo ? (
            <Image key={index} source={{ uri: photo }} style={styles.image} />
          ) : (
            <View key={index} style={styles.placeholder} />
          )
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  image: { width: 100, height: 100, borderRadius: 10 },
  placeholder: {
    width: 100,
    height: 100,
    backgroundColor: "#ddd",
    borderRadius: 10,
  },
});

export default Photos;