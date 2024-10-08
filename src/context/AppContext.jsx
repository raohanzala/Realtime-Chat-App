import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { db, auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


  export const AppContext = createContext()

  const AppContextProvider = ({children})=> {

    const navigate = useNavigate()

    const [userData, setUserData] = useState(null)
    const [chatData, setChatData] = useState(null)
    const [messagesId, setMessagesId] = useState(null)
    const [messages, setMessages] = useState([])
    const [chatUser, setChatUser] = useState(null)
    const [chatVisible, setChatVisible] = useState(false)

    const loadUserData= async (uid)=> {
      try {


        if (!uid) throw new Error("User ID is undefined");



        const userRef = doc(db, 'users', uid)
          const userSnap = await getDoc(userRef)

          if (!userSnap.exists()) {
            throw new Error("User document does not exist");
          }

          const userData = userSnap.data()
          setUserData(userData)


          console.log(userData)

          if (userData?.avatar && userData?.name) {  // Safe check for avatar and name
            navigate('/chat');
            console.log('I am in the chat');
          } else {
            navigate('/profile');
            console.log('I am in the profile');
          }

          await updateDoc(userRef, {
            lastSeen : Date.now()
          })

          setInterval(async()=> {
            if(auth.chatUser){
              await updateDoc(userRef, {
                lastSeen : Date.now()
              })
            }
          }, 60000)

      } catch (error) {
        console.error(error)
        toast.error(error.code.split('/')[1].split('-').join(' '))
      }
    }

    useEffect(()=>{
      if(userData){
        console.log(userData)
        const chatRef = doc(db, 'chats', userData.id)
        const unSub = onSnapshot(chatRef, async(res)=>{
          const chatItems = res.data().chatsData
          const tempData = []
          for(const item of chatItems){
            const userRef = doc(db, 'users', item.rId)
            const userSnap = await getDoc(userRef)
            const userData = userSnap.data()
            tempData.push({...item, userData})
          }
          
          // Check for duplicates and log the final data
      const uniqueData = tempData.filter((value, index, self) =>
        index === self.findIndex((t) => (
          t.id === value.id // Replace 'id' with the unique property of your chat items
        ))
      );

      console.log('Unique chat data:', uniqueData);

          setChatData(tempData.sort((a,b)=> b.updatedAt - a.updatedAt ))
        })

        return ()=> {
          unSub()
        }
      }
    },[userData])

    const value = {
userData, setUserData, chatData, setChatData, loadUserData, messages, setMessages, messagesId, setMessagesId, chatUser, setChatUser, chatVisible, setChatVisible
    }

    return (
      <AppContext.Provider value={value}>
{children}
      </AppContext.Provider>
    )

  }

  export default AppContextProvider