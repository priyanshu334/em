import { databases } from "../appwriteConfig";
import { ID, Models } from "appwrite";

const DATABASE_ID = "67c98754000a680dd1eb"; // Replace with your actual database ID
const COLLECTION_ID = "67e50c3c003cbfc48e9c"; // Your specified collection ID

interface ServiceCenter extends Models.Document {
  name: string;
  contact: string;
  address: string;
}

export const useServiceCenters = () => {
  // Create a new service center
  const createServiceCenter = async (centerData: Omit<ServiceCenter, '$id'>): Promise<ServiceCenter> => {
    try {
      const response = await databases.createDocument<ServiceCenter>(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        centerData
      );
      console.log("Service center created:", response);
      return response;
    } catch (error) {
      console.error("Error creating service center:", error);
      throw error;
    }
  };

  // Get all service centers
  const getAllServiceCenters = async (): Promise<ServiceCenter[]> => {
    try {
      const response = await databases.listDocuments<ServiceCenter>(
        DATABASE_ID,
        COLLECTION_ID
      );
      return response.documents;
    } catch (error) {
      console.error("Error fetching service centers:", error);
      return [];
    }
  };

  // Get a single service center by ID
  const getServiceCenterById = async (id: string): Promise<ServiceCenter | null> => {
    try {
      return await databases.getDocument<ServiceCenter>(
        DATABASE_ID,
        COLLECTION_ID,
        id
      );
    } catch (error) {
      console.error(`Error fetching service center with ID ${id}:`, error);
      return null;
    }
  };

  // Update a service center
  const updateServiceCenter = async (
    id: string,
    updateData: Partial<Omit<ServiceCenter, '$id'>>
  ): Promise<ServiceCenter> => {
    try {
      const response = await databases.updateDocument<ServiceCenter>(
        DATABASE_ID,
        COLLECTION_ID,
        id,
        updateData
      );
      console.log("Service center updated:", response);
      return response;
    } catch (error) {
      console.error(`Error updating service center with ID ${id}:`, error);
      throw error;
    }
  };

  // Delete a service center
  const deleteServiceCenter = async (id: string): Promise<void> => {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
      console.log(`Service center with ID ${id} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting service center with ID ${id}:`, error);
      throw error;
    }
  };

  return {
    createServiceCenter,
    getAllServiceCenters,
    getServiceCenterById,
    updateServiceCenter,
    deleteServiceCenter,
  };
};