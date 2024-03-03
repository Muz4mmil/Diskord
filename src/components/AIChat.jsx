import React, { useEffect, useRef, useState } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai';
import { doc, getDocs, addDoc, collection, serverTimestamp, onSnapshot, query, where, orderBy, deleteDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { auth, db } from '../firbase-config';

const genAI = new GoogleGenerativeAI("AIzaSyBezxjI1F07jJwKpzZcm3h7M-eivh-o_RA");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export default function AIChats({ room, setRoom, signUserOut }) {

  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [chat, setChat] = useState(null)
  const [isPopupVisible, setIsPopupVisible] = useState(false)

  const messagesRef = collection(db, "AIChats")
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    const queryMessages = query(messagesRef, where('chatUser', '==', auth.currentUser.displayName), orderBy("createdAt", "desc"));
    const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      let history = [];

      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id })
      })

      if (messages.length == 0) {
        history.push({ role: 'user', parts: 'You are currently in a Chat app made by Muzammil (He is a web developer and a student), so while introducing yourself or responding to "hi", "hello" etc. you should mention Muzammil name and powered by Google\'s Gemini AI. and only if soemone asks about Muzammil, tell them that "he is a web developer and a student, click on his name in the the bottom right corner to know more about him". suggest this only if they ask about Muzammil' })
        history.push({ role: 'model', parts: 'okay i will respond just like this and I will ask user to click on Muzammil\'s name only if they ask about him' })
      }

      setMessages(messages)

      let prevMessages = [...messages].reverse()
      prevMessages.map((msg) => {
        history.push({ role: msg.role, parts: msg.parts })
      })

      const newChat = model.startChat({
        history
      });

      setChat(newChat)
      console.log('added history');
    })

    return () => unsuscribe();
  }, [isPopupVisible])

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage === "") return;

    try {
      await addDoc(messagesRef, {
        createdAt: serverTimestamp(),
        user: auth.currentUser.displayName,
        chatUser: auth.currentUser.displayName,
        role: 'user',
        parts: newMessage,
      });

      scrollToBottom();

      const prompt = newMessage;
      setNewMessage("")
      const result = await chat.sendMessage(prompt);
      const text = await result.response.text();
      await addDoc(messagesRef, {
        createdAt: serverTimestamp(),
        user: 'AI',
        chatUser: auth.currentUser.displayName,
        role: 'model',
        parts: text,
      });
      // console.log(text);
      scrollToBottom();
    } catch (error) {
      console.error("Error processing message:", error);
    }
  }

  const handleDeleteHistory = async () => {
    const queryMessages = query(messagesRef, where('chatUser', '==', auth.currentUser.displayName));
    const snapshot = await getDocs(queryMessages)

    snapshot.forEach(async (docItem) => {
      await deleteDoc(doc(db, "AIChats", docItem.id))
    });

    setMessages([])
    setIsPopupVisible(false)
  }


  const scrollToBottom = () => {
    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
  };

  return (
    <div className="chats">
      <div className="header"><h2>Chat with <br /> {room}</h2></div>
      {/* <div className="warning">
        <p>Google's Gemini AI is at it's Early stage and this Project is still in beta. The bot might sometimes respond with blank or falsy messages</p>
      </div> */}

      <div className='messages' ref={messagesContainerRef}>
        {messages.map((message) =>
          <div className={"message animate__animated animate__fadeInUp animate__faster " + (message.user === auth.currentUser.displayName ? "current-user" : "other-user")} key={message.id}>
            <span className='user'>{message.user.split(" ")[0]} : </span>{message.parts}
          </div>
        )}

      </div>
      <form onSubmit={handleSubmit} className="new-message">
        <input placeholder='Enter Message' className="new-message-input" onChange={(e) => setNewMessage(e.target.value)} value={newMessage} />
        <button type="submit" className='send-button'><i class="material-symbols-rounded">send</i></button>
      </form>

      <div className="sign-out">
        <button onClick={signUserOut}>Logout</button>
      </div>
      <div className="room-out">
        <button onClick={() => setRoom(null)}>Leave</button>
      </div>
      <div className="clear-ai">
        <button onClick={() => setIsPopupVisible(true)}>Clear Chats</button>
      </div>

      {isPopupVisible &&
        <div className='popup-window'>
          <div className="overlay"></div>
          <div className="popup">
            <p>Are you sure you wan't to clear the chats?</p>
            <div className="popup-btns">
              <button onClick={() => setIsPopupVisible(false)}>No</button>
              <button onClick={handleDeleteHistory}>Clear Chats</button>
            </div>
          </div>
        </div>}
    </div>
  )
}
