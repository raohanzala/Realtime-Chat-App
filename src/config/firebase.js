// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut} from 'firebase/auth'
import { collection, getDoc, getFirestore, query, where } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAVjnoCbCz82JShL52EULOinzw_RXyfalM",
  authDomain: "chat-app-501e6.firebaseapp.com",
  projectId: "chat-app-501e6",
  storageBucket: "chat-app-501e6.appspot.com",
  messagingSenderId: "670317938891",
  appId: "1:670317938891:web:cb90fe92746ec6c904b34e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)

const signup = async (username, email, password)=> {
try {
  const res = await createUserWithEmailAndPassword(auth, email, password)
  const user = res.user
  await setDoc(doc(db, 'users', user.uid), {
    id : user.uid,
    username : username.toLowerCase(),
    email,
    name : '',
    avatar : '',
    bio : 'Hey, There i am using chat app',
    lastSeen : Date.now()
  })

  await setDoc(doc(db, 'chats', user.uid), {
    chatsData : []
  })
} catch (error) {
  console.error(error)
  toast.error(error.code.split('/')[1].split('-').join(' '))
}
}

const login = async (email, password)=> {
  try {
    await signInWithEmailAndPassword(auth, email, password)
    console.log('Login Succesfully')
  } catch (error) {
    console.error(error)
    toast.error(error.code.split('/')[1].split('-').join(' '))
  }
}

const logout = async()=>{
  try {
    await signOut(auth)
  } catch (error) {
    console.error(error)
    toast.error(error.code.split('/')[1].split('-').join(' '))
  }
}

const resetPass = async (email)=>{
  if(!email){
    toast.error('Enter your email')
    return null
  } try {
    const userRef = collection(db, 'users')
    const q = query(userRef, where('email', '==', email))
    const querySnap = await getDoc(q)
    if(!querySnap.empty){
      await sendPasswordResetEmail(auth, email)
      toast.success('Reset Email Sent')
    }
    else{
      toast.error("Email doesn't exists")
    }
  } catch (error) {
      console.error(error)
      toast.error(error.message)
  }
}

export {signup, login, logout, db, auth, resetPass}