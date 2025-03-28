import React, { useState, useEffect, useMemo } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import DataCard from "@/components/DataCard";
import FilterComponent from "@/components/filter_section";
import { useAppwriteFormData } from "@/hooks/useAppwriteFormData";  // Import the Appwrite hook
import { Models } from "appwrite";

// Type definition for the filter structure
interface Filters {
    serviceCenter: string | null;
    serviceProvider: string | null;
    selectedDate: Date | null;
    customerSearch: string; // Ensuring it is always a string
    orderStatus: string | null; // New filter for order status
  }

export default function Index() {
  const router = useRouter();
  const { createFormData, getAllFormData, deleteFormData } = useAppwriteFormData();

  // State for form data and filters
  const [formDataList, setFormDataList] = useState<Models.Document[]>([]);
   const [filters, setFilters] = useState<Filters>({
      serviceCenter: null,
      serviceProvider: null,
      selectedDate: null,
      customerSearch: "", // Ensuring a default empty string
      orderStatus: null, // Initialize order status filter
    });

  // Fetch all form data on component mount
  useEffect(() => {
    fetchFormData();
  }, []);

  const fetchFormData = async () => {
    try {
      const data = await getAllFormData();
      setFormDataList(data); // data is always an array, even if empty
    } catch (error) {
      console.error("Error fetching form data:", error);
    }
  };

  // Memoized filtered data to prevent unnecessary re-renders
  const filteredData = useMemo(() => {
    return formDataList.filter((data) => {
      const matchesServiceCenter = filters.serviceCenter
        ? data.repairPartnerDetails.selectedServiceCenterOption === filters.serviceCenter
        : true;

      const matchesServiceProvider = filters.serviceProvider
        ? data.repairPartnerDetails.selectedInHouseOption === filters.serviceProvider
        : true;

      const matchesDate = filters.selectedDate
        ? data.estimateDetails.pickupDate &&
          new Date(data.estimateDetails.pickupDate).toDateString() ===
            filters.selectedDate.toDateString()
        : true;

      const matchesCustomerSearch = filters.customerSearch
        ? data.selectedCustomer?.name.toLowerCase().includes(filters.customerSearch.toLowerCase()) ||
          data.selectedCustomer?.number.includes(filters.customerSearch)
        : true;

        const matchesOrderStatus = filters.orderStatus?.length
        ? filters.orderStatus.includes(data.orderDetails.orderStatus)
        : true;

        return (
            matchesServiceCenter &&
            matchesServiceProvider &&
            matchesDate &&
            matchesCustomerSearch &&
            matchesOrderStatus
          );
    });
  }, [formDataList, filters]);

  // Format the date, return 'N/A' if null
  const formatDate = (date: string | null): string => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Edit the selected record
  const handleEdit = (id: string) => {
    router.push(`./all_orders_edit/${id}`);
  };

  const handleView = (id: string) => {
    router.push(`./all_orders_view/${id}`);
  };

  // Delete the selected record
  const handleDelete = async (id: string) => {
    try {
      await deleteFormData(id);
      fetchFormData(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting form data:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <AntDesign name="arrowleft" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>All Records</Text>
          <View style={styles.rightButtons}>
                      <TouchableOpacity>
                        <AntDesign name="arrowdown" size={22} color="#fff" />
                      </TouchableOpacity>
                   
                    </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
          {/* Filter Component */}
          <FilterComponent onApplyFilters={setFilters} initialFilters={filters} />

          {/* No records message */}
          {filteredData.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No records found.</Text>
            </View>
          ) : (
            filteredData.map((data) => (
              <DataCard
                key={data.$id} // Use Appwrite's document ID
                imageUrl={data.deviceKYC?.cameraData[0]}
                orderStatus={data.orderDetails.orderStatus}
                orderModel={data.orderDetails.deviceModel}
                customerName={data.selectedCustomer?.name || "N/A"}
                customerNumber={data.selectedCustomer?.number || "N/A"}
                date={formatDate(data.estimateDetails.pickupDate)}
                onEdit={() => handleEdit(data.$id)}
                onView={() => handleView(data.$id)}
                onDelete={() => handleDelete(data.$id)}
              />
            ))
          )}
        </ScrollView>

        {/* Bottom Navigation Bar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity onPress={() => router.push("/service")} style={styles.navButton}>
            <AntDesign name="home" size={24} color="#fff" />
            <Text style={styles.navText}>Centers</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/Add_orders")} style={styles.navButton}>
            <AntDesign name="filetext1" size={24} color="#fff" />
            <Text style={styles.navText}>Add Order</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#047857",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  iconButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  rightButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "gray",
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#047857",
    padding: 6,
  },
  navButton: {
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    color: "#fff",
    marginTop: 4,
  },
});