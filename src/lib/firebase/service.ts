import {
  doc,
  getDoc,
  getDocs,
  getFirestore,
  collection,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import app from "./init";
import bcrypt from "bcrypt";

const firestore = getFirestore(app);

// Fungsi untuk mengambil semua data dari koleksi
export async function retrieveData(collectionName: string) {
  const snapshot = await getDocs(collection(firestore, collectionName));
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return data;
}

// Fungsi untuk mengambil data berdasarkan ID
export async function retrieveDataById(collectionName: string, id: string) {
  const snapshot = await getDoc(doc(firestore, collectionName, id));
  const data = snapshot.data();
  return data;
}

// Fungsi untuk mengambil data berdasarkan nama (dengan asumsi nama unik)
export async function retrieveDataByName(collectionName: string, name: string) {
  const snapshot = await getDoc(doc(firestore, collectionName, name));
  const data = snapshot.data();
  return data;
}

// Fungsi untuk mendaftar pengguna
export async function signUp(userData: {
  email: string;
  password: string;
  phone: string;
  fullname: string;
  role?: string;
}, callback: Function) {
  const q = query(collection(firestore, "users"), where("email", "==", userData.email));

  // Periksa email yang ada sebelum melanjutkan pendaftaran
  const snapshot = await getDocs(q);
  if (snapshot.size > 0) {
    callback(false, "Email sudah terdaftar!"); // Informasikan pemanggil tentang duplikat
    return; // Keluar dari fungsi lebih awal untuk mencegah pemrosesan lebih lanjut
  }

  // Jika email unik, lanjutkan dengan logika pendaftaran
  if (!userData.role) {
    userData.role = "member";
  }

  userData.password = await bcrypt.hash(userData.password, 10);

  try {
    await addDoc(collection(firestore, "users"), userData);
    callback(true);
  } catch (error) {
    callback(false, error); // Kirim pesan kesalahan ke pemanggil
    console.error("Kesalahan saat menambahkan pengguna:", error);
  }
}
