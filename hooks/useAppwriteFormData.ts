import { databases, DATABASE_ID, COLLECTION_ID } from "../appwriteConfig";
import { Models } from "appwrite";

// Define the structure of your form data
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

export const useAppwriteFormData = () => {
  // Create a new form data entry
  const createFormData = async (formData: FormData): Promise<Models.Document> => {
    try {
      const response = await databases.createDocument(DATABASE_ID, COLLECTION_ID, formData.id, formData);
      console.log("Form Data Created:", response);
      return response;
    } catch (error) {
      console.error("Error creating form data:", error);
      throw error;
    }
  };

  // Get all form data
  const getAllFormData = async (): Promise<Models.Document[]> => {
    try {
      const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
      return response.documents; // Return the documents array
    } catch (error) {
      console.error("Error fetching form data:", error);
      return []; // Return an empty array in case of error
    }
  };

  // Get a single form entry by ID
  const getFormDataById = async (id: string): Promise<FormData | null> => {
    try {
      const response = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id);
      
      const formattedData: FormData = {
        id: response.$id, // Ensure ID is mapped correctly
        name: response.name,
        designation: response.designation,
        selectedCustomer: response.selectedCustomer || null,
        orderDetails: response.orderDetails,
        estimateDetails: response.estimateDetails,
        repairPartnerDetails: response.repairPartnerDetails,
        deviceKYC: response.deviceKYC,
      };
  
      return formattedData;
    } catch (error) {
      console.error("Error fetching form data by ID:", error);
      return null;
    }
  };
  

  // Update an existing form entry
  const updateFormData = async (id: string, updatedData: Partial<FormData>): Promise<Models.Document> => {
    try {
      const response = await databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, updatedData);
      console.log("Updated Form Data:", response);
      return response;
    } catch (error) {
      console.error("Error updating form data:", error);
      throw error;
    }
  };

  // Delete a form entry
  const deleteFormData = async (id: string): Promise<void> => {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
      console.log("Deleted form data with ID:", id);
    } catch (error) {
      console.error("Error deleting form data:", error);
      throw error;
    }
  };

  return {
    createFormData,
    getAllFormData,
    getFormDataById,
    updateFormData,
    deleteFormData,
  };
};