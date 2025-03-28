import { databases } from "../appwriteConfig";
import { ID, Models } from "appwrite";

const DATABASE_ID = "67c98754000a680dd1eb"; // Your database ID
const COLLECTION_ID = "67e511ce003cdeda20d1"; // Your collection ID

interface ServiceProvider extends Models.Document {
  name: string;
  contact: string;
  description?: string;
}

export const useServiceProviders = () => {
  // Create a new service provider
  const createServiceProvider = async (
    providerData: Omit<ServiceProvider, '$id'>
  ): Promise<ServiceProvider> => {
    try {
      const response = await databases.createDocument<ServiceProvider>(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        providerData
      );
      console.log("Service provider created:", response);
      return response;
    } catch (error) {
      console.error("Error creating service provider:", error);
      throw error;
    }
  };

  // Get all service providers
  const getAllServiceProviders = async (): Promise<ServiceProvider[]> => {
    try {
      const response = await databases.listDocuments<ServiceProvider>(
        DATABASE_ID,
        COLLECTION_ID
      );
      return response.documents;
    } catch (error) {
      console.error("Error fetching service providers:", error);
      return [];
    }
  };

  // Get a single service provider by ID
  const getServiceProviderById = async (
    id: string
  ): Promise<ServiceProvider | null> => {
    try {
      return await databases.getDocument<ServiceProvider>(
        DATABASE_ID,
        COLLECTION_ID,
        id
      );
    } catch (error) {
      console.error(`Error fetching service provider with ID ${id}:`, error);
      return null;
    }
  };

  // Update a service provider
  const updateServiceProvider = async (
    id: string,
    updateData: Partial<Omit<ServiceProvider, '$id'>>
  ): Promise<ServiceProvider> => {
    try {
      const response = await databases.updateDocument<ServiceProvider>(
        DATABASE_ID,
        COLLECTION_ID,
        id,
        updateData
      );
      console.log("Service provider updated:", response);
      return response;
    } catch (error) {
      console.error(`Error updating service provider with ID ${id}:`, error);
      throw error;
    }
  };

  // Delete a service provider
  const deleteServiceProvider = async (id: string): Promise<void> => {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
      console.log(`Service provider with ID ${id} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting service provider with ID ${id}:`, error);
      throw error;
    }
  };

  return {
    createServiceProvider,
    getAllServiceProviders,
    getServiceProviderById,
    updateServiceProvider,
    deleteServiceProvider,
  };
};