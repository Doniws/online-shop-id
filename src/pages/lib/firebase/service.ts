import { doc , getDoc , getDocs, getFirestore ,collection, query , where, addDoc} from "firebase/firestore"; 
import app from "./init"; 
import bcrypt from 'bcrypt';
const firestore = getFirestore(app);

// untuk mengambil data 

export async function retiveData(collectionName: string){
    const snapshot = await getDocs(collection(firestore , collectionName));
    const data = snapshot.docs.map((doc) => (
        {
            id : doc.id , 
            ...doc.data()
        }
    ))

    return data ;
}


// mencari berdasarkan id 
export async function retiveDataById(collectionName: string , id : string ) {
    const snapshot = await getDoc(doc(firestore , collectionName , id ));
    const data = snapshot.data();
    return data; 
}

// mencari bberdasarkan name 
export async function retriveDataByName(collectionName : string , name : string ) {
    const snapshot = await getDoc (doc( firestore , collectionName , name));
    const data = snapshot.data();
    return data ;
}



// regitrasi user 
export async function signUp(userData : {
    email : string , 
    password : string ,
    phone :string , 
    fullname : string ,
    role? : string
}, callback : Function ) {
    const q = query(
        collection(firestore , 'users'),
        where('email' , '==' , userData.email),
    );

    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc)=> ({
        id : doc.id , 
        ...doc.data()
    }))

    // jika data sudah ada tdk bisa di register lagi 
    if(data.length < 0 ) {
        callback(false);
    }else {
        if(!userData.role){
            userData.role = 'member';

        }
        userData.password = await bcrypt.hash(userData.password , 10);
        await addDoc(collection(firestore , 'users' ) ,userData)
        .then(()=> {
            callback(true)
        })
        .catch((error)=> {
            callback(false);
            console.log(error);
        })
    }



}
