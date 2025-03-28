import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useServiceProviders } from "../hooks/useServiceProvider";
import { useServiceProviders as useServiceProvidersApp } from "../hooks/useServiceProviderApp";

interface ServiceProviderType {
  id: string;
  $id?: string;
  name: string;
  contact: string;
  description?: string;
}

interface AppwriteServiceProviderType {
  $id: string;
  name: string;
  contact: string;
  description?: string;
}

export default function ServiceProviders() {
  const { 
    providers: localProviders, 
    addOrUpdateProvider: updateLocalProvider, 
    deleteProvider: deleteLocalProvider 
  } = useServiceProviders();
  
  const { 
    createServiceProvider,
    getAllServiceProviders,
    updateServiceProvider,
    deleteServiceProvider,
  } = useServiceProvidersApp();

  const [providerName, setProviderName] = useState<string>("");
  const [contactNumber, setContactNumber] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [editingProvider, setEditingProvider] = useState<ServiceProviderType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAddOrEditProvider = () => {
    if (!providerName || !contactNumber) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    const providerData: ServiceProviderType = {
      id: editingProvider?.id || Date.now().toString(),
      $id: editingProvider?.$id,
      name: providerName,
      contact: contactNumber,
      description
    };

    updateLocalProvider(providerData);
    resetForm();
  };

  const handleDeleteProvider = (provider: ServiceProviderType) => {
    Alert.alert(
      "Confirm Delete",
      `Delete ${provider.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          onPress: () => deleteLocalProvider(provider.id) 
        }
      ]
    );
  };

  const resetForm = () => {
    setProviderName("");
    setContactNumber("");
    setDescription("");
    setEditingProvider(null);
  };

  const uploadToAppwrite = async () => {
    setIsLoading(true);
    try {
      for (const provider of localProviders) {
        if (provider.$id) {
          await updateServiceProvider(provider.$id, {
            name: provider.name,
            contact: provider.contact,
            description: provider.description
          });
        } else {
          const newProvider = await createServiceProvider({
            name: provider.name,
            contact: provider.contact,
            description: provider.description
          });
          updateLocalProvider({
            ...provider,
            $id: newProvider.$id
          });
        }
      }
      Alert.alert("Success", "All providers uploaded to Appwrite");
    } catch (error) {
      Alert.alert("Error", "Upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadFromAppwrite = async () => {
    setIsLoading(true);
    try {
      const cloudProviders: AppwriteServiceProviderType[] = await getAllServiceProviders();
      cloudProviders.forEach((provider: AppwriteServiceProviderType) => {
        updateLocalProvider({
          id: provider.$id,
          $id: provider.$id,
          name: provider.name,
          contact: provider.contact,
          description: provider.description
        });
      });
      Alert.alert("Success", "Providers downloaded from Appwrite");
    } catch (error) {
      Alert.alert("Error", "Download failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/")}>
          <AntDesign name="arrowleft" size={24} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>
          Service Providers
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
          {editingProvider ? "Edit Service Provider" : "Add Service Provider"}
        </Text>

        <View style={styles.formFields}>
          <View style={styles.inputContainer}>
            <AntDesign name="user" size={20} color="gray" />
            <TextInput
              placeholder="Provider Name"
              value={providerName}
              onChangeText={setProviderName}
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
            <MaterialIcons name="description" size={20} color="gray" />
            <TextInput
              placeholder="Description (Optional)"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={handleAddOrEditProvider}
          style={styles.submitButton}
        >
          <Text style={styles.submitButtonText}>
            {editingProvider ? "Save Changes" : "Add Provider"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>
          Service Providers ({localProviders.length})
        </Text>
        
        {localProviders.length === 0 ? (
          <Text style={styles.emptyText}>
            No service providers added yet
          </Text>
        ) : (
          <FlatList
            data={localProviders}
            keyExtractor={(item: ServiceProviderType) => item.id}
            renderItem={({ item }: { item: ServiceProviderType }) => (
              <View style={styles.listItem}>
                <View style={styles.itemContent}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemContact}>{item.contact}</Text>
                  {item.description && (
                    <Text style={styles.itemDescription}>{item.description}</Text>
                  )}
                  {item.$id && (
                    <Text style={styles.syncedText}>Synced with cloud</Text>
                  )}
                </View>
                <View style={styles.itemActions}>
                  <TouchableOpacity
                    onPress={() => {
                      setEditingProvider(item);
                      setProviderName(item.name);
                      setContactNumber(item.contact);
                      setDescription(item.description || "");
                    }}
                    style={styles.editButton}
                  >
                    <AntDesign name="edit" size={24} color="blue" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteProvider(item)}>
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
  itemDescription: {
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