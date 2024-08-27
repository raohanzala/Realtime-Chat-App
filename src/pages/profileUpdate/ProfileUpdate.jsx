import { useContext, useEffect, useState } from 'react'
import './ProfileUpdate.css'
import assets from '../../assets/assets'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../../config/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import upload from '../../lib/upload'
import { AppContext } from '../../context/AppContext'
import { setDoc } from 'firebase/firestore';

const ProfileUpdate = () => {

  const navigate = useNavigate()

  const [image, setImage] = useState(false)
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [uid, setUid] = useState('')
  const [prevImage, setPrevImage] = useState('')

  const {setUserData} = useContext(AppContext)

  console.log(bio)

  // const profileUpdate= async (e)=>{
  //   e.preventDefault()
  //   try {
  //     if(!prevImage && !image) {
  //       toast.error('Upload profile picture')
  //     }

  //     const docRef = doc(db, 'users', uid)

  //     console.log("Updating document with UID:", uid);
  //   console.log("Name:", name);
  //   console.log("Bio:", bio);
  //   console.log("Image:", image ? image.name : "No new image");
  //   console.log("Previous Image:", prevImage);


  //     if(image){
  //       const imgUrl = await upload(image)
  //       setPrevImage(imgUrl)
  //       await updateDoc(docRef, {
  //         avatar : imgUrl,
  //         bio : bio,
  //         name : name
  //       })
  //     }else{
  //       await updateDoc(docRef, {
  //         bio : bio,
  //         name : name
  //       })
  //     }

  //     const snap = await getDoc(docRef)
  //     setUserData(snap.data())
  //     navigate('/chat')

  //   } catch (error) {
  //     console.error(error)
  //     toast.error(error.message)
  //   }
  // }


  // useEffect(()=>{
  //   onAuthStateChanged(auth, async(user)=> {
  //     if(user){
  //       setUid(user.uid)
  //       const docsRef = doc(db, 'users', user.uid)  
  //       const docSnap = await getDoc(docsRef)
  //       if(docSnap.data().name){
  //         setName( docSnap.data().name)
  //       }
  //       if(docSnap.data().bio){
  //         setBio( docSnap.data().bio)
  //       }
  //       if(docSnap.data().avatar){
  //         setPrevImage( docSnap.data().avatar)
  //       }
  //     }else{
  //       navigate('/')
  //     }
  //   })
  // },[])



const profileUpdate = async (e) => {
  e.preventDefault();
  try {
    if (!prevImage && !image) {
      toast.error('Upload profile picture');
      return;
    }

    const docRef = doc(db, 'users', uid);

    // Data to be updated or created
    const updateData = {
      bio: bio || '', // Default to empty string if undefined
      name: name || '', // Default to empty string if undefined
    };

    if (image) {
      const imgUrl = await upload(image);
      setPrevImage(imgUrl);
      updateData.avatar = imgUrl;
    }

    // Create or update the document
    await setDoc(docRef, updateData, { merge: true });

    const snap = await getDoc(docRef);
    setUserData(snap.data());
    navigate('/chat');

  } catch (error) {
    console.error("Error in profileUpdate:", error);
    toast.error(error.message);
  }
};


useEffect(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log("User UID:", user.uid);
      setUid(user.uid);
      const docsRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docsRef);

      if (!docSnap.exists()) {
        // Create an empty document if it doesn't exist
        await setDoc(docsRef, { name: '', bio: '', avatar: '' });
      } else {
        const userData = docSnap.data();
        setName(userData.name || '');
        setBio(userData.bio || '');
        setPrevImage(userData.avatar || '');
      }
    } else {
      navigate('/');
    }
  });
}, [navigate]);



  return (
    <div className='profile'>
      <div className="profile-container">
        <form onSubmit={profileUpdate}>
          <h3>Profile Details</h3>
          <label htmlFor='avatar'>
            <input onChange={(e)=>{
              console.log(e)
              setImage(e.target.files[0])}} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden />
            <img  src={image ? URL.createObjectURL(image) : assets.avatar_icon} alt="" />
            upload profile image
          </label>          

          <input onChange={(e)=> setName(e.target.value)} value={name} type="text" placeholder='Your name' required />
          <textarea onChange={(e)=> setBio(e.target.value) } value={bio} placeholder='Write profile bio' required></textarea>
          <button type='submit'>Save</button>
        </form>

        <img className='profile-pic' src={image ? URL.createObjectURL(image) : prevImage ? prevImage  : assets.logo_icon} alt="" />
      </div>
    </div>
  )
}

export default ProfileUpdate