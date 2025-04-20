import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  Linking
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";
import { databases, DATABASE_ID, COLLECTION_ID } from "@/appwriteConfig";
import { Models } from "appwrite";
import BottomBar from "@/components/bottom_bar";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { useAppwriteFormData } from "@/hooks/useAppwriteFormData";

interface OrderData {
  id: string;
  name: string;
  designation: string;
  selectedCustomer: { name: string; number: string; address: string } | null;
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
    cameraData: string[];
    otherAccessories: string;
    additionalDetailsList: string[];
    lockCode: string;
  };
}

const ViewOrders = () => {
  const { id } = useLocalSearchParams();
  const [orderData, setOrderData] = useState<any | null>(null);
  const phoneNumber = orderData?.selectedCustomer?.number || "";

  const { getFormDataById, deleteFormData } = useAppwriteFormData();

  // Format date to readable format (e.g., "Jan 15, 2023")
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format time to readable format (e.g., "2:30 PM")
  const formatTime = (timeString: string | null): string => {
    if (!timeString) return "N/A";
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours));
    date.setMinutes(parseInt(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Format warranty expiry date if exists
  const formatWarrantyDate = (dateString: string | null): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handlePhonePress = () => {
    const phoneUrl = `tel:${phoneNumber}`;
    Linking.openURL(phoneUrl).catch(() =>
      Alert.alert("Error", "Phone app could not be opened.")
    );
  };

  const RhandlePhonePress = () => {
    const phoneUrl = `tel:${phoneNumber}`;
    Linking.openURL(phoneUrl).catch(() =>
      Alert.alert("Error", "Phone app could not be opened.")
    );
  };

  const generateMessageText = () => {
    if (!orderData) return "No order details available.";

    return `
📌 *Computer Empire - Order Update* 📌
👤 *Receiver:* ${orderData.name}
💼 *Designation:* ${orderData.designation}
${orderData.selectedCustomer ? `
👤 *Customer:* ${orderData.selectedCustomer.name}
📞 *Contact:* ${orderData.selectedCustomer.number}
📍 *Address:* ${orderData.selectedCustomer.address}
` : ""}
📱 *Device Model:* ${orderData.orderDetails.deviceModel}
📦 *Order Status:* ${orderData.orderDetails.orderStatus}
🔧 *Problems:* ${orderData.orderDetails.problems.join(", ")}
💰 *Estimated Repair Cost:* ₹${orderData.estimateDetails.repairCost}
💵 *Advance Paid:* ₹${orderData.estimateDetails.advancePaid}
📅 *Pickup Date:* ${formatDate(orderData.estimateDetails.pickupDate)}
⏰ *Pickup Time:* ${formatTime(orderData.estimateDetails.pickupTime)}
🏢 *Repair Partner:* ${orderData.repairPartnerDetails.selectedRepairStation || "N/A"}
🏠 *In-House Option:* ${orderData.repairPartnerDetails.selectedInHouseOption || "N/A"}
🏬 *Service Center:* ${orderData.repairPartnerDetails.selectedServiceCenterOption || "N/A"}
📅 *Repair Pickup Date:* ${formatDate(orderData.repairPartnerDetails.pickupDate)}
⏰ *Repair Pickup Time:* ${formatTime(orderData.repairPartnerDetails.pickupTime)}

📞 For any queries, please contact us.
    `.trim();
  };

  const handleMessagePress = () => {
    const messageText = generateMessageText();
    const messageUrl = `sms:${phoneNumber}?body=${encodeURIComponent(messageText)}`;
    
    Linking.openURL(messageUrl).catch(() =>
      Alert.alert("Error", "Message app could not be opened.")
    );
  };

  const RhandleMessagePress = () => {
    const messageText = generateMessageText();
    const messageUrl = `sms:${phoneNumber}?body=${encodeURIComponent(messageText)}`;
    
    Linking.openURL(messageUrl).catch(() =>
      Alert.alert("Error", "Message app could not be opened.")
    );
  };

  const handleWhatsAppPress = () => {
    const messageText = generateMessageText();
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(messageText)}`;
  
    Linking.openURL(whatsappUrl).catch(() =>
      Alert.alert("Error", "WhatsApp is not installed or could not be opened.")
    );
  };

  const RhandleWhatsAppPress = () => {
    const messageText = generateMessageText();
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(messageText)}`;
  
    Linking.openURL(whatsappUrl).catch(() =>
      Alert.alert("Error", "WhatsApp is not installed or could not be opened.")
    );
  };

  const handlePrintPress = async () => {
    if (!orderData) {
      Alert.alert("Error", "No order data available to print.");
      return;
    }

    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { color: #047857; text-align: center; }
            .section { margin-bottom: 20px; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
            .title { font-weight: bold; margin-bottom: 5px; font-size: 16px; }
            .text { margin-bottom: 5px; font-size: 14px; }
            ul { padding-left: 20px; }
          </style>
        </head>
        <body>
          <h2>🖨 Computer Empire - Order Receipt</h2>

          <div class="section">
            <div class="title">Receiver Details</div>
            <div class="text">👤 Name: ${orderData.name}</div>
            <div class="text">💼 Designation: ${orderData.designation}</div>
          </div>

          ${orderData.selectedCustomer ? `
            <div class="section">
              <div class="title">Customer Details</div>
              <div class="text">👤 Name: ${orderData.selectedCustomer.name}</div>
              <div class="text">📞 Number: ${orderData.selectedCustomer.number}</div>
              <div class="text">📍 Address: ${orderData.selectedCustomer.address}</div>
            </div>
          ` : ""}

          <div class="section">
            <div class="title">Order Details</div>
            <div class="text">📱 Device Model: ${orderData.orderDetails.deviceModel}</div>
            <div class="text">📦 Order Status: ${orderData.orderDetails.orderStatus}</div>
            <div class="text">🔧 Problems:</div>
            <ul>
              ${orderData.orderDetails.problems.map((problem: string) => `<li>${problem}</li>`).join("")}
            </ul>
          </div>

          <div class="section">
            <div class="title">Estimate Details</div>
            <div class="text">💰 Repair Cost: ₹${orderData.estimateDetails.repairCost}</div>
            <div class="text">💵 Advance Paid: ₹${orderData.estimateDetails.advancePaid}</div>
            <div class="text">📅 Pickup Date: ${formatDate(orderData.estimateDetails.pickupDate)}</div>
            <div class="text">⏰ Pickup Time: ${formatTime(orderData.estimateDetails.pickupTime)}</div>
          </div>

          <div class="section">
            <div class="title">Repair Partner Details</div>
            <div class="text">🏢 Repair Station: ${orderData.repairPartnerDetails.selectedRepairStation || "N/A"}</div>
            <div class="text">🏠 In-House Option: ${orderData.repairPartnerDetails.selectedInHouseOption || "N/A"}</div>
            <div class="text">🏬 Service Center: ${orderData.repairPartnerDetails.selectedServiceCenterOption || "N/A"}</div>
            <div class="text">📅 Pickup Date: ${formatDate(orderData.repairPartnerDetails.pickupDate)}</div>
            <div class="text">⏰ Pickup Time: ${formatTime(orderData.repairPartnerDetails.pickupTime)}</div>
          </div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await shareAsync(uri, { mimeType: "application/pdf" });
    } catch (error) {
      console.error("Print Error:", error);
      Alert.alert("Error", "Failed to generate or share PDF.");
    }
  };

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        const data = await getFormDataById(id as string);
        if (data) setOrderData(data);
        else Alert.alert("Error", "Order not found.");
      };
      fetchData();
    }
  }, [id]);

  if (!orderData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Loading order details...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
         <TouchableOpacity >
                      <AntDesign name="book" size={22} color="#fff" />
                    </TouchableOpacity>
                  
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Receiver Details</Text>
          <Text style={styles.text}>👤 Name: {orderData.name}</Text>
          <Text style={styles.text}>💼 Designation: {orderData.designation}</Text>
        </View>

        {orderData.selectedCustomer && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer Details</Text>
            <Text style={styles.text}>👤 Name: {orderData.selectedCustomer.name}</Text>
            <Text style={styles.text}>📞 Number: {orderData.selectedCustomer.number}</Text>
            <Text style={styles.text}>📍 Address: {orderData.selectedCustomer.address}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Details</Text>
          <Text style={styles.text}>📱 Device Model: {orderData.orderDetails.deviceModel}</Text>
          <Text style={styles.text}>📦 Order Status: {orderData.orderDetails.orderStatus}</Text>
          <Text style={styles.text}>🔧 Problems:</Text>
          {orderData.orderDetails.problems.length > 0 ? (
            orderData.orderDetails.problems.map((problem: string, index: number) => (
              <Text key={index} style={styles.listItem}>• {problem}</Text>
            ))
          ) : (
            <Text style={styles.text}>No problems listed.</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estimate Details</Text>
          <Text style={styles.text}>💰 Repair Cost: ₹{orderData.estimateDetails.repairCost}</Text>
          <Text style={styles.text}>💵 Advance Paid: ₹{orderData.estimateDetails.advancePaid}</Text>
          <Text style={styles.text}>📅 Pickup Date: {formatDate(orderData.estimateDetails.pickupDate)}</Text>
          <Text style={styles.text}>⏰ Pickup Time: {formatTime(orderData.estimateDetails.pickupTime)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Repair Partner Details</Text>
          <Text style={styles.text}>🏢 Repair Station: {orderData.repairPartnerDetails.selectedRepairStation || "N/A"}</Text>
          <Text style={styles.text}>🏠 In-House Option: {orderData.repairPartnerDetails.selectedInHouseOption || "N/A"}</Text>
          <Text style={styles.text}>🏬 Service Center Option: {orderData.repairPartnerDetails.selectedServiceCenterOption || "N/A"}</Text>
          <Text style={styles.text}>📅 Pickup Date: {formatDate(orderData.repairPartnerDetails.pickupDate)}</Text>
          <Text style={styles.text}>⏰ Pickup Time: {formatTime(orderData.repairPartnerDetails.pickupTime)}</Text>
          <View style={styles.iconsContainer}>
            <TouchableOpacity onPress={RhandlePhonePress}>
              <Ionicons name="call-outline" size={32} color="#4B5563" />
            </TouchableOpacity>
            <TouchableOpacity onPress={RhandleMessagePress}>
              <Ionicons name="chatbox-outline" size={32} color="#4B5563" />
            </TouchableOpacity>
            <TouchableOpacity onPress={RhandleWhatsAppPress}>
              <Ionicons name="logo-whatsapp" size={32} color="#4B5563" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Device KYC Details</Text>
          <Text style={styles.text}>🔌 Power Adapter: {orderData.deviceKYC.isPowerAdapterChecked ? "✅ Checked" : "❌ Not Checked"}</Text>
          <Text style={styles.text}>⌨️ Keyboard: {orderData.deviceKYC.isKeyboardChecked ? "✅ Checked" : "❌ Not Checked"}</Text>
          <Text style={styles.text}>🖱 Mouse: {orderData.deviceKYC.isMouseChecked ? "✅ Checked" : "❌ Not Checked"}</Text>
          <Text style={styles.text}>🛡 Device on Warranty: {orderData.deviceKYC.isDeviceOnWarranty ? "✅ Yes" : "❌ No"}</Text>
          {orderData.deviceKYC.isDeviceOnWarranty && (
            <Text style={styles.text}>📅 Warranty Expiry: {formatWarrantyDate(orderData.deviceKYC.warrantyExpiryDate)}</Text>
          )}
          <Text style={styles.text}>🎒 Other Accessories: {orderData.deviceKYC.otherAccessories || "N/A"}</Text>
          <Text style={styles.text}>📝 Additional Details: {orderData.deviceKYC.additionalDetailsList.length > 0 ? orderData.deviceKYC.additionalDetailsList.join(", ") : "N/A"}</Text>
          <Text style={styles.text}>🔒 Lock Code: {orderData.deviceKYC.lockCode || "N/A"}</Text>

          {/* Load and display images */}
          {orderData.deviceKYC.cameraData.length > 0 ? (
            <ScrollView horizontal style={styles.imageContainer}>
              {orderData.deviceKYC.cameraData.map((imageUri: string, index: number) => (
                <Image
                  key={index}
                  source={{ uri: imageUri }}
                  style={styles.image}
                />
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.text}>📷 No images available.</Text>
          )}
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <BottomBar
        onPhonePress={handlePhonePress}
        onMessagePress={handleMessagePress}
        onWhatsAppPress={handleWhatsAppPress}
        onPrintPress={handlePrintPress}
      />
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
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#047857",
    padding: 16,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  scrollContainer: {
    padding: 16,
  },
  section: {
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#047857",
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
    color: "#333",
  },
  listItem: {
    fontSize: 14,
    marginLeft: 10,
    color: "#333",
  },
  errorText: {
    textAlign: "center",
    fontSize: 14,
    marginTop: 20,
    color: "red",
  },
  imageContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
});

export default ViewOrders;