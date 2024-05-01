import {
  doc,
  getDoc,
  getDocs,
  getFirestore,
  collection,
  query,
  where,
  addDoc,
  updateDoc,
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
// export async function retrieveDataByName(collectionName: string, name: string) {
//   const snapshot = await getDoc(doc(firestore, collectionName, name));
//   const data = snapshot.data();
//   return data;
// }

// Fungsi untuk mendaftar pengguna
export async function signUp(
  userData: {
    email: string;
    password: string;
    phone: string;
    fullname: string;
    role?: string;
  },
  callback: Function
) {
  const q = query(
    collection(firestore, "users"),
    where("email", "==", userData.email)
  );

  // Periksa email yang ada sebelum melanjutkan pendaftaran
  const snapshot = await getDocs(q);
  if (snapshot.size > 0) {
    callback(false, "Email sudah terdaftar!");
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
    callback(false, error);
    console.error("Kesalahan saat menambahkan pengguna:", error);
  }
}

export async function signIn(email: string) {
  // Buat query untuk mengambil data pengguna berdasarkan email
  const q = query(collection(firestore, "users"), where("email", "==", email));

  // Ambil data pengguna dari Firestore
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  if (data) {
    return data[0];
  } else {
    return null;
  }
}

export async function loginWithGoogle(data: any, callback: Function) {
  const q = query(
    collection(firestore, "users"),
    where("email", "==", data.email)
  );

  const snapshot = await getDocs(q);
  const user = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  if (user.length > 0) {
    callback(user[0]);
  } else {
    data.role = "member";
    await addDoc(collection(firestore, "users"), data).then(() => {
      callback(data);
    });
  }
}

export async function loginWithFacebook(data: any, callback: Function) {
  try {
    const q = query(
      collection(firestore, "users"),
      where("email", "==", data.email)
    );
    const snapshot = await getDocs(q);
    const user = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (user.length > 0) {
      callback(user[0]);
      return; // Exit function if user exists
    }

    data.role = "member";
    await addDoc(collection(firestore, "users"), data);

    // Handle successful data save
    console.log("User data saved successfully:", data);
    callback(data);
  } catch (error) {
    console.error("Error saving user data:", error);
    // Handle errors appropriately (e.g., display an error message to the user)
  }
}
