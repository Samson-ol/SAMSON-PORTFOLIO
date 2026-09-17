import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';

// User's Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLOsmXgd88BbW7h0nRjfwarXEUMw2YVYc",
  authDomain: "samson-portfolio-7f498.firebaseapp.com",
  projectId: "samson-portfolio-7f498",
  storageBucket: "samson-portfolio-7f498.firebasestorage.app",
  messagingSenderId: "1038854582538",
  appId: "1:1038854582538:web:ce0cc3b9ef57a9070c4af3",
  measurementId: "G-N6ZC2P9JT5"
};

// Initialize Firebase App & Firestore Database
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Cloudinary Configuration
const CLOUDINARY_CLOUD_NAME = "io5udpig";
const CLOUDINARY_UPLOAD_PRESET = "ml_default";

/**
 * Uploads a file (Image, PDF, Excel, PowerBI) to Cloudinary via Unsigned API
 * @param {File} file - The file to upload
 * @returns {Promise<{url: string, public_id: string, name: string, size: string}>}
 */
export async function uploadToCloudinary(file) {
  if (!file) throw new Error("No file provided for upload.");

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("Cloudinary upload failed:", errText);
    throw new Error("Failed to upload file to Cloudinary.");
  }

  const data = await response.json();
  return {
    url: data.secure_url,
    public_id: data.public_id,
    name: file.name,
    size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
  };
}

/**
 * Subscribe to realtime updates for projects list in Firestore
 */
export function subscribeToProjects(callback) {
  const projectsRef = collection(db, 'projects');
  return onSnapshot(projectsRef, (snapshot) => {
    const list = [];
    snapshot.forEach(docSnap => {
      list.push({ id: docSnap.id, ...docSnap.data() });
    });
    callback(list);
  }, (error) => {
    console.error("Firestore projects subscription error:", error);
  });
}

/**
 * Save a new project to Firestore
 */
export async function addProjectToDB(projectData) {
  const projectsRef = collection(db, 'projects');
  const docRef = await addDoc(projectsRef, {
    ...projectData,
    createdAt: new Date().toISOString()
  });
  return docRef.id;
}

/**
 * Delete a project from Firestore
 */
export async function deleteProjectFromDB(projectId) {
  const docRef = doc(db, 'projects', projectId);
  await deleteDoc(docRef);
}

/**
 * Subscribe to profile settings (hero photo, resume URL, admin password)
 */
export function subscribeToProfileSettings(callback) {
  const settingsDocRef = doc(db, 'settings', 'profile');
  return onSnapshot(settingsDocRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      callback(null);
    }
  }, (error) => {
    console.error("Firestore profile settings error:", error);
  });
}

/**
 * Save/Update profile settings in Firestore
 */
export async function saveProfileSettingsToDB(settingsData) {
  const settingsDocRef = doc(db, 'settings', 'profile');
  await setDoc(settingsDocRef, settingsData, { merge: true });
}

/**
 * Save a client inquiry message to Firestore
 */
export async function addMessageToDB(messageData) {
  const messagesRef = collection(db, 'messages');
  const docRef = await addDoc(messagesRef, {
    ...messageData,
    createdAt: new Date().toISOString(),
    read: false
  });
  return docRef.id;
}

/**
 * Subscribe to realtime client messages in Firestore
 */
export function subscribeToMessages(callback) {
  const messagesRef = collection(db, 'messages');
  return onSnapshot(messagesRef, (snapshot) => {
    const list = [];
    snapshot.forEach(docSnap => {
      list.push({ id: docSnap.id, ...docSnap.data() });
    });
    // Sort newest first
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    callback(list);
  }, (error) => {
    console.error("Firestore messages subscription error:", error);
  });
}

/**
 * Delete a message from Firestore
 */
export async function deleteMessageFromDB(messageId) {
  const docRef = doc(db, 'messages', messageId);
  await deleteDoc(docRef);
}
