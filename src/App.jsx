
import { Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'
import Chat from './pages/Chat/chat'
import Login from './pages/login/login'
import ProfileUpdate from './pages/profileUpdate/profileUpdate'

import { ToastContainer } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import { useContext, useEffect } from 'react'
import { auth } from './config/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { AppContext } from './context/AppContext'
  

function App() {
  const navigate = useNavigate()
  const {loadUserData} = useContext(AppContext)

  useEffect(function(){
    onAuthStateChanged(auth, async(user)=> {
      if(user){
          navigate('/chat')
          console.log(user)
          await loadUserData(user.uid)
      }else{
        navigate('/')
      }
    })
  }, [])

  return (
    <>
    <ToastContainer/>
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/chat' element={<Chat/>}/>
      <Route path='/profile' element={<ProfileUpdate/>}/>
    </Routes>
    </>
  )
}

export default App
