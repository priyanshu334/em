import React, { useRef } from "react";
import {
  View,
  Text,
  Animated,
  Pressable,
  StyleSheet,
  Easing,
} from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

interface BottomBarProps {
  onPhonePress?: () => void;
  onMessagePress?: () => void;
  onWhatsAppPress?: () => void;
  onPrintPress?: () => void;
}

const BottomBar: React.FC<BottomBarProps> = ({
  onPhonePress,
  onMessagePress,
  onWhatsAppPress,
  onPrintPress,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Function to handle animation on press
  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.9,
      duration: 100,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 100,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      {/* Phone Button */}
      <Pressable
        onPress={onPhonePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View
          style={[
            styles.buttonContainer,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <View style={[styles.iconWrapper, { backgroundColor: "#065F46" }]}>
            <AntDesign name="phone" size={28} color="white" />
          </View>
          <Text style={[styles.label, { color: "#065F46" }]}>Phone</Text>
        </Animated.View>
      </Pressable>

      {/* Message Button */}
      <Pressable
        onPress={onMessagePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View
          style={[
            styles.buttonContainer,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <View style={[styles.iconWrapper, { backgroundColor: "#0D9488" }]}>
            <MaterialIcons name="message" size={28} color="white" />
          </View>
          <Text style={[styles.label, { color: "#0D9488" }]}>Message</Text>
        </Animated.View>
      </Pressable>

      {/* WhatsApp Button */}
      <Pressable
        onPress={onWhatsAppPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View
          style={[
            styles.buttonContainer,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <View style={[styles.iconWrapper, { backgroundColor: "#0D9488" }]}>
            <FontAwesome name="whatsapp" size={28} color="white" />
          </View>
          <Text style={[styles.label, { color: "#0D9488" }]}>WhatsApp</Text>
        </Animated.View>
      </Pressable>

      {/* Print Button */}
      <Pressable
        onPress={onPrintPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View
          style={[
            styles.buttonContainer,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <View style={[styles.iconWrapper, { backgroundColor: "#0D9488" }]}>
            <MaterialIcons name="print" size={28} color="white" />
          </View>
          <Text style={[styles.label, { color: "#0D9488" }]}>Print</Text>
        </Animated.View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
    padding: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonContainer: {
    alignItems: "center",
  },
  iconWrapper: {
    padding: 16,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default BottomBar;