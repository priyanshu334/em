import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const ServicePage = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Service Options</Text>
      </View>

      {/* Service Center Button */}
      <TouchableOpacity
        style={[styles.button, styles.centerButton]}
        onPress={() => router.push("./service_center")}
      >
        <FontAwesome5 name="building" size={24} color="#fff" />
        <Text style={styles.buttonText}> Service Center</Text>
      </TouchableOpacity>

      {/* Service Provider Button */}
      <TouchableOpacity
        style={[styles.button, styles.providerButton]}
        onPress={() => router.push("./service_providers")}
      >
        <AntDesign name="team" size={24} color="#fff" />
        <Text style={styles.buttonText}>Engineer</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ServicePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0FDF4",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  header: {
    backgroundColor: "#047857",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 40,
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginVertical: 10,
    width: "80%",
  },
  centerButton: {
    backgroundColor: "#388E3C", // Green color for Service Center
  },
  providerButton: {
    backgroundColor: "#1976D2", // Blue color for Service Provider
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 12,
    fontWeight: "bold",
  },
});