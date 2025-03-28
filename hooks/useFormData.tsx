import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FORM_DATA_KEY = "@form_data_list"; // Key for storing the list of form data

// Define the types for the form data
interface FormData {
  id: string; // Unique ID for each form entry
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
    cameraData: string | null;
    otherAccessories: string;
    additionalDetailsList: string[];
    lockCode: string;
  };
}

const useFormDataStorage = () => {
  const [formDataList, setFormDataList] = useState<FormData[]>([]);

  // Load all data from AsyncStorage on component mount
  useEffect(() => {
    loadFormData();
  }, []);

  // Fetch all stored form data
  const loadFormData = async () => {
    try {
      const data = await AsyncStorage.getItem(FORM_DATA_KEY);
      if (data) {
        const parsedData: FormData[] = JSON.parse(data);
        setFormDataList(parsedData);
        console.log("Loaded form data from AsyncStorage:", parsedData);
      } else {
        console.log("No form data found in AsyncStorage.");
      }
    } catch (error) {
      console.error("Failed to load form data from AsyncStorage", error);
    }
  };

  // Save the entire list of form data back to AsyncStorage
  const saveAllFormData = async (dataList: FormData[]) => {
    try {
      console.log("Saving form data to AsyncStorage:", dataList);
      await AsyncStorage.setItem(FORM_DATA_KEY, JSON.stringify(dataList));
      setFormDataList(dataList);
    } catch (error) {
      console.error("Failed to save form data to AsyncStorage", error);
    }
  };

  // Create: Add a new form entry
  const createFormData = async (data: FormData) => {
    try {
      const newDataList = [...formDataList, data];
      console.log("Adding new form data:", data);
      await saveAllFormData(newDataList);
    } catch (error) {
      console.error("Failed to create form data:", error);
    }
  };

  // Read: Get a single form entry by ID
  const getFormDataById = async (id: string): Promise<FormData | undefined> => {
    try {
      const data = await AsyncStorage.getItem(FORM_DATA_KEY);
      if (data) {
        const parsedData: FormData[] = JSON.parse(data);
        const foundData = parsedData.find((item) => item.id === id);
        console.log("Found form data by ID:", foundData);
        return foundData;
      } else {
        console.log("No data found for the given ID:", id);
      }
    } catch (error) {
      console.error("Error fetching form data by ID:", error);
    }
    return undefined;
  };

  // Update: Edit an existing form entry
  const updateFormData = async (id: string, updatedData: FormData) => {
    try {
      const newDataList = formDataList.map((item) =>
        item.id === id ? updatedData : item
      );
      console.log("Updating form data:", updatedData);
      await saveAllFormData(newDataList);
    } catch (error) {
      console.error("Failed to update form data:", error);
    }
  };

  // Delete: Remove a form entry by ID
  const deleteFormData = async (id: string) => {
    try {
      const newDataList = formDataList.filter((item) => item.id !== id);
      console.log("Deleting form data with ID:", id);
      await saveAllFormData(newDataList);
    } catch (error) {
      console.error("Failed to delete form data:", error);
    }
  };

  // Clear All: Delete all form data from AsyncStorage
  const clearAllFormData = async () => {
    try {
      await AsyncStorage.removeItem(FORM_DATA_KEY);
      console.log("All form data cleared from AsyncStorage.");
      setFormDataList([]);
    } catch (error) {
      console.error("Failed to clear form data from AsyncStorage", error);
    }
  };

  return {
    FormData,
    formDataList,
    createFormData,
    getFormDataById,
    updateFormData,
    deleteFormData,
    clearAllFormData,
  };
};

export default useFormDataStorage;