import { Client, Databases } from "appwrite";

// Initialize the Appwrite client
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Appwrite Cloud endpoint
  .setProject("67c98460002cbfb5dc8f"); // Your Appwrite project ID

// Initialize the Databases service
const databases = new Databases(client);

// Define your database and collection IDs
const DATABASE_ID = "67c98754000a680dd1eb"; // Your database ID
const COLLECTION_ID = "67c9971a0022218bbef2"; // Your collection ID

export { databases, DATABASE_ID, COLLECTION_ID };