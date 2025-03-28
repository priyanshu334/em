import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";

type ReceiverDetailsProps = {
  onNameChange: (name: string) => void;
  onDesignationChange: (designation: string) => void;
  initialName?: string; // Add initial name prop
  initialDesignation?: string; // Add initial designation prop
};

const ReceiverDetails: React.FC<ReceiverDetailsProps> = ({
  onNameChange,
  onDesignationChange,
  initialName = "", // Default to empty string
  initialDesignation = "", // Default to empty string
}) => {
  const [selectedDesignation, setSelectedDesignation] = useState<string>(initialDesignation);
  const [receiverName, setReceiverName] = useState<string>(initialName);

  const handleDesignationSelect = (designation: string) => {
    setSelectedDesignation(designation);
    onDesignationChange(designation);
  };

  const handleNameChange = (name: string) => {
    setReceiverName(name);
    onNameChange(name);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Receiver Details</Text>

      {/* Receiver Name */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Receiver Name</Text>
        <View style={styles.inputWrapper}>

          <TextInput
            placeholder="Enter Receiver Name"
            style={styles.input}
            onChangeText={handleNameChange}
            value={receiverName} // Set value from state
          />
        </View>
      </View>

      {/* Designation Selection */}
      <Text style={styles.label}>Designation</Text>
      <View style={styles.designationContainer}>
        <TouchableOpacity
          onPress={() => handleDesignationSelect("Owner")}
          style={[
            styles.designationButton,
            selectedDesignation === "Owner" ? styles.selectedButton : styles.unselectedButton,
          ]}
        >
          <Text
            style={[
              styles.designationText,
              selectedDesignation === "Owner" ? styles.selectedText : styles.unselectedText,
            ]}
          >
            Owner
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleDesignationSelect("Staff")}
          style={[
            styles.designationButton,
            selectedDesignation === "Staff" ? styles.selectedButton : styles.unselectedButton,
          ]}
        >
          <Text
            style={[
              styles.designationText,
              selectedDesignation === "Staff" ? styles.selectedText : styles.unselectedText,
            ]}
          >
            Staff
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#047857",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,

    fontWeight: "600",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: "#f9f9f9",
  },
  input: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    paddingVertical: 8,
    fontWeight: "400",
    marginLeft: 8,
  },
  designationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  designationButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 4,
  },
  selectedButton: {
    backgroundColor: "#007BFF",
  },
  unselectedButton: {
    backgroundColor: "#E0E0E0",
  },
  designationText: {
    fontSize: 14,
    fontWeight: "600",
  },
  selectedText: {
    color: "white",
  },
  unselectedText: {
    color: "#333",
  },
});

export default ReceiverDetails;