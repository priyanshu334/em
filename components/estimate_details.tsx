import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";


type EstimateDetailsProps = {
  onDataChange: (data: {
    repairCost: string;
    advancePaid: string;
    pickupDate: Date | null;
    pickupTime: Date | null;
  }) => void;
  initialData?: {
    repairCost: string;
    advancePaid: string;
    pickupDate: Date | null;
    pickupTime: Date | null;
  };
};

const EstimateDetails: React.FC<EstimateDetailsProps> = ({ onDataChange, initialData }) => {
  const [repairCost, setRepairCost] = useState<string>("");
  const [advancePaid, setAdvancePaid] = useState<string>("");
  const [pickupDate, setPickupDate] = useState<Date | null>(null);
  const [pickupTime, setPickupTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);

  // Initialize form with initial data
  useEffect(() => {
    if (initialData) {
      setRepairCost(initialData.repairCost);
      setAdvancePaid(initialData.advancePaid);
      setPickupDate(initialData.pickupDate ? new Date(initialData.pickupDate) : null);
      setPickupTime(initialData.pickupTime ? new Date(initialData.pickupTime) : null);
    }
  }, [initialData]);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setPickupDate(selectedDate);
      onDataChange({ repairCost, advancePaid, pickupDate: selectedDate, pickupTime });
    }
  };

  const handleTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setPickupTime(selectedTime);
      onDataChange({ repairCost, advancePaid, pickupDate, pickupTime: selectedTime });
    }
  };

  const handleRepairCostChange = (cost: string) => {
    setRepairCost(cost);
    onDataChange({ repairCost: cost, advancePaid, pickupDate, pickupTime });
  };

  const handleAdvancePaidChange = (paid: string) => {
    setAdvancePaid(paid);
    onDataChange({ repairCost, advancePaid: paid, pickupDate, pickupTime });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estimate Details</Text>

      {/* Repair Cost Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Repair Cost</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Repair Cost"
          value={repairCost}
          onChangeText={handleRepairCostChange}
          keyboardType="numeric"
        />
      </View>

      {/* Advance Paid Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Advance Paid</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Advance Paid"
          value={advancePaid}
          onChangeText={handleAdvancePaidChange}
          keyboardType="numeric"
        />
      </View>

      {/* Pickup Date */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Pickup Date</Text>
        <TouchableOpacity
          style={styles.datePicker}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>
            {pickupDate ? pickupDate.toLocaleDateString() : "Select Date"}
          </Text>
          <Ionicons name="calendar-outline" size={24} color="#4B5563" />
        </TouchableOpacity>
        {showDatePicker && (
          <>
            {Platform.OS === "ios" ? (
              <Modal transparent={true} animationType="slide">
                <TouchableWithoutFeedback onPress={() => setShowDatePicker(false)}>
                  <View style={styles.modalOverlay} />
                </TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <DateTimePicker
                    value={pickupDate || new Date()}
                    mode="date"
                    display="inline"
                    onChange={handleDateChange}
                  />
                </View>
              </Modal>
            ) : (
              <DateTimePicker
                value={pickupDate || new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </>
        )}
      </View>

      {/* Pickup Time */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Pickup Time</Text>
        <TouchableOpacity
          style={styles.datePicker}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.dateText}>
            {pickupTime ? pickupTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Select Time"}
          </Text>
          <Ionicons name="time-outline" size={24} color="#4B5563" />
        </TouchableOpacity>
        {showTimePicker && (
          <>
            {Platform.OS === "ios" ? (
              <Modal transparent={true} animationType="slide">
                <TouchableWithoutFeedback onPress={() => setShowTimePicker(false)}>
                  <View style={styles.modalOverlay} />
                </TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <DateTimePicker
                    value={pickupTime || new Date()}
                    mode="time"
                    display="spinner"
                    onChange={handleTimeChange}
                  />
                </View>
              </Modal>
            ) : (
              <DateTimePicker
                value={pickupTime || new Date()}
                mode="time"
                display="default"
                onChange={handleTimeChange}
              />
            )}
          </>
        )}
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
    marginTop: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#047857",
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  datePicker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f9f9f9",
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },
});

export default EstimateDetails;