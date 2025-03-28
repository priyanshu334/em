import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useServiceCenters } from "../hooks/useServiceCenters";
import { useServiceProviders } from "../hooks/useServiceProvider";

interface Filters {
  serviceCenter: string | null;
  serviceProvider: string | null;
  selectedDate: Date | null;
  customerSearch: string;
  orderStatus: string | null;
}

interface FilterSectionProps {
  onApplyFilters: (filters: Filters) => void;
  initialFilters: Filters;
}

const FilterSection = ({ onApplyFilters, initialFilters }: FilterSectionProps) => {
  const [serviceCenter, setServiceCenter] = useState<string | null>(initialFilters.serviceCenter);
  const [serviceProvider, setServiceProvider] = useState<string | null>(initialFilters.serviceProvider);
  const [customerSearch, setCustomerSearch] = useState<string>(initialFilters.customerSearch || "");
  const [orderStatus, setOrderStatus] = useState<string | null>(initialFilters.orderStatus);
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialFilters.selectedDate);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(initialFilters.orderStatus ? initialFilters.orderStatus.split(',') : []);

  // State for dialogs
  const [isServiceCenterDialogVisible, setServiceCenterDialogVisible] = useState(false);
  const [isServiceProviderDialogVisible, setServiceProviderDialogVisible] = useState(false);

  const { centers } = useServiceCenters();
  const { providers } = useServiceProviders();

  const toggleFilterVisibility = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const toggleOrderStatus = (status: string) => {
    setSelectedStatuses((prevStatuses) => {
      if (prevStatuses.includes(status)) {
        return prevStatuses.filter((s) => s !== status);
      } else {
        return [...prevStatuses, status];
      }
    });
  };

  const handleApplyFilters = () => {
    onApplyFilters({
      serviceCenter,
      serviceProvider,
      selectedDate,
      customerSearch,
      orderStatus: selectedStatuses.length > 0 ? selectedStatuses.join(",") : null,
    });
    setIsFilterVisible(false);
  };

  const handleResetFilters = () => {
    setServiceCenter(null);
    setServiceProvider(null);
    setSelectedDate(null);
    setCustomerSearch("");
    setSelectedStatuses([]);
    onApplyFilters({
      serviceCenter: null,
      serviceProvider: null,
      selectedDate: null,
      customerSearch: "",
      orderStatus: null,
    });
  };

  // Render item for FlatList in dialogs
  const renderItem = ({ item }: { item: { label: string; value: string } }) => (
    <TouchableOpacity
      style={styles.dialogItem}
      onPress={() => {
        if (isServiceCenterDialogVisible) {
          setServiceCenter(item.value);
        } else if (isServiceProviderDialogVisible) {
          setServiceProvider(item.value);
        }
        setServiceCenterDialogVisible(false);
        setServiceProviderDialogVisible(false);
      }}
    >
      <Text style={styles.dialogItemText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={toggleFilterVisibility}>
        <AntDesign name={isFilterVisible ? "up" : "filter"} size={24} color="#047857" />
        <Text style={styles.headerText}>Filters</Text>
      </TouchableOpacity>

      {isFilterVisible && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            style={styles.filterBox}
            contentContainerStyle={styles.filterContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Service Center Dialog Trigger */}
            <TouchableOpacity
              style={styles.dialogTrigger}
              onPress={() => setServiceCenterDialogVisible(true)}
            >
              <Text style={styles.dialogTriggerText}>
                {serviceCenter || "Select Service Center"}
              </Text>
              <AntDesign name="down" size={16} color="#9CA3AF" />
            </TouchableOpacity>

            {/* Service Provider Dialog Trigger */}
            <TouchableOpacity
              style={styles.dialogTrigger}
              onPress={() => setServiceProviderDialogVisible(true)}
            >
              <Text style={styles.dialogTriggerText}>
                {serviceProvider || "Select Service Provider"}
              </Text>
              <AntDesign name="down" size={16} color="#9CA3AF" />
            </TouchableOpacity>

            {/* Customer Search Input */}
            <TextInput
              placeholder="Enter customer name"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              value={customerSearch}
              onChangeText={setCustomerSearch}
            />

            {/* Date Picker Button */}
            <TouchableOpacity 
              style={styles.dateButton} 
              onPress={() => setShowDatePicker(true)}
            >
              <AntDesign name="calendar" size={20} color="#9CA3AF" />
              <Text style={styles.dateButtonText}>
                {selectedDate ? selectedDate.toDateString() : "Select Date"}
              </Text>
            </TouchableOpacity>

            {/* Date Picker (Android & Windows) */}
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
              />
            )}

            {/* Order Status Buttons */}
            <View style={styles.statusButtonsContainer}>
              {["Pending", "Delivered", "Cancelled", "Repaired"].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusButton,
                    selectedStatuses.includes(status) && styles.statusButtonActive,
                  ]}
                  onPress={() => toggleOrderStatus(status)}
                >
                  <Text style={styles.statusButtonText}>{status}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Footer Buttons */}
            <View style={styles.footer}>
              <TouchableOpacity style={styles.resetButton} onPress={handleResetFilters}>
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}

      {/* Service Center Dialog */}
      <Modal
        visible={isServiceCenterDialogVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setServiceCenterDialogVisible(false)}
      >
        <View style={styles.dialogContainer}>
          <View style={styles.dialogContent}>
            <FlatList
              data={centers.map((center) => ({ label: center.name, value: center.name }))}
              renderItem={renderItem}
              keyExtractor={(item) => item.value}
            />
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setServiceCenterDialogVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Service Provider Dialog */}
      <Modal
        visible={isServiceProviderDialogVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setServiceProviderDialogVisible(false)}
      >
        <View style={styles.dialogContainer}>
          <View style={styles.dialogContent}>
            <FlatList
              data={providers.map((provider) => ({ label: provider.name, value: provider.name }))}
              renderItem={renderItem}
              keyExtractor={(item) => item.value}
            />
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setServiceProviderDialogVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#ECFDF5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#047857",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#047857",
    marginLeft: 8,
  },
  filterBox: {
    marginTop: 8,
    maxHeight: 400,
  },
  filterContent: {
    padding: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingLeft: 8,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  dialogTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 48,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  dialogTriggerText: {
    fontSize: 14,
    color: "#374151",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F0FDF4",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    marginBottom: 16,
  },
  dateButtonText: {
    fontSize: 14,
    color: "#374151",
    marginLeft: 8,
  },
  statusButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    marginHorizontal: 4,
    alignItems: "center",
  },
  statusButtonActive: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "red",
  },
  statusButtonText: {
    fontSize: 14,
    color: "#374151",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resetButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#EF4444",
    borderRadius: 8,
  },
  resetButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  applyButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#047857",
    borderRadius: 8,
  },
  applyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  dialogContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dialogContent: {
    width: "80%",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    maxHeight: "60%",
  },
  dialogItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB",
  },
  dialogItemText: {
    fontSize: 16,
    color: "#374151",
  },
  cancelButton: {
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: "#EF4444",
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FilterSection;