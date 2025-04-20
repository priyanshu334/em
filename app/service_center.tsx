import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useServiceCenters } from "../hooks/useServiceCenters";
import { useServiceCenters as useServiceCentersApp } from "../hooks/useServiceCenterApp";

interface ServiceCenterType {
  id: string;
  $id?: string;
  name: string;
  contact: string;
  address: string;
}

interface AppwriteServiceCenterType {
  $id: string;
  name: string;
  contact: string;
  address: string;
}

export default function ServiceCenter() {
  const { 
    centers: localCenters, 
    addOrUpdateCenter: updateLocalCenter, 
    deleteCenter: deleteLocalCenter 
  } = useServiceCenters();
  
  const { 
    createServiceCenter,
    getAllServiceCenters,
    updateServiceCenter,
    deleteServiceCenter,
  } = useServiceCentersApp();

  const [centerName, setCenterName] = useState<string>("");
  const [contactNumber, setContactNumber] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [editingCenter, setEditingCenter] = useState<ServiceCenterType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAddOrEditCenter = () => {
    if (!centerName || !contactNumber || !address) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const centerData: ServiceCenterType = {
      id: editingCenter?.id || Date.now().toString(),
      $id: editingCenter?.$id,
      name: centerName,
      contact: contactNumber,
      address
    };

    updateLocalCenter(centerData);
    resetForm();
  };

  const handleDeleteCenter = (center: ServiceCenterType) => {
    Alert.alert(
      "Confirm Delete",
      `Delete ${center.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          onPress: () => deleteLocalCenter(center.id) 
        }
      ]
    );
  };

  const resetForm = () => {
    setCenterName("");
    setContactNumber("");
    setAddress("");
    setEditingCenter(null);
  };

  const uploadToAppwrite = async () => {
    setIsLoading(true);
    try {
      for (const center of localCenters) {
        if (center.$id) {
          await updateServiceCenter(center.$id, {
            name: center.name,
            contact: center.contact,
            address: center.address
          });
        } else {
          const newCenter = await createServiceCenter({
            name: center.name,
            contact: center.contact,
            address: center.address
          });
          updateLocalCenter({
            ...center,
            $id: newCenter.$id
          });
        }
      }
      Alert.alert("Success", "All data uploaded to Appwrite");
    } catch (error) {
      Alert.alert("Error", "Upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadFromAppwrite = async () => {
    setIsLoading(true);
    try {
      const cloudCenters: AppwriteServiceCenterType[] = await getAllServiceCenters();
      cloudCenters.forEach((center: AppwriteServiceCenterType) => {
        updateLocalCenter({
          id: center.$id,
          $id: center.$id,
          name: center.name,
          contact: center.contact,
          address: center.address
        });
      });
      Alert.alert("Success", "Data downloaded from Appwrite");
    } catch (error) {
      Alert.alert("Error", "Download failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
       
        <Text style={styles.headerTitle}>
          Service Centers
        </Text>
        
        <View style={styles.headerIcons}>
          <TouchableOpacity 
            onPress={downloadFromAppwrite} 
            disabled={isLoading}
            style={styles.downloadButton}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <AntDesign name="download" size={24} color="#fff" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={uploadToAppwrite} 
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <AntDesign name="upload" size={24} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>
          {editingCenter ? "Edit Service Center" : "Add Service Center"}
        </Text>

        <View style={styles.formFields}>
          <View style={styles.inputContainer}>
            <AntDesign name="home" size={20} color="gray" />
            <TextInput
              placeholder="Service Center Name"
              value={centerName}
              onChangeText={setCenterName}
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <AntDesign name="phone" size={20} color="gray" />
            <TextInput
              placeholder="Contact Number"
              keyboardType="phone-pad"
              value={contactNumber}
              onChangeText={setContactNumber}
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="location-on" size={20} color="gray" />
            <TextInput
              placeholder="Address"
              value={address}
              onChangeText={setAddress}
              style={styles.input}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleAddOrEditCenter}
          style={styles.submitButton}
        >
          <Text style={styles.submitButtonText}>
            {editingCenter ? "Save Changes" : "Add Service Center"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>
          Service Centers ({localCenters.length})
        </Text>
        
        {localCenters.length === 0 ? (
          <Text style={styles.emptyText}>
            No service centers added yet
          </Text>
        ) : (
          <FlatList
            data={localCenters}
            keyExtractor={(item: ServiceCenterType) => item.id}
            renderItem={({ item }: { item: ServiceCenterType }) => (
              <View style={styles.listItem}>
                <View style={styles.itemContent}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemContact}>{item.contact}</Text>
                  <Text style={styles.itemAddress}>{item.address}</Text>
                  {item.$id && (
                    <Text style={styles.syncedText}>Synced with cloud</Text>
                  )}
                </View>
                <View style={styles.itemActions}>
                  <TouchableOpacity
                    onPress={() => {
                      setEditingCenter(item);
                      setCenterName(item.name);
                      setContactNumber(item.contact);
                      setAddress(item.address);
                    }}
                    style={styles.editButton}
                  >
                    <AntDesign name="edit" size={24} color="blue" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteCenter(item)}>
                    <AntDesign name="delete" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F0FDF4"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#065f46",
    padding: 16,
    borderBottomWidth: 1
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center"
  },
  headerIcons: {
    flexDirection: "row"
  },
  downloadButton: {
    marginRight: 16
  },
  formContainer: {
    padding: 16,
    backgroundColor: "white",
    borderRadius: 6,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2563eb",
    marginBottom: 16
  },
  formFields: {
    flexDirection: "column",
    gap: 8
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  input: {
    flex: 1,
    marginLeft: 12,
    color: "#1f2937"
  },
  submitButton: {
    backgroundColor: "#065f46",
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 24
  },
  submitButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 18
  },
  listContainer: {
    padding: 16
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2563eb",
    marginBottom: 16
  },
  emptyText: {
    color: "#6b7280",
    textAlign: "center",
    paddingVertical: 16
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 6,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2
  },
  itemContent: {
    flex: 1
  },
  itemName: {
    color: "#1f2937",
    fontWeight: "600"
  },
  itemContact: {
    color: "#6b7280"
  },
  itemAddress: {
    color: "#6b7280"
  },
  syncedText: {
    fontSize: 12,
    color: "#9ca3af"
  },
  itemActions: {
    flexDirection: "row",
    alignItems: "center"
  },
  editButton: {
    marginRight: 16
  }
});