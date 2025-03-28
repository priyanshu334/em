import AsyncStorage from "@react-native-async-storage/async-storage";

// Storage key for customer data
const STORAGE_KEY = "customers";

// Utility to load customers from AsyncStorage
export const loadCustomers = async (): Promise<{ name: string; number: string; address: string }[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error("Failed to load customers from AsyncStorage:", error);
    return [];
  }
};

// Utility to save customers to AsyncStorage
export const saveCustomers = async (
  customers: { name: string; number: string; address: string }[]
): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
  } catch (error) {
    console.error("Failed to save customers to AsyncStorage:", error);
  }
};