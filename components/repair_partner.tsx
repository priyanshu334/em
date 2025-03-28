import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Linking,
  Alert,
  Modal,
  TouchableWithoutFeedback
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useServiceCenters } from "../hooks/useServiceCenters";
import { useServiceProviders } from "@/hooks/useServiceProvider";

type RepairPartnerProps = {
  onDataChange: (data: {
    selectedRepairStation: "in-house" | "service-center" | null;
    selectedInHouseOption: string;
    selectedServiceCenterOption: string;
    pickupDate: Date | null;
    pickupTime: Date | null;
  }) => void;
  initialData?: {
    selectedRepairStation: "in-house" | "service-center" | null;
    selectedInHouseOption: string;
    selectedServiceCenterOption: string;
    pickupDate: Date | null;
    pickupTime: Date | null;
  };
};

const RepairPartner: React.FC<RepairPartnerProps> = ({ onDataChange, initialData }) => {
  const { centers } = useServiceCenters();
  const { providers } = useServiceProviders();

  const [selectedRepairStation, setSelectedRepairStation] = useState<
    "in-house" | "service-center" | null
  >(initialData?.selectedRepairStation || null);
  const [selectedInHouseOption, setSelectedInHouseOption] = useState(
    initialData?.selectedInHouseOption || ""
  );
  const [selectedServiceCenterOption, setSelectedServiceCenterOption] = useState(
    initialData?.selectedServiceCenterOption || ""
  );
  const [pickupDate, setPickupDate] = useState<Date | null>(initialData?.pickupDate || null);
  const [pickupTime, setPickupTime] = useState<Date | null>(initialData?.pickupTime || null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    onDataChange({
      selectedRepairStation,
      selectedInHouseOption,
      selectedServiceCenterOption,
      pickupDate,
      pickupTime,
    });
  }, [selectedRepairStation, selectedInHouseOption, selectedServiceCenterOption, pickupDate, pickupTime]);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setPickupDate(selectedDate);
    }
  };

  const handleTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setPickupTime(selectedTime);
    }
  };

  const handlePhonePress = () => {
    const phoneUrl = `tel:${selectedServiceCenterOption}`;
    Linking.openURL(phoneUrl).catch(() =>
      Alert.alert("Error", "Phone app could not be opened.")
    );
  };

  const handleMessagePress = () => {
    const messageUrl = `sms:${selectedServiceCenterOption}`;
    Linking.openURL(messageUrl).catch(() =>
      Alert.alert("Error", "Message app could not be opened.")
    );
  };

  const handleWhatsAppPress = () => {
    const whatsappUrl = `whatsapp://send?phone=${selectedServiceCenterOption}`;
    Linking.openURL(whatsappUrl).catch(() =>
      Alert.alert("Error", "WhatsApp is not installed on this device or could not be opened.")
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Receiver Details</Text>

      {/* Select Repair Station */}
      <Text style={styles.subHeader}>Select Repair Station</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.repairStationOption}
          onPress={() => {
            setSelectedRepairStation("in-house");
            setSelectedServiceCenterOption("");
          }}
        >
          <Ionicons
            name={selectedRepairStation === "in-house" ? "checkbox" : "square-outline"}
            size={24}
            color={selectedRepairStation === "in-house" ? "#2563EB" : "#4B5563"}
          />
          <Text style={styles.optionText}>In-house</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.repairStationOption}
          onPress={() => {
            setSelectedRepairStation("service-center");
            setSelectedInHouseOption("");
          }}
        >
          <Ionicons
            name={selectedRepairStation === "service-center" ? "checkbox" : "square-outline"}
            size={24}
            color={selectedRepairStation === "service-center" ? "#2563EB" : "#4B5563"}
          />
          <Text style={styles.optionText}>Service Center</Text>
        </TouchableOpacity>
      </View>

      {/* Conditional Dropdowns */}
      {selectedRepairStation === "in-house" && (
        <View style={styles.dropdownContainer}>
          <Text style={styles.subHeader}>Select Service Provider</Text>
          <Picker
            selectedValue={selectedInHouseOption}
            onValueChange={(itemValue) => setSelectedInHouseOption(itemValue)}
            style={styles.picker}
          >
            {providers.map((provider) => (
              <Picker.Item
                key={provider.id}
                label={provider.name}
                value={provider.name}
              />
            ))}
          </Picker>
        </View>
      )}

      {selectedRepairStation === "service-center" && (
        <View>
          <View style={styles.dropdownContainer}>
            <Text style={styles.subHeader}>Select Service Center</Text>
            <Picker
              selectedValue={selectedServiceCenterOption}
              onValueChange={(itemValue) => setSelectedServiceCenterOption(itemValue)}
              style={styles.picker}
            >
              {centers.map((center) => (
                <Picker.Item
                  key={center.id}
                  label={center.name}
                  value={center.name}
                />
              ))}
            </Picker>
          </View>

          {/* Pickup Date */}
          <View style={styles.datePickerContainer}>
            <Text style={styles.subHeader}>Pickup Date</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.datePickerText}>
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
          <View style={styles.datePickerContainer}>
            <Text style={styles.subHeader}>Pickup Time</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.datePickerText}>
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

          {/* Communication Icons */}
          <View style={styles.iconsContainer}>
            <TouchableOpacity onPress={handlePhonePress}>
              <Ionicons name="call-outline" size={24} color="#2563EB" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleMessagePress}>
              <Ionicons name="chatbubble-outline" size={24} color="#2563EB" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleWhatsAppPress}>
              <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginTop: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#047857",
  },
  subHeader: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    marginBottom: 16,
  },
  repairStationOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  optionText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#4B5563",
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 8,
  },
  datePickerContainer: {
    marginBottom: 16,
  },
  datePickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#F9FAFB",
  },
  datePickerText: {
    fontSize: 16,
    color: "#4B5563",
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
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

export default RepairPartner;