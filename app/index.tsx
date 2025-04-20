import React, { useState, useEffect, useMemo } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useFormDataStorage from "../hooks/useFormData";
import DataCard from "@/components/DataCard";
import FilterComponent from "@/components/filter_section";
import { useAppwriteFormData } from "../hooks/useAppwriteFormData";

interface Filters {
  serviceCenter: string | null;
  serviceProvider: string | null;
  selectedDate: Date | null;
  customerSearch: string;
  orderStatus: string | null;
}

export default function Index() {
  const router = useRouter();
  const { formDataList, deleteFormData } = useFormDataStorage();
  const { createFormData, getFormDataById, updateFormData } = useAppwriteFormData();

  const [filters, setFilters] = useState<Filters>({
    serviceCenter: null,
    serviceProvider: null,
    selectedDate: null,
    customerSearch: "",
    orderStatus: null,
  });

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
  
      const matchesOrderStatus = filters.orderStatus
        ? data.orderDetails.orderStatus === filters.orderStatus
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

  const formatDate = (date: Date | null): string => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleEdit = (id: string) => {
    router.push(`./edit_order/${id}`);
  };

  const handleView = (id: string) => {
    router.push(`./view_orders/${id}`);
  };

  const handleDelete = async (id: string) => {
    await deleteFormData(id);
  };

  const isEqual = (obj1: any, obj2: any): boolean => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  };

  const handleSync = async () => {
    try {
      const dataToSync = [...formDataList];
      const syncedData = [];
      const failedData = [];

      for (const data of dataToSync) {
        try {
          const existingData = await getFormDataById(data.id);

          if (existingData) {
            const isDataModified = !isEqual(data, existingData);

            if (isDataModified) {
              await updateFormData(data.id, data);
              syncedData.push(data);
            } else {
              continue;
            }
          } else {
            await createFormData(data);
            syncedData.push(data);
          }
        } catch (error) {
          console.error(`Error syncing data with ID ${data.id}:`, error);
          failedData.push(data);
        }
      }

      if (failedData.length > 0) {
        alert(`Some data failed to sync. Please try again.`);
      } else {
        alert(`Data synced successfully!`);
      }

      if (failedData.length > 0) {
        setTimeout(() => {
          handleSync();
        }, 5000);
      }
    } catch (error) {
      console.error("Error during sync process:", error);
      alert("Failed to sync data. Please check your connection and try again.");
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
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}></TouchableOpacity>
          <Text style={styles.headerTitle}>All Records</Text>
          <View style={styles.rightButtons}>
            <TouchableOpacity onPress={handleSync}>
              <AntDesign name="sync" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          {/* Filter Component */}
          <FilterComponent
            onApplyFilters={setFilters}
            initialFilters={filters}
          />

          {/* No records message */}
          {filteredData.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No records found.</Text>
            </View>
          ) : (
            filteredData.map((data: any, index: number) => (
              <DataCard
                key={data.id}
                serialNo={index + 1}
                imageUrl={data.deviceKYC?.cameraData[0] || 'https://via.placeholder.com/120x210'} 
                orderId={data.id}
                orderStatus={data.orderDetails.orderStatus}
                orderModel={data.orderDetails.deviceModel}
                customerName={data.selectedCustomer?.name || "N/A"}
                customerNumber={data.selectedCustomer?.number || "N/A"}
                date={formatDate(data.estimateDetails.pickupDate)}
                onEdit={() => handleEdit(data.id)}
                onView={() => handleView(data.id)}
                onDelete={() => handleDelete(data.id)}
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
          <TouchableOpacity onPress={() => router.push("/all_orders")} style={styles.navButton}>
            <AntDesign name="filetext1" size={24} color="#fff" />
            <Text style={styles.navText}>All Orders</Text>
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
    padding: 16,
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