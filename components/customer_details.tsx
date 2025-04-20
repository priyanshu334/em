import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  FlatList,
  Dimensions,
  ScrollView,
} from "react-native";
import { loadCustomers, saveCustomers } from "@/hooks/useCustomer";
import { useAppwriteFormData } from "@/hooks/useAppwriteFormData";
import { AntDesign, Feather } from "@expo/vector-icons";

type CustomerDetailsProps = {
  onSearchChange: (searchTerm: string) => void;
  onAdd: (customerDetails: { name: string; number: string; address: string }) => void;
  onSelect: (customerDetails: { name: string; number: string; address: string } | null) => void;
  initialCustomer?: { name: string; number: string; address: string } | null;
};

const CustomerDetails: React.FC<CustomerDetailsProps> = ({
  onSearchChange,
  onAdd,
  onSelect,
  initialCustomer,
}) => {
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isSelectModalVisible, setSelectModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerNumber, setCustomerNumber] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [storedCustomers, setStoredCustomers] = useState<
    { name: string; number: string; address: string }[]
  >([]);
  const [filteredCustomers, setFilteredCustomers] = useState<
    { name: string; number: string; address: string }[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(initialCustomer || null);
  const [numberError, setNumberError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<{
    name: string;
    number: string;
    address: string;
    originalNumber: string;
  } | null>(null);

  const { getAllFormData } = useAppwriteFormData();

  useEffect(() => {
    const loadCustomerData = async () => {
      setIsLoading(true);
      try {
        const customers = await loadCustomers();
        setStoredCustomers(customers);
        setFilteredCustomers(customers);
      } finally {
        setIsLoading(false);
      }
    };
    loadCustomerData();
  }, []);

  const fetchCustomersFromAppwrite = async () => {
    setIsLoading(true);
    try {
      const formDataList = await getAllFormData();
      const customers = formDataList
        .filter(doc => doc.selectedCustomer) // Only include docs with customer data
        .map((doc) => ({
          name: doc.selectedCustomer?.name || doc.name || "Unknown",
          number: doc.selectedCustomer?.number || "",
          address: doc.selectedCustomer?.address || "",
        }));

      // Merge with existing customers and remove duplicates
      const customerMap = new Map<string, { name: string; number: string; address: string }>();
      
      // Add existing customers first
      storedCustomers.forEach(customer => {
        customerMap.set(customer.number, customer);
      });
      
      // Add new customers (will overwrite if same number exists)
      customers.forEach(customer => {
        customerMap.set(customer.number, customer);
      });

      const uniqueCustomers = Array.from(customerMap.values());

      setStoredCustomers(uniqueCustomers);
      setFilteredCustomers(uniqueCustomers);
      saveCustomers(uniqueCustomers); // Persist to local storage
      Alert.alert("Success", `${customers.length} customers fetched from database!`);
    } catch (error) {
      console.error("Error fetching customers:", error);
      Alert.alert("Error", "Failed to fetch customers from database");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    onSearchChange(term);
    const filtered = storedCustomers.filter((customer) =>
      customer.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredCustomers(filtered);
  };

  const validateNumber = (number: string) => {
    if (!number) {
      return "Phone number is required.";
    }
    if (!/^\d+$/.test(number)) {
      return "Phone number should contain only digits.";
    }
    if (number.length !== 10) {
      return "Phone number must be 10 digits long.";
    }
    return "";
  };

  const handleAddCustomer = () => {
    const numberValidationError = validateNumber(customerNumber);
    if (numberValidationError) {
      setNumberError(numberValidationError);
      return;
    }

    if (!customerName || !customerAddress) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    const newCustomer = {
      name: customerName,
      number: customerNumber,
      address: customerAddress,
    };

    const updatedCustomers = [...storedCustomers, newCustomer];
    saveCustomers(updatedCustomers);

    setStoredCustomers(updatedCustomers);
    setFilteredCustomers(updatedCustomers);
    setAddModalVisible(false);
    setCustomerName("");
    setCustomerNumber("");
    setCustomerAddress("");
    setNumberError("");
    onAdd(newCustomer);
  };

  const handleSelectCustomer = (customer: { name: string; number: string; address: string }) => {
    setSelectedCustomer(customer);
    setSelectModalVisible(false);
    onSelect(customer);
  };

  const handleEditCustomer = (customer: { name: string; number: string; address: string }) => {
    setEditingCustomer({
      ...customer,
      originalNumber: customer.number
    });
    setCustomerName(customer.name);
    setCustomerNumber(customer.number);
    setCustomerAddress(customer.address);
    setEditModalVisible(true);
  };

  const handleUpdateCustomer = () => {
    const numberValidationError = validateNumber(customerNumber);
    if (numberValidationError) {
      setNumberError(numberValidationError);
      return;
    }

    if (!customerName || !customerAddress || !editingCustomer) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    const updatedCustomer = {
      name: customerName,
      number: customerNumber,
      address: customerAddress,
    };

    // Check if the number was changed and if the new number already exists
    if (editingCustomer.originalNumber !== customerNumber) {
      const numberExists = storedCustomers.some(
        customer => customer.number === customerNumber && customer.number !== editingCustomer.originalNumber
      );
      
      if (numberExists) {
        Alert.alert("Error", "A customer with this phone number already exists!");
        return;
      }
    }

    const updatedCustomers = storedCustomers.map(customer => 
      customer.number === editingCustomer.originalNumber ? updatedCustomer : customer
    );

    saveCustomers(updatedCustomers);
    setStoredCustomers(updatedCustomers);
    setFilteredCustomers(updatedCustomers);
    
    // Update selected customer if it's the one being edited
    if (selectedCustomer && selectedCustomer.number === editingCustomer.originalNumber) {
      setSelectedCustomer(updatedCustomer);
      onSelect(updatedCustomer);
    }

    setEditModalVisible(false);
    setEditingCustomer(null);
    setCustomerName("");
    setCustomerNumber("");
    setCustomerAddress("");
    setNumberError("");
  };

  const handleDeleteCustomer = (customerNumber: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this customer?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const updatedCustomers = storedCustomers.filter(
              customer => customer.number !== customerNumber
            );
            
            saveCustomers(updatedCustomers);
            setStoredCustomers(updatedCustomers);
            setFilteredCustomers(updatedCustomers);
            
            // Clear selected customer if it's the one being deleted
            if (selectedCustomer && selectedCustomer.number === customerNumber) {
              setSelectedCustomer(null);
              onSelect(null);
            }
          }
        }
      ]
    );
  };

  const clearSelectedCustomer = () => {
    setSelectedCustomer(null);
    onSelect(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer Details</Text>

      {selectedCustomer && (
        <View style={styles.selectedCustomerContainer}>
          <View style={styles.selectedCustomerHeader}>
            <Text style={styles.subTitle}>Selected Customer</Text>
            <View style={styles.customerActions}>
              <TouchableOpacity onPress={() => handleEditCustomer(selectedCustomer)}>
                <Feather name="edit" size={20} color="#3B82F6" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => handleDeleteCustomer(selectedCustomer.number)}
                style={styles.deleteButton}
              >
                <Feather name="trash-2" size={20} color="#EF4444" />
              </TouchableOpacity>
              <TouchableOpacity onPress={clearSelectedCustomer}>
                <AntDesign name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.customerBox}>
            <Text style={styles.customerName}>{selectedCustomer.name}</Text>
            <Text style={styles.customerInfo}>Number: {selectedCustomer.number}</Text>
            <Text style={styles.customerInfo}>Address: {selectedCustomer.address}</Text>
          </View>
        </View>
      )}

      <View style={styles.inputContainer}>
        <Text style={styles.subTitle}>Search Customer</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Name"
          value={searchTerm}
          onChangeText={handleSearchChange}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          onPress={() => setSelectModalVisible(true)} 
          style={styles.button}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Select</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setAddModalVisible(true)} 
          style={styles.button}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={fetchCustomersFromAppwrite} 
          style={[styles.button, styles.fetchButton]}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Loading..." : "Fetch"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Add Customer Modal */}
      <Modal
        visible={isAddModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Customer</Text>
            
            <ScrollView contentContainerStyle={styles.modalScrollContent}>
              <View style={styles.modalInputContainer}>
                <Text style={styles.modalLabel}>Customer Name</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter Name"
                  value={customerName}
                  onChangeText={setCustomerName}
                />
              </View>

              <View style={styles.modalInputContainer}>
                <Text style={styles.modalLabel}>Customer Number</Text>
                <TextInput
                  style={[styles.modalInput, numberError ? styles.inputError : null]}
                  placeholder="Enter 10-digit Number"
                  keyboardType="numeric"
                  maxLength={10}
                  value={customerNumber}
                  onChangeText={(text) => {
                    setCustomerNumber(text);
                    setNumberError("");
                  }}
                />
                {numberError && <Text style={styles.errorText}>{numberError}</Text>}
              </View>

              <View style={styles.modalInputContainer}>
                <Text style={styles.modalLabel}>Customer Address</Text>
                <TextInput
                  style={[styles.modalInput, styles.addressInput]}
                  placeholder="Enter Address"
                  multiline
                  numberOfLines={3}
                  value={customerAddress}
                  onChangeText={setCustomerAddress}
                />
              </View>
            </ScrollView>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                onPress={() => setAddModalVisible(false)} 
                style={[styles.modalButton, styles.cancelButton]}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleAddCustomer} 
                style={[styles.modalButton, styles.addButton]}
              >
                <Text style={styles.buttonText}>Add Customer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Customer Modal */}
      <Modal
        visible={isEditModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Customer</Text>
            
            <ScrollView contentContainerStyle={styles.modalScrollContent}>
              <View style={styles.modalInputContainer}>
                <Text style={styles.modalLabel}>Customer Name</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter Name"
                  value={customerName}
                  onChangeText={setCustomerName}
                />
              </View>

              <View style={styles.modalInputContainer}>
                <Text style={styles.modalLabel}>Customer Number</Text>
                <TextInput
                  style={[styles.modalInput, numberError ? styles.inputError : null]}
                  placeholder="Enter 10-digit Number"
                  keyboardType="numeric"
                  maxLength={10}
                  value={customerNumber}
                  onChangeText={(text) => {
                    setCustomerNumber(text);
                    setNumberError("");
                  }}
                />
                {numberError && <Text style={styles.errorText}>{numberError}</Text>}
              </View>

              <View style={styles.modalInputContainer}>
                <Text style={styles.modalLabel}>Customer Address</Text>
                <TextInput
                  style={[styles.modalInput, styles.addressInput]}
                  placeholder="Enter Address"
                  multiline
                  numberOfLines={3}
                  value={customerAddress}
                  onChangeText={setCustomerAddress}
                />
              </View>
            </ScrollView>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                onPress={() => setEditModalVisible(false)} 
                style={[styles.modalButton, styles.cancelButton]}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleUpdateCustomer} 
                style={[styles.modalButton, styles.addButton]}
              >
                <Text style={styles.buttonText}>Update Customer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Select Customer Modal */}
      <Modal
        visible={isSelectModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.selectModalContent]}>
            <Text style={styles.modalTitle}>Select Customer</Text>

            <FlatList
              data={filteredCustomers}
              keyExtractor={(item, index) => `${item.number}-${index}`}
              renderItem={({ item }) => (
                <View style={styles.listItemContainer}>
                  <TouchableOpacity 
                    onPress={() => handleSelectCustomer(item)} 
                    style={styles.listItem}
                  >
                    <Text style={styles.customerName}>{item.name}</Text>
                    <Text style={styles.customerInfo}>Number: {item.number}</Text>
                    <Text style={styles.customerInfo}>Address: {item.address}</Text>
                  </TouchableOpacity>
                  <View style={styles.itemActions}>
                    <TouchableOpacity 
                      onPress={() => handleEditCustomer(item)}
                      style={styles.editButton}
                    >
                      <Feather name="edit" size={18} color="#3B82F6" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => handleDeleteCustomer(item.number)}
                      style={styles.deleteButton}
                    >
                      <Feather name="trash-2" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              ListEmptyComponent={
                <Text style={styles.noCustomers}>
                  {isLoading ? "Loading customers..." : "No customers found."}
                </Text>
              }
              style={styles.list}
            />

            <TouchableOpacity 
              onPress={() => setSelectModalVisible(false)} 
              style={[styles.modalButton, styles.cancelButton]}
            >
              <Text style={styles.cancelButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#047857", 
    marginBottom: 10 
  },
  selectedCustomerContainer: {
    marginBottom: 15,
    padding: 10,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  selectedCustomerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  customerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  deleteButton: {
    marginLeft: 8,
  },
  subTitle: { 
    fontSize: 14, 
    fontWeight: "600", 
    marginBottom: 5 
  },
  customerBox: { 
    borderWidth: 1, 
    padding: 8, 
    borderRadius: 4, 
    borderColor: "#ccc" 
  },
  customerName: { 
    fontSize: 14, 
    fontWeight: "bold" 
  },
  customerInfo: { 
    fontSize: 14, 
    color: "#555" 
  },
  input: {
    borderWidth: 1,
    fontSize: 16,
    padding: 12,
    borderRadius: 6,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 5,
  },
  inputContainer: { 
    marginBottom: 2 
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 8,
  },
  button: {
    flex: 1,
    backgroundColor: "#047857",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 5,
    opacity: 1,
  },
  fetchButton: {
    backgroundColor: "#3B82F6",
  },
  buttonText: { 
    color: "white", 
    fontWeight: "bold" 
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: width * 0.85,
    maxHeight: height * 0.7,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalScrollContent: {
    paddingBottom: 10,
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: "bold", 
    color: "#047857", 
    marginBottom: 20,
    textAlign: 'center'
  },
  modalInputContainer: {
    marginBottom: 15,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  addressInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: "#34D399",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: '600',
  },
  noCustomers: { 
    textAlign: "center", 
    marginVertical: 10,
    color: '#666',
  },
  listItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  listItem: {
    padding: 12,
    flex: 1,
  },
  itemActions: {
    flexDirection: 'row',
    paddingRight: 8,
  },
  editButton: {
    marginRight: 12,
  },
  list: {
    width: "100%",
    marginBottom: 10,
  },
  selectModalContent: {
    maxHeight: height * 0.8,
  },
});

export default CustomerDetails;