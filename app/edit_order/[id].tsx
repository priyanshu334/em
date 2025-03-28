import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Linking, 
  Alert, 
  StyleSheet,
  ActivityIndicator 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useLocalSearchParams, router } from "expo-router";
import ReceiverDetails from "@/components/Receiver_Details";
import CustomerDetails from "@/components/customer_details";
import OrderDetails from "@/components/order_details";
import EstimateDetails from "@/components/estimate_details";
import RepairPartner from "@/components/repair_partner";
import BottomBar from "@/components/bottom_bar";
import useFormDataStorage from "@/hooks/useFormData";
import DeviceKYCForm from "@/components/DeviceKycForm";

// Define types for the component states
interface Customer {
  name: string;
  number: string;
  address: string;
}

interface OrderDetails {
  deviceModel: string;
  orderStatus: string;
  problems: string[];
}

interface EstimateDetails {
  repairCost: string;
  advancePaid: string;
  pickupDate: Date | null;
  pickupTime: Date | null;
}

interface RepairPartnerDetails {
  selectedRepairStation: "in-house" | "service-center" | null
  selectedInHouseOption: string;
  selectedServiceCenterOption: string;
  pickupDate: Date | null;
  pickupTime: Date | null;
}

interface OrderData {
  id: string;
  name: string;
  designation: string;
  selectedCustomer: Customer | null;
  orderDetails: OrderDetails;
  estimateDetails: EstimateDetails;
  repairPartnerDetails: RepairPartnerDetails;
  deviceKYC: {
    isPowerAdapterChecked: boolean;
    isKeyboardChecked: boolean;
    isMouseChecked: boolean;
    isDeviceOnWarranty: boolean;
    warrantyExpiryDate: string | null;
    cameraData: any;
    otherAccessories: string;
    additionalDetailsList: string[];
    lockCode: string;
  };
}
interface FormData {
  id: string;
  name: string;
  designation: string;
  selectedCustomer: {
    name: string;
    number: string;
    address: string;
  } | null;
  orderDetails: {
    deviceModel: string;
    orderStatus: string;
    problems: string[];
  };
  estimateDetails: {
    repairCost: string;
    advancePaid: string;
    pickupDate: string | null;
    pickupTime: string | null;
  };
  repairPartnerDetails: {
    selectedRepairStation: string | null;
    selectedInHouseOption: string;
    selectedServiceCenterOption: string;
    pickupDate: string | null;
    pickupTime: string | null;
  };
  deviceKYC: {
    isPowerAdapterChecked: boolean;
    isKeyboardChecked: boolean;
    isMouseChecked: boolean;
    isDeviceOnWarranty: boolean;
    warrantyExpiryDate: string | null;
    cameraData: any;
    otherAccessories: string;
    additionalDetailsList: string[];
    lockCode: string;
  };
}


const EditOrder: React.FC = () => {
  const { id } = useLocalSearchParams();
  console.log("Received ID:", id);

  const [loading, setLoading] = useState<boolean>(true);
  const [initialData, setInitialData] = useState<OrderData | null>(null);

  // All state variables
  const [name, setName] = useState<string>("");
  const [designation, setDesignation] = useState<string>("");
  const [isAgreed, setIsAgreed] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    deviceModel: "",
    orderStatus: "Pending",
    problems: [],
  });
  const [estimateDetails, setEstimateDetails] = useState<EstimateDetails>({
    repairCost: "",
    advancePaid: "",
    pickupDate: null,
    pickupTime: null,
  });
  const [repairPartnerDetails, setRepairPartnerDetails] = useState<RepairPartnerDetails>({
    selectedRepairStation: null,
    selectedInHouseOption: "",
    selectedServiceCenterOption: "",
    pickupDate: null,
    pickupTime: null,
  });
  const [deviceKYCDetails, setDeviceKYCDetails] = useState<FormData["deviceKYC"]>({
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

  const {FormData, getFormDataById, updateFormData } = useFormDataStorage();
  
  
  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        Alert.alert("Error", "No order ID found in parameters.");
        return;
      }
  
      try {
        const data = await getFormDataById(id as string) as OrderData | undefined;
  
        if (!data) {
          Alert.alert("Error", "Order not found.");
          router.back();
          return;
        }
  
        setName(data.name || "");
        setDesignation(data.designation || "");
        setSelectedCustomer(data.selectedCustomer || null);
        setOrderDetails(data.orderDetails || { deviceModel: "", orderStatus: "Pending", problems: [] });
        setEstimateDetails(data.estimateDetails || { repairCost: "", advancePaid: "", pickupDate: null, pickupTime: null });
        setRepairPartnerDetails(data.repairPartnerDetails || { selectedRepairStation: null, selectedInHouseOption: "", selectedServiceCenterOption: "", pickupDate: null, pickupTime: null });
        setDeviceKYCDetails(data.deviceKYC || {
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
  
        setIsAgreed(true);
        setInitialData(data);
      } catch (error) {
        console.error("Failed to load order data:", error);
        Alert.alert("Error", "Failed to load order data.");
        router.back();
      } finally {
        setLoading(false);
      }
    };
  
    loadData();
  }, [id]);
  
  const handleSubmit = async () => {
    if (!name || !designation || !orderDetails.deviceModel || !estimateDetails.repairCost || !estimateDetails.advancePaid) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    const updatedData: FormData = {
      id: id as string,
      name,
      designation,
      selectedCustomer,
      orderDetails,
      estimateDetails: {
        ...estimateDetails,
        pickupDate: estimateDetails.pickupDate ? new Date(estimateDetails.pickupDate).toISOString() : null,
        pickupTime: estimateDetails.pickupTime ? new Date(estimateDetails.pickupTime).toISOString() : null,
      },
      repairPartnerDetails: {
        ...repairPartnerDetails,
        pickupDate: repairPartnerDetails.pickupDate ? new Date(repairPartnerDetails.pickupDate).toISOString() : null,
        pickupTime: repairPartnerDetails.pickupTime ? new Date(repairPartnerDetails.pickupTime).toISOString() : null,
      },
      deviceKYC: {
        ...deviceKYCDetails,
        warrantyExpiryDate: deviceKYCDetails.warrantyExpiryDate
          ? new Date(deviceKYCDetails.warrantyExpiryDate).toISOString()
          : null,
      },
    };
    

    try {
      await updateFormData(id as string, updatedData);
      Alert.alert("Success", "Order updated successfully!");
      router.push("/");
    } catch (error) {
      console.error("Error updating order:", error);
      Alert.alert("Error", "Failed to update the order.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#047857" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Order</Text>
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
        <ReceiverDetails onNameChange={setName} onDesignationChange={setDesignation} initialName={name} initialDesignation={designation} />
        <CustomerDetails
  onSearchChange={setSearchTerm}  // ✅ Ensure we pass onSearchChange
  onAdd={(customer) => {
    // ✅ Ensure we handle adding a new customer (if needed)
    console.log("Customer added:", customer);
  }}
  onSelect={setSelectedCustomer}
  initialCustomer={initialData?.selectedCustomer || null}
/>

        <OrderDetails onDataChange={setOrderDetails} initialData={orderDetails} />
        <EstimateDetails onDataChange={setEstimateDetails} initialData={estimateDetails} />
        <DeviceKYCForm onSubmit={setDeviceKYCDetails} initialData={initialData?.deviceKYC}  />
        <RepairPartner onDataChange={setRepairPartnerDetails} initialData={repairPartnerDetails} />
      </ScrollView>

      {/* Terms and Submit */}
      <View style={styles.checkboxContainer}>
        <BouncyCheckbox size={25} fillColor="#34D399" text="I agree to the Terms and Conditions" isChecked={isAgreed} onPress={setIsAgreed} iconStyle={{ borderColor: "#34D399", borderRadius: 4 }} textStyle={styles.checkboxText} />
      </View>

      {isAgreed && (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Update Order</Text>
        </TouchableOpacity>
      )}

      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { flexDirection: "row", alignItems: "center", backgroundColor: "#047857", padding: 16 },
  headerTitle: { flex: 1, textAlign: "center", color: "white", fontSize: 18, fontWeight: "bold" },
  checkboxContainer: { marginVertical: 16, alignItems: "center" },
  checkboxText: { fontSize: 14, color: "#333" },
  submitButton: { backgroundColor: "#34D399", padding: 12, borderRadius: 8, marginBottom: 16, alignItems: "center" },
  submitButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default EditOrder;