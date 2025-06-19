import { collection, addDoc, Timestamp, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';

// Save a sale entry
export const saveSaleToFirestore = async (sale) => {
  try {
    const docRef = await addDoc(collection(db, 'sales'), {
      ...sale,
      createdAt: Timestamp.now()
    });
    console.log("Sale saved to Firestore with ID:", docRef.id);
  } catch (error) {
    console.error("Error saving sale to Firestore:", error);
  }
};

// Save a customer entry if not already present
export const saveCustomerToFirestore = async (customer) => {
  if (!customer.name && !customer.phone) return;

  const customersRef = collection(db, 'customers');

  // Check if customer exists by phone
  const q = query(customersRef, where("phone", "==", customer.phone));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    try {
      await addDoc(customersRef, {
        name: customer.name || '',
        phone: customer.phone || '',
        createdAt: Timestamp.now()
      });
      console.log("Customer added to Firestore");
    } catch (error) {
      console.error("Error saving customer:", error);
    }
  } else {
    console.log("Customer already exists in Firestore");
  }
};
