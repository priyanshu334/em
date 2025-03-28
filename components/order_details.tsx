import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

type OrderDetailsProps = {
  initialData?: {
    deviceModel: string;
    orderStatus: string;
    problems: string[];
  };
  onDataChange: (data: {
    deviceModel: string;
    orderStatus: string;
    problems: string[];
  }) => void;
};

const OrderDetails: React.FC<OrderDetailsProps> = ({ initialData, onDataChange }) => {
  const [deviceModel, setDeviceModel] = useState<string>(initialData?.deviceModel || "");
  const [orderStatus, setOrderStatus] = useState<string>(initialData?.orderStatus || "Pending");
  const [problemText, setProblemText] = useState<string>("");
  const [problems, setProblems] = useState<string[]>(initialData?.problems || []);

  useEffect(() => {
    if (initialData) {
      setDeviceModel(initialData.deviceModel);
      setOrderStatus(initialData.orderStatus);
      setProblems(initialData.problems);
    }
  }, [initialData]);

  useEffect(() => {
    onDataChange({ deviceModel, orderStatus, problems });
  }, [deviceModel, orderStatus, problems]);

  const handleAddProblem = () => {
    if (!problemText.trim()) {
      alert("Please enter a valid problem description.");
      return;
    }
    setProblems((prev) => [...prev, problemText]);
    setProblemText("");
  };

  const handleDeleteProblem = (index: number) => {
    setProblems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Details</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Enter Device Model</Text>
        <TextInput
          style={styles.input}
          value={deviceModel}
          onChangeText={setDeviceModel}
          placeholder="Enter Device Model"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Order Status</Text>
        <View style={{ borderWidth: 1, backgroundColor: "#f9f9f9", borderRadius: 5, borderColor: "#ccc" }}>
          <Picker selectedValue={orderStatus} onValueChange={setOrderStatus} style={styles.picker}>
            <Picker.Item label="Pending" value="Pending" />
            <Picker.Item label="Cancelled" value="Cancelled" />
            
            <Picker.Item label="Delivered" value="Delivered" />
            <Picker.Item label="Repaired" value="Repaired" />
          </Picker>
        </View>
      </View>

      <View style={styles.problemsContainer}>
        <Text style={styles.problemsTitle}>Added Problems:</Text>
        {problems.length > 0 ? (
          problems.map((item, index) => (
            <View key={index} style={styles.problemItem}>
              <Text style={styles.problemText}>Problem {index + 1}: {item}</Text>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteProblem(index)}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noProblemsText}>No problems added yet.</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Problems List</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={4}
          value={problemText}
          onChangeText={setProblemText}
          placeholder="Describe Problems"
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddProblem}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    backgroundColor: "white", 
    padding: 16, 
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 16 
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 16, color: "#047857" },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: "#f9f9f9" },
  textArea: { height: 48, fontSize: 16, backgroundColor: "#f9f9f9" },
  picker: { fontSize: 16 ,},
  addButton: { backgroundColor: "teal", borderRadius: 8, alignItems: "center", padding: 10, marginTop: 16 },
  addButtonText: { fontSize: 16, fontWeight: "bold", color: "white" },
  problemsContainer: { marginBottom: 20 },
  problemsTitle: { fontSize: 16, fontWeight: "500", marginBottom: 8, marginTop: 10 },
  problemItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#ccc", paddingVertical: 8 },
  problemText: { fontSize: 14, color: "#333", flex: 1 },
  deleteButton: { backgroundColor: "red", borderRadius: 8, paddingVertical: 4, paddingHorizontal: 8, marginLeft: 8 },
  deleteButtonText: { color: "white", fontSize: 12, fontWeight: "bold" },
  noProblemsText: { fontSize: 14, color: "#666" },
});

export default OrderDetails;