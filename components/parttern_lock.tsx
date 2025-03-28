import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  StyleSheet,
} from "react-native";

const PatternLock = () => {
  const [pattern, setPattern] = useState<number[]>([]);
  const [savedPattern, setSavedPattern] = useState<number[] | null>(null);
  const [isDialogVisible, setDialogVisible] = useState<boolean>(false);

  const handlePress = (num: number) => {
    if (!pattern.includes(num)) {
      setPattern((prev) => [...prev, num]);
    }
  };

  const handleSubmit = () => {
    if (savedPattern && pattern.toString() === savedPattern.toString()) {
      Alert.alert("Pattern Matched!");
    } else {
      Alert.alert("Incorrect Pattern!");
    }
    setPattern([]);
  };

  const openDialog = () => {
    setPattern([]);
    setDialogVisible(true);
  };

  const savePattern = () => {
    if (pattern.length < 4) {
      Alert.alert("Error", "Pattern must be at least 4 points long!");
      return;
    }
    setSavedPattern(pattern);
    setPattern([]);
    setDialogVisible(false);
    Alert.alert("Success", "Pattern saved successfully!");
  };

  const resetPattern = () => {
    setPattern([]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>🔒 Pattern Lock</Text>
      </View>

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

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Pattern</Text>
      </TouchableOpacity>

      {/* Open Dialog Button */}
      <TouchableOpacity style={styles.dialogButton} onPress={openDialog}>
        <Text style={styles.dialogButtonText}>Set New Pattern</Text>
      </TouchableOpacity>

      {/* Saved Pattern Display */}
      {savedPattern && (
        <Text style={styles.savedPattern}>
          Saved Pattern: {savedPattern.join(",")}
        </Text>
      )}

      {/* Pattern Setup Dialog */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isDialogVisible}
        onRequestClose={() => setDialogVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Set New Pattern</Text>

            {/* Pattern Grid */}
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

            {/* Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.resetButton} onPress={resetPattern}>
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={savePattern}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8f5e9",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    width: "100%",
    padding: 16,
    backgroundColor: "#388e3c",
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 200,
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
  },
  selectedGridBox: {
    backgroundColor: "#81c784",
  },
  gridBoxText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#388e3c",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  dialogButton: {
    backgroundColor: "#1976d2",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
  },
  dialogButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  savedPattern: {
    marginTop: 10,
    fontSize: 16,
    color: "#388e3c",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    width: "90%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  resetButton: {
    backgroundColor: "#d32f2f",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#388e3c",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default PatternLock;