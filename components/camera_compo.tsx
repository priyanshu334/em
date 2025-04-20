import React, { useEffect, useState } from "react";
import { CameraView, useCameraPermissions, CameraType, FlashMode } from "expo-camera";
import * as FileSystem from "expo-file-system";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CameraComponentProps {
  onPhotoCaptured: (photoPath: string) => void;
  onClose: () => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ onPhotoCaptured, onClose }) => {
  const [facing, setFacing] = useState<CameraType>("back");
  const [flashMode, setFlashMode] = useState<FlashMode>("off");
  const [cameraRef, setCameraRef] = useState<any>(null);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (!permission || !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  if (!permission || !permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Camera permission is required</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  async function capturePhoto() {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      const filePath = `${FileSystem.documentDirectory}photo_${Date.now()}.jpg`;

      // Save the captured image to the file system
      await FileSystem.moveAsync({ from: photo.uri, to: filePath });

      onPhotoCaptured(filePath);
      onClose(); // Close camera view after capture
    }
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  function toggleFlashMode() {
    setFlashMode((current) =>
      current === "off" ? "on" : current === "on" ? "auto" : "off"
    );
  }

  return (
    <CameraView
      ref={setCameraRef}
      style={styles.camera}
      facing={facing}
      flash={flashMode}
    >
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Flip Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={capturePhoto}>
          <Text style={styles.text}>Take Picture</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.text}>Close</Text>
        </TouchableOpacity>
      </View>
    </CameraView>
  );
};

export default CameraComponent;

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    justifyContent: "space-between",
    margin: 20,
  },
  button: {
    alignSelf: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 10,
    color: "white",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  permissionText: {
    fontSize: 18,
    marginBottom: 10,
  },
});
