import { useRef, useState } from 'react'
import './App.css'
import './styles.scss'
import Auth from './components/Auth'
import Cookies from 'universal-cookie'
import Chats from './components/Chats';
import AIChat from './components/AIChat';
import { signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { auth } from './firbase-config';

const cookies = new Cookies();

function App() {

  const [isAuth, setIsAuth] = useState(cookies.get('auth-token'))
  const [room, setRoom] = useState(null)

  const roomInputRef = useRef(null)

  const signUserOut = async () => {
    await signOut(auth);
    cookies.remove("auth-token")
    setIsAuth(false)
    setRoom(null)
  }


  if (!isAuth) {
    return (
      <>
        <Auth setIsAuth={setIsAuth} />
      </>
    )
  }

  return (
    <>
      {room ? room == 'AI' ? (<AIChat room={room} setRoom={setRoom} signUserOut={signUserOut} />) : 
      (<Chats room={room} setRoom={setRoom} signUserOut={signUserOut} />)
       : (
        <>
          <div className="welcome">
            <h1>Welcome to <br /><span>Diskord</span></h1>
            <p>Join a Room and chat with friends or chill out with AI</p>
          </div>
          <div className="room">
            <p>Enter Room Name</p>
            <input ref={roomInputRef} />
            <button onClick={() => {
              setRoom(roomInputRef.current.value);
              console.log(roomInputRef.current.value);
            }}>Enter Room</button>
          </div>
          <br />
          <div className="room">
            <button onClick={() => {
              setRoom("AI");
              console.log(roomInputRef.current.value);
            }}>Chat with AI</button>
          </div>
        </>
      )}
  
      <a href="https://muz4mmil.github.io" class="credit" target="_blank">- by @Muzammil</a>
    </>)
}

export default App
