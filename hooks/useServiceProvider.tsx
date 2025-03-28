import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PROVIDERS_KEY = "@service_providers";

// Custom hook to manage service providers in AsyncStorage
export const useServiceProviders = () => {
  const [providers, setProviders] = useState<any[]>([]);

  // Load providers from AsyncStorage
  useEffect(() => {
    const loadProviders = async () => {
      try {
        const storedProviders = await AsyncStorage.getItem(PROVIDERS_KEY);
        if (storedProviders) {
          setProviders(JSON.parse(storedProviders));
        }
      } catch (error) {
        console.error("Failed to load providers:", error);
      }
    };
    loadProviders();
  }, []);

  // Save providers to AsyncStorage
  useEffect(() => {
    const saveProviders = async () => {
      try {
        await AsyncStorage.setItem(PROVIDERS_KEY, JSON.stringify(providers));
      } catch (error) {
        console.error("Failed to save providers:", error);
      }
    };
    saveProviders();
  }, [providers]);

  // Add or update a provider
  const addOrUpdateProvider = (provider: any) => {
    const updatedProviders = providers.some((existingProvider) => existingProvider.id === provider.id)
      ? providers.map((existingProvider) =>
          existingProvider.id === provider.id ? provider : existingProvider
        )
      : [...providers, provider];
    setProviders(updatedProviders);
  };

  // Delete a provider
  const deleteProvider = (id: string) => {
    setProviders(providers.filter((provider) => provider.id !== id));
  };

  return { providers, addOrUpdateProvider, deleteProvider };
};