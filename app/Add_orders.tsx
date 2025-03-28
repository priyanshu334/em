import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import ReceiverDetails from "@/components/Receiver_Details";
import CustomerDetails from "@/components/customer_details";
import OrderDetails from "@/components/order_details";
import EstimateDetails from "@/components/estimate_details";
import RepairPartner from "@/components/repair_partner";
import DeviceKYCForm from "@/components/DeviceKycForm";
import { router } from "expo-router";
import useFormDataStorage from "@/hooks/useFormData";

const Add_orders = () => {
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<{
    name: string;
    number: string;
    address: string;
  } | null>(null);

  const [orderDetails, setOrderDetails] = useState<{
    deviceModel: string;
    orderStatus: string;
    problems: string[];
  }>({
    deviceModel: "",
    orderStatus: "Pending",
    problems: [],
  });

  const [estimateDetails, setEstimateDetails] = useState<{
    repairCost: string;
    advancePaid: string;
    pickupDate: Date | null;
    pickupTime: Date | null;
  }>({
    repairCost: "",
    advancePaid: "",
    pickupDate: null,
    pickupTime: null,
  });

  const [repairPartnerDetails, setRepairPartnerDetails] = useState<{
    selectedRepairStation: string | null;
    selectedInHouseOption: string;
    selectedServiceCenterOption: string;
    pickupDate: Date | null;
    pickupTime: Date | null;
  }>({
    selectedRepairStation: null,
    selectedInHouseOption: "",
    selectedServiceCenterOption: "",
    pickupDate: null,
    pickupTime: null,
  });

  const [deviceKYCDetails, setDeviceKYCDetails] = useState<{
    isPowerAdapterChecked: boolean;
    isKeyboardChecked: boolean;
    isMouseChecked: boolean;
    isDeviceOnWarranty: boolean;
    warrantyExpiryDate: Date | null;
    cameraData: any;
    otherAccessories: string;
    additionalDetailsList: string[];
    lockCode: string;
  }>({
    isPowerAdapterChecked: false,
    isKeyboardChecked: false,
    isMouseChecked: false,
    isDeviceOnWarranty: false,
    warrantyExpiryDate: null,
    cameraData: null,
    otherAccessories: "",
    additionalDetailsList: [],
    lockCode: "",
  });

  const { createFormData } = useFormDataStorage();

  const generateUniqueId = (): string => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    const id = `${timestamp}-${random}`;
    const truncatedId = id.substring(0, 36);
    const validId = truncatedId.replace(/[^a-zA-Z0-9_]/g, "_");
    return validId.startsWith("_") ? validId.substring(1) : validId;
  };

  const handleSubmit = async () => {
    console.log("Submitting data...");
    setIsSubmitting(true);

    if (
      !name ||
      !designation ||
      !orderDetails.deviceModel ||
      !estimateDetails.repairCost ||
      !estimateDetails.advancePaid
    ) {
      Alert.alert("Error", "Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      const formattedEstimateDetails = {
        ...estimateDetails,
        pickupDate: estimateDetails.pickupDate
          ? estimateDetails.pickupDate.toISOString()
          : null,
        pickupTime: estimateDetails.pickupTime
          ? estimateDetails.pickupTime.toISOString()
          : null,
      };

      const formattedRepairPartnerDetails = {
        ...repairPartnerDetails,
        pickupDate: repairPartnerDetails.pickupDate
          ? repairPartnerDetails.pickupDate.toISOString()
          : null,
        pickupTime: repairPartnerDetails.pickupTime
          ? repairPartnerDetails.pickupTime.toISOString()
          : null,
      };

      const formattedDeviceKYCDetails = {
        ...deviceKYCDetails,
        warrantyExpiryDate: deviceKYCDetails.warrantyExpiryDate
          ? deviceKYCDetails.warrantyExpiryDate.toISOString()
          : null,
      };

      const id = generateUniqueId();
      const newData = {
        id: id,
        name,
        designation,
        selectedCustomer,
        orderDetails,
        estimateDetails: formattedEstimateDetails,
        repairPartnerDetails: formattedRepairPartnerDetails,
        deviceKYC: formattedDeviceKYCDetails,
      };

      console.log("New data is:", newData);
      await createFormData(newData);
      
      Alert.alert("Success", "Order added successfully!");
      resetForm();
      router.push("/");
    } catch (error) {
      console.error("Error saving form data:", error);
      Alert.alert("Error", "Failed to save the order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDesignation("");
    setSelectedCustomer(null);
    setOrderDetails({
      deviceModel: "",
      orderStatus: "Pending",
      problems: [],
    });
    setEstimateDetails({
      repairCost: "",
      advancePaid: "",
      pickupDate: null,
      pickupTime: null,
    });
    setRepairPartnerDetails({
      selectedRepairStation: null,
      selectedInHouseOption: "",
      selectedServiceCenterOption: "",
      pickupDate: null,
      pickupTime: null,
    });
    setDeviceKYCDetails({
      isPowerAdapterChecked: false,
      isKeyboardChecked: false,
      isMouseChecked: false,
      isDeviceOnWarranty: false,
      warrantyExpiryDate: null,
      cameraData: null,
      otherAccessories: "",
      additionalDetailsList: [],
      lockCode: "",
    });
    setIsAgreed(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Loading Modal */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={isSubmitting}
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ActivityIndicator size="large" color="#34D399" />
            <Text style={styles.modalText}>Syncing Data</Text>
            <Text style={styles.modalSubText}>Please wait while we process your order</Text>
          </View>
        </View>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Records</Text>
      </View>

      {/* Main Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ReceiverDetails
          onNameChange={setName}
          onDesignationChange={setDesignation}
        />

        <CustomerDetails
          onSearchChange={setSearchTerm}
          onAdd={(customer) => {
            Alert.alert("Success", "New customer added: " + customer.name);
          }}
          onSelect={setSelectedCustomer}
        />

        <OrderDetails onDataChange={setOrderDetails} />

        <EstimateDetails onDataChange={setEstimateDetails} />

        <DeviceKYCForm onSubmit={setDeviceKYCDetails} />

        <RepairPartner onDataChange={setRepairPartnerDetails} />
      </ScrollView>

      {/* Terms Checkbox */}
      <View style={styles.checkboxContainer}>
        <BouncyCheckbox
          size={25}
          fillColor="#34D399"
          text="I agree to the Terms and Conditions"
          isChecked={isAgreed}
          onPress={setIsAgreed}
          iconStyle={{ borderColor: "#34D399", borderRadius: 4 }}
          textStyle={styles.checkboxText}
        />
      </View>

      {/* Submit Button */}
      {isAgreed && (
        <TouchableOpacity 
          style={[
            styles.submitButton,
            isSubmitting && styles.submitButtonDisabled
          ]} 
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#047857",
    padding: 16,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  scrollContent: {
    padding: 16,
  },
  checkboxContainer: {
    marginVertical: 16,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  checkboxText: {
    fontSize: 14,
    color: "#333",
    textDecorationLine: "none",
  },
  submitButton: {
    backgroundColor: "#34D399",
    padding: 16,
    borderRadius: 8,
    margin: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#A7F3D0",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    width: "80%",
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    color: "#1F2937",
  },
  modalSubText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
  },
});

export default Add_orders;