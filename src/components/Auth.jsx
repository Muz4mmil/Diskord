import React from 'react'
import { auth, provider } from '../firbase-config'
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import Cookies from 'universal-cookie'

const cookies = new Cookies();

function Auth({setIsAuth}) {

    const signInWithGoogle = async () =>{
        try{
            const result = await signInWithPopup(auth, provider)
            console.log(result);
            cookies.set('auth-token', result.user.refreshToken)
            setIsAuth(true)
        }catch(err){
            console.error(err);
        }
    }

  return (
    <div className="auth">
        <p>Sign in with Google</p>
        <button onClick={signInWithGoogle}><i class="fa-brands fa-google"></i>Sign in with Google</button>
    </div>
  )
}

export default Auth