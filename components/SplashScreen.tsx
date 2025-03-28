import React, { useEffect, useRef } from "react";
import { View, SafeAreaView, Text, StyleSheet, Animated } from "react-native";
import { AntDesign } from "@expo/vector-icons";
  import { LinearGradient } from "expo-linear-gradient";

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Simulate a delay (e.g., loading resources)
    const timer = setTimeout(onFinish, 3000);

    // Animation for the loading circle
    const animate = () => {
      Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();
    };

    animate();

    return () => {
      clearTimeout(timer);
      rotation.stopAnimation();
    };
  }, [onFinish, rotation]);

  const rotationInterpolation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={["#022C22", "#047857"]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.iconWrapper}>
        {/* Animated Background Circle */}
        <Animated.View
          style={[
            styles.backgroundCircle,
            { transform: [{ rotate: rotationInterpolation }] },
          ]}
        />
        {/* Centered Icon */}
        <AntDesign name="tool" size={80} color="white" />
      </View>

      {/* App Name */}
      <Text style={styles.title}>EM Repairing</Text>
      <Text style={styles.subtitle}>Reliable & Quick Repairs</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    transform: [{ scaleX: -1 }], // Flip the icon horizontally
  },
  backgroundCircle: {
    position: "absolute",
    backgroundColor: "rgba(17,127,177,0.4)",
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 8,
    borderColor: "rgba(255, 255, 255, 1)",
    borderStyle: "dashed", // Make the border dashed
  },
  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 16,
    shadowColor: "#FFFFFF",
    borderColor: "#000000",
  },
  subtitle: {
    color: "white",
    fontSize: 16,
    marginTop: 8,
    fontWeight: "semibold",
  },
});

export default SplashScreen;