import React, { useState } from 'react'
import { auth, provider } from '../firbase-config'
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import Cookies from 'universal-cookie'

const cookies = new Cookies();

function Auth({ setIsAuth }) {
  const [currentSection, setCurrentSection] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider)
      console.log(result);
      cookies.set('auth-token', result.user.refreshToken)
      setIsAuth(true)
    } catch (err) {
      console.error(err);
    }
  }

  const LoginWithEmail = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      console.log(result);
      cookies.set('auth-token', result.user.refreshToken)
      setIsAuth(true)
    } catch (err) {
      console.error(err);
      alert("Invalid Email or Password")
    }
  }

  const signUpWithEmail = async (e) => {
    e.preventDefault();
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(result.user, {
        displayName: name
      })
      console.log(result);
      cookies.set('auth-token', result.user.refreshToken)
      setIsAuth(true)
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="auth">
      {currentSection == 'login' ? (
        <>
          <h1>Log In</h1>
          <form onSubmit={LoginWithEmail}>
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter your Email' />
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter your Password' />
            <button type="submit" className='button-main'>SignIn</button>
          </form>
          <div className='switch-section'>
            <p>Don't Have an account?</p>
            <button onClick={() => setCurrentSection('signup')}>Signup</button>
          </div>
        </>
      ) : (
        <>
          <h1>Sign Up</h1>
          <form onSubmit={signUpWithEmail}>
            <label htmlFor="name">Name</label>
            <input type="text" name='name' value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter Name'/>
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter your Email' />
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter your Password' />
            <button type="submit" className='button-main'>Signup</button>
          </form>
          <div className='switch-section'>
            <p>Already Have an account?</p>
            <button onClick={() => setCurrentSection('login')}>Login</button>
          </div>
        </>
      )}
      <hr />
      <button className='button-main google-btn' onClick={signInWithGoogle}><i class="fa-brands fa-google"></i>Sign in with Google</button>
    </div>
  )
}

export default Auth