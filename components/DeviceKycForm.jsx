import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Platform,
  Image,
  Modal,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import DateTimePicker from "@react-native-community/datetimepicker";
import DialogComponent from "./lock_code";
import { router, useRouter } from "expo-router";
import CameraComponent from "./camera_compo"; // Ensure this component is properly implemented

const DeviceKYCForm = ({ onSubmit, initialData }) => {
  // Default form data
  const defaultFormData = {
    isPowerAdapterChecked: false,
    isKeyboardChecked: false,
    isMouseChecked: false,
    isDeviceOnWarranty: false,
    warrantyExpiryDate: null,
    cameraData: [null, null, null, null], // Array for 4 camera slots
    otherAccessories: "",
    additionalDetailsList: [],
    lockCode: "",
    patternLock: "",
  };

  // State for form data
  const [formData, setFormData] = useState({
    ...defaultFormData,
    ...initialData,
    warrantyExpiryDate: initialData?.warrantyExpiryDate
      ? new Date(initialData.warrantyExpiryDate)
      : null,
    cameraData: initialData?.cameraData || [null, null, null, null],
  });

  // State for camera modal
  const [showCameraIndex, setShowCameraIndex] = useState(null);

  // State for date picker
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Update parent component when form data changes
  useEffect(() => {
    onSubmit?.(formData);
  }, [formData, onSubmit]);

  // Handle photo capture
  const handlePhotoCaptured = (photoPath) => {
    const updatedPhotos = [...formData.cameraData];
    updatedPhotos[showCameraIndex] = photoPath;
    setFormData((prev) => ({
      ...prev,
      cameraData: updatedPhotos,
    }));
    setShowCameraIndex(null); // Close the camera modal after capturing
  };

  // Handle lock code submission
  const handleLockCodeSubmit = (code) => {
    setFormData((prev) => ({
      ...prev,
      lockCode: code,
    }));
  };

  // Handle pattern lock submission
  const handlePatternLockSubmit = (pattern) => {
    setFormData((prev) => ({
      ...prev,
      patternLock: pattern,
    }));
  };

  // Handle adding an accessory
  const handleAddAccessory = () => {
    if (formData.otherAccessories.trim()) {
      setFormData((prev) => ({
        ...prev,
        additionalDetailsList: [
          ...prev.additionalDetailsList,
          prev.otherAccessories.trim(),
        ],
        otherAccessories: "",
      }));
    }
  };

  // Handle deleting an accessory
  const handleDeleteAccessory = (index) => {
    setFormData((prev) => ({
      ...prev,
      additionalDetailsList: prev.additionalDetailsList.filter((_, i) => i !== index),
    }));
  };

  // Handle warranty checkbox
  const handleWarrantyCheck = (checked) => {
    setFormData((prev) => ({
      ...prev,
      isDeviceOnWarranty: checked,
      warrantyExpiryDate: checked ? prev.warrantyExpiryDate : null,
    }));
    setShowDatePicker(checked);
  };

  // Handle date change for warranty expiry
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setFormData((prev) => ({
        ...prev,
        warrantyExpiryDate: selectedDate,
      }));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Device KYC Form</Text>

      {/* Camera Grid */}
      <View style={styles.gridContainer}>
        {[0, 1, 2, 3].map((index) => (
          <View key={index} style={styles.gridItem}>
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={() => setShowCameraIndex(index)}
            >
              <Text style={styles.cameraButtonText}>Camera {index + 1}</Text>
            </TouchableOpacity>
            {formData.cameraData[index] && (
              <Image
                source={{ uri: formData.cameraData[index] }}
                style={styles.previewImage}
              />
            )}
          </View>
        ))}
      </View>

      {/* Camera Modal */}
      <Modal
        visible={showCameraIndex !== null}
        animationType="slide"
        transparent={false}
      >
        <View style={styles.cameraModalContainer}>
          <CameraComponent
            onPhotoCaptured={handlePhotoCaptured}
            onClose={() => setShowCameraIndex(null)}
          />
        </View>
      </Modal>

      {/* Lock Code Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lock Code</Text>
        <DialogComponent onLockCodeSubmit={handleLockCodeSubmit} />
        <Text style={styles.lockCodeText}>
          Lock Code: {formData.lockCode || "Not Set"}
        </Text>
      </View>

      {/* Pattern Lock Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pattern Lock</Text>
        <TouchableOpacity
          style={styles.patternLockButton}
          onPress={() => router.push("/PatternLock")}
        >
          <Text style={styles.patternLockButtonText}>
            {formData.patternLock ? "Change Pattern Lock" : "Set Pattern Lock"}
          </Text>
        </TouchableOpacity>
        <Text style={styles.patternLockStatus}>
          {formData.patternLock ? "Pattern Lock Set" : "No Pattern Lock Set"}
        </Text>
      </View>

      {/* Accessories List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Accessories List</Text>
        <View style={styles.checkboxGroup}>
          <BouncyCheckbox
            size={25}
            fillColor="#34D399"
            text="Power Adapter"
            isChecked={formData.isPowerAdapterChecked}
            onPress={(checked) =>
              setFormData((prev) => ({ ...prev, isPowerAdapterChecked: checked }))
            }
          />
          <BouncyCheckbox
            size={25}
            fillColor="#34D399"
            text="Keyboard"
            isChecked={formData.isKeyboardChecked}
            onPress={(checked) =>
              setFormData((prev) => ({ ...prev, isKeyboardChecked: checked }))
            }
          />
          <BouncyCheckbox
            size={25}
            fillColor="#34D399"
            text="Mouse"
            isChecked={formData.isMouseChecked}
            onPress={(checked) =>
              setFormData((prev) => ({ ...prev, isMouseChecked: checked }))
            }
          />
        </View>
      </View>

      {/* Additional Accessories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Accessories</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter accessory name"
            value={formData.otherAccessories}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, otherAccessories: text }))
            }
            onSubmitEditing={handleAddAccessory}
            returnKeyType="done"
          />
          <TouchableOpacity onPress={handleAddAccessory}>
            <AntDesign name="plus" size={20} color="#000" />
          </TouchableOpacity>
        </View>
        {formData.additionalDetailsList.map((detail, index) => (
          <View key={index} style={styles.accessoryItem}>
            <Text style={styles.accessoryText}>{detail}</Text>
            <TouchableOpacity onPress={() => handleDeleteAccessory(index)}>
              <AntDesign name="delete" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Warranty Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Warranty</Text>
        <BouncyCheckbox
          size={25}
          fillColor="#34D399"
          text="Device on Warranty"
          isChecked={formData.isDeviceOnWarranty}
          onPress={handleWarrantyCheck}
        />
        {formData.isDeviceOnWarranty && (
          <View style={styles.datePickerContainer}>
            <Text style={styles.dateLabel}>Warranty Expiry Date:</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Text style={styles.dateText}>
                {formData.warrantyExpiryDate
                  ? formData.warrantyExpiryDate.toDateString()
                  : "Select Date"}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={formData.warrantyExpiryDate || new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
    marginTop:16,
    marginHorizontal:1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#047857",
   
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  gridItem: {
    width: "48%",
    marginBottom:13,
  },
  cameraButton: {
    backgroundColor: "#34D399",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cameraButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  previewImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginTop: 8,
  },
  cameraModalContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#047857",
  },
  checkboxGroup: {
    marginVertical: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 2,
    backgroundColor: "#F9FAFB",
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#374151",
    paddingVertical:10,
  },
  accessoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    marginTop: 4,
  },
  accessoryText: {
    fontSize: 16,
    color: "#374151",
  },
  datePickerContainer: {
    marginTop: 12,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  dateText: {
    fontSize: 16,
    color: "#047857",
  },
  lockCodeText: {
    fontSize: 16,
    color: "#EF4444",
    marginTop: 4,
  },
  patternLockButton: {
    backgroundColor: "#34D399",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 4,
  },
  patternLockButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  patternLockStatus: {
    fontSize: 16,
    color: "#047857",
    marginTop: 8,
  },
});

export default DeviceKYCForm;