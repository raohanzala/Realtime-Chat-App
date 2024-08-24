import React, { useState } from 'react'
import assets from '../../assets/assets'
import './Login.css'
import { login, resetPass, signup } from '../../config/firebase'

const Login = () => {

  const [currState, setCurrState] = useState('Sign Up')
  const [userName , setUserName ] = useState('')
  const [email , setEmail ] = useState('')
  const [password , setPassword ] = useState('')

  function onSubmitHandler(e){
e.preventDefault()
if(currState === 'Sign Up') {
  signup(userName, email, password)
}else{
  login(email, password)
}
  }

  return (
    <div className='login'>
      <img src={assets.logo_big} alt="" />
    <form  onSubmit={onSubmitHandler}  className='login-form'>
      <h2>{currState}</h2>
      {currState === 'Sign Up' && <input onChange={(e)=> setUserName(e.target.value)} value={userName} type="text" placeholder='username' className='form-input' required />}
      <input onChange={(e)=> setEmail(e.target.value)} value={email} type="email" placeholder='Email Address' className='form-input' required />
      <input onChange={(e)=> setPassword(e.target.value)} value={password} type="password" placeholder='password' className='form-input' required />
 
      <button type='submit'>{currState === 'Sign Up' ? 'Create account' : "Login Now"}</button>

      <div className="login-term">
        <input type="checkbox" />
        <p>Agree to the term of use & privacy policy.</p>
      </div>
      <div className="login-forgot">

{
currState === 'Sign Up' ? <p className='login-toggle'>Already have an account <span onClick={()=> setCurrState('Login')}>Login here</span></p> : <p className='login-toggle'>Create an account <span onClick={()=> setCurrState('Sign Up')}>click here</span></p>
} 
{currState === 'Login' ? <p className='login-toggle'>Forgot Password ? <span onClick={()=> resetPass(email)}>reset here</span></p> : null}

      </div>
    </form>
    </div>
  )
}

export default Login