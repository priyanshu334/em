import React, { createContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define types for the context and form data
interface FormDataItem {
  id: string;
  [key: string]: any; // Additional fields for flexibility
}

interface FormDataContextType {
  formData: FormDataItem[];
  addData: (newData: FormDataItem) => Promise<void>;
  updateData: (id: string, updatedData: Partial<FormDataItem>) => Promise<void>;
  deleteData: (id: string) => Promise<void>;
}

// Default context value
const defaultContextValue: FormDataContextType = {
  formData: [],
  addData: async () => {},
  updateData: async () => {},
  deleteData: async () => {},
};

// Create the context
export const FormDataContext = createContext<FormDataContextType>(
  defaultContextValue
);

// Define the provider props type
interface FormDataProviderProps {
  children: ReactNode;
}

// Create the provider
export const FormDataProvider: React.FC<FormDataProviderProps> = ({
  children,
}) => {
  const [formData, setFormData] = useState<FormDataItem[]>([]);

  // Load data from AsyncStorage when the component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("formData");
        if (storedData) {
          console.log("Stored Data:", JSON.parse(storedData));
          setFormData(JSON.parse(storedData));
        }
      } catch (error) {
        console.error("Failed to load data from AsyncStorage:", error);
      }
    };

    loadData();
  }, []);

  // Function to save data to AsyncStorage
  const saveData = async (data: FormDataItem[]) => {
    try {
      await AsyncStorage.setItem("formData", JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save data to AsyncStorage:", error);
    }
  };

  // Function to add new data
  const addData = async (newData: FormDataItem) => {
    const updatedData = [...formData, newData];
    setFormData(updatedData);
    await saveData(updatedData);
  };

  // Function to update existing data
  const updateData = async (id: string, updatedData: Partial<FormDataItem>) => {
    const newData = formData.map((item) =>
      item.id === id ? { ...item, ...updatedData } : item
    );
    setFormData(newData);
    await saveData(newData);
  };

  // Function to delete data
  const deleteData = async (id: string) => {
    const newData = formData.filter((item) => item.id !== id);
    setFormData(newData);
    await saveData(newData);
  };

  return (
    <FormDataContext.Provider
      value={{ formData, addData, updateData, deleteData }}
    >
      {children}
    </FormDataContext.Provider>
  );
};