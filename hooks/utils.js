const handleExport = async () => {
    try {
      // Check if the data array is not empty
      if (!excelData || excelData.length === 0) {
        alert("No data available to export.");
        return;
      }

      // Create a worksheet from the data
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Create a new workbook and append the worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Customer Data");

      // Convert the workbook to a binary string in base64
      const binaryExcel = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "base64", // Using base64 format directly
      });

      // Create the file path to save the file
      const fileUri = `${FileSystem.documentDirectory}customer_data.xlsx`;

      // Write the Excel file as a base64 string
      await FileSystem.writeAsStringAsync(fileUri, binaryExcel, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Check if sharing is available and share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        alert(`File saved to ${fileUri}`);
      }
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  const handleDownload = () => {
    if (excelData && excelData.length > 0) {
      // If data is present, call handleExport
      handleExport();
    } else {
      // If no data is available, show an alert
      alert("Please add customer data before exporting.");
    }
  };