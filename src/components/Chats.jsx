import React, { useEffect, useRef, useState } from 'react'
import { addDoc, collection, serverTimestamp, onSnapshot, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { auth, db } from '../firbase-config';

export default function Chats({room, setRoom, signUserOut}) {

    const [newMessage, setNewMessage] = useState("")
    const [messages, setMessages] = useState([])

    const messagesRef = collection(db, "messages")
    
    const messagesContainerRef = useRef(null);

    const scrollToBottom = () => {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      };

    useEffect(()=>{
        const queryMessages = query(messagesRef, where('room', '==', room), orderBy("createdAt", "desc"));
        const unsuscribe = onSnapshot(queryMessages, (snapshot)=>{
            let messages = [];
            snapshot.forEach((doc) =>{
                messages.push({...doc.data(), id: doc.id})
            })
            setMessages(messages)

        })
        return ()=> unsuscribe();
    }, [])

    useEffect(() => {
        scrollToBottom();
      }, [messages]);

    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (newMessage === "") return;

        await addDoc(messagesRef, {
            text: newMessage,
            createdAt: serverTimestamp(),
            user: auth.currentUser.displayName,
            room,
        })

        scrollToBottom();
        setNewMessage("")
    }

  return (
    <div className="chats">
        <div className="header"><h2>Welcome to room <br /> {room}</h2></div>
        <div className='messages' ref={messagesContainerRef}>
            {messages.length > 0 ? messages.map((message)=>
            <div className={"message animate__animated animate__fadeInUp animate__faster " + ( message.user === auth.currentUser.displayName ? "current-user" : "other-user")} key={message.id}>
                <span className='user'>{message.user.split(" ")[0]} : </span>{message.text}
            </div>
            ) : <div className='hint'>
            Ask your your friends to join the same Room and start chatting with them
          </div>}
        </div>
        <form onSubmit={handleSubmit} className="new-message">
            <input placeholder='Enter Message' className="new-message-input" onChange={(e)=> setNewMessage(e.target.value)} value={newMessage}/>
            <button type="submit" className='send-button'><i class="material-symbols-rounded">send</i></button>
        </form>

        <div className="sign-out">
            <button onClick={signUserOut}>Logout</button>
        </div>
        <div className="room-out">
            <button onClick={() => setRoom(null)}>Leave</button>
        </div>
    </div>
  )
}
