import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { AntDesign } from "@expo/vector-icons";

interface DataCardProps {
  serialNo: number; // Added serial number prop
  orderId: string;
  orderStatus: string;
  orderModel: string;
  customerName: string;
  customerNumber: string;
  date: string;
  imageUrl: string;
  onEdit: () => void;
  onView: () => void;
  onDelete: () => void;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "#A52A2A"; // Brown
    case "processing":
      return "#FF69B4"; // Pink
    case "shipped":
      return "#007bff"; // Blue
    case "delivered":
      return "#28a745"; // Green
    case "cancelled":
      return "#dc3545"; // Red
    default:
      return "#6c757d"; // Default Gray
  }
};

const DataCard: React.FC<DataCardProps> = ({
  serialNo,
  orderId,
  orderStatus,
  orderModel,
  customerName,
  customerNumber,
  date,
  imageUrl,
  onEdit,
  onView,
  onDelete,
}) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.serialNo}>#{serialNo}</Text>
          <Text style={styles.orderId}>Order Id: {orderId.slice(10)}</Text>
          <Text style={[styles.statusBadge, { backgroundColor: getStatusColor(orderStatus) }]}>
            {orderStatus}
          </Text>
        </View>
        <Text style={styles.title}>{customerName}</Text>
        <Text style={styles.subtitle}>Model: {orderModel}</Text>
        <Text style={styles.subtitle}>Contact: {customerNumber}</Text>
        <Text style={styles.subtitle}>Pickup: {date}</Text>

        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={onEdit} style={styles.editButton}>
            <AntDesign name="edit" size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onView} style={styles.editButton}>
            <AntDesign name="addfile" size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <AntDesign name="delete" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f8f9fa",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 120,
    height: 210,
    borderRadius: 8,
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  serialNo: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007bff",
    marginRight: 8,
  },
  orderId: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    color: "white",
    fontWeight: "bold",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 4,
  },
  actionButtons: {
    flexDirection: "row",
    marginTop: 12,
    gap: 12,
  },
  editButton: {
    backgroundColor: "#007bff",
    padding: 8,
    borderRadius: 4,
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    padding: 8,
    borderRadius: 4,
  },
});

export default DataCard;
