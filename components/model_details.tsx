import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Camera } from "expo-camera";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type CameraDialogProps = {
  onImagesChange: (images: (string | null)[]) => void;
};

const CameraDialog: React.FC<CameraDialogProps> = ({ onImagesChange }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [capturedImages, setCapturedImages] = useState<(string | null)[]>([null, null, null, null]);
  const [currentContainer, setCurrentContainer] = useState<number | null>(null);
  const router = useRouter();

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setCameraPermission(status === "granted");
  };

  const openCamera = async (index: number) => {
    setCurrentContainer(index);
    await requestCameraPermission();
    if (cameraPermission) {
      router.push({
        pathname: "/camera_screen",
        params: { containerIndex: index },
      });
    } else {
      alert("Camera permission is required.");
    }
  };

  const handleCapture = (uri: string, index: number) => {
    const updatedImages = [...capturedImages];
    updatedImages[index] = uri;
    setCapturedImages(updatedImages);
    onImagesChange(updatedImages); // Notify the parent of the updated images
    setCurrentContainer(null);
  };

  const closeModal = () => setModalVisible(false);

  const handleSave = () => {
    onImagesChange(capturedImages); // Send the final images to the parent
    alert("Images saved!");
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.openDialogButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.openDialogButtonText}>Model Images</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.dialogBox}>
            <Text style={styles.modalTitle}>Capture Images</Text>

            <View style={styles.imagesContainer}>
              {capturedImages.map((image, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.imageButton}
                  onPress={() => openCamera(index)}
                >
                  {image ? (
                    <Image source={{ uri: image }} style={styles.image} />
                  ) : (
                    <Ionicons name="camera" size={30} color="#888" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Ionicons name="save" size={20} color="white" style={styles.icon} />
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Ionicons name="close" size={20} color="white" style={styles.icon} />
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  openDialogButton: {
    backgroundColor: "#8b5cf6",
    padding: 15,
    borderRadius: 8,
    width: 200,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  openDialogButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  dialogBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#333",
  },
  imagesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  imageButton: {
    width: 80,
    height: 80,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    margin: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#34D399",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    width: "80%",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  closeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f87171",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    width: "80%",
    justifyContent: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  icon: {
    marginRight: 8,
  },
});

export default CameraDialog;