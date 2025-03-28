import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";

interface DialogComponentProps {
  onLockCodeSubmit: (lockCode: string) => void; // Callback to pass the lock code to the parent
}

const DialogComponent: React.FC<DialogComponentProps> = ({
  onLockCodeSubmit,
}) => {
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [lockCode, setLockCode] = useState(""); // State to store the lock code

  const openDialog = () => setDialogVisible(true);
  const closeDialog = () => {
    setLockCode(""); // Clear the lock code when dialog is closed
    setDialogVisible(false);
  };

  const handleAdd = () => {
    if (lockCode.trim() === "") {
      alert("Please enter a lock code!");
      return;
    }
    onLockCodeSubmit(lockCode); // Pass the lock code to the parent
    closeDialog();
  };

  return (
    <View style={styles.container}>
      {/* Button to open dialog */}
      <TouchableOpacity style={styles.openButton} onPress={openDialog}>
        <Text style={styles.openButtonText}>Set Lock Code</Text>
      </TouchableOpacity>

      {/* Dialog */}
      <Modal
        visible={isDialogVisible}
        transparent
        animationType="fade"
        onRequestClose={closeDialog}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.dialogBox}>
            <Text style={styles.dialogTitle}>Enter Lock Code</Text>

            {/* Lock Code Input */}
            <TextInput
              style={styles.textInput}
              placeholder="Enter lock code"
              placeholderTextColor="#9CA3AF"
              value={lockCode}
              onChangeText={setLockCode}
              secureTextEntry // Hides input for sensitive data
            />
          
            {/* Action Buttons */}
            <View style={styles.buttonRow}>
              {/* Add Button */}
              <TouchableOpacity style={styles.cancelButton} onPress={closeDialog}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
              {/* Cancel Button */}
             
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DialogComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  openButton: {
    backgroundColor: "teal",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  openButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dialogBox: {
    width: "80%",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 15,
    textAlign: "center",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 20,
    color: "#1F2937",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  addButton: {
    backgroundColor: "#10B981",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: "#EF4444",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});