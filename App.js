import React, { useEffect, useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
    apiKey: "AIzaSyC50OOffMlBZZoy4CF8XhpPotdTFZstYmM",
    authDomain: "swe632chatv5.firebaseapp.com",
    projectId: "swe632chatv5",
    storageBucket: "swe632chatv5.appspot.com",
    messagingSenderId: "76269418867",
    appId: "1:76269418867:web:a3a4c376b879626f01ad06",
    measurementId: "G-1P53J3TGMN"
})

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();


function App() {

  const [user] = useAuthState(auth);
    
  return (
    <div className="App">
      <header className="App-header">
        <h1>⚛️🔥💬  SWE 632 Chat</h1>
        <Help /> <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
      
    </div>
  );
}


function SignIn() {

  const signInWithGoogle = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      auth.signInWithPopup(provider);
  }

  const signInWithFacebook = () => {
    var provider = new firebase.auth.FacebookAuthProvider();
      provider.setCustomParameters({
        'display': 'popup'
      });
      auth.signInWithPopup(provider);
  };
	
  return (
    <section> <div> <center> <p></p> <p> React ⚛️ and Firebase 🔥 technology inside.</p> </center>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button> <p> </p>
      </div> <div>	  
      <button className="sign-in" onClick={signInWithFacebook}>Sign in with Facebook</button> 
      </div> <div> <center>
      <p> Please be respectful to others on this site, or you may be banned!</p>
      </center> </div>
      <div> <center> <p> </p> <p> </p>
      <p> <b>About this app:</b> The SWE632 Chat App allows users to log in securely and exchange messages. It originated as a project by Bruce and Matt for their SWE 632 (User Interface Design and Development) class at George Mason University in 2021.</p>
      </center> </div>
      <div> <center>
      <p> <b>About login security:</b> The SWE632 Chat App utilizes secure login services provided by Google and Facebook. User sign-in information is sent encrypted directly to the provider; if correct, the provider sends the Chat App an authentication token showing the user's email address. Passwords are not shared with the Chat App.</p>
      </center> </div>
    </section>
  )

}


function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function Help() {
  return (
    <button className="help" onClick={() => alert("Welcome to SWE632 Chat! First, sign in using your Google or Facebook account. Then, click in the area labeled 'Click here to compose a message' at the bottom of the screen to enter a text message, and click Send. The newest messages will appear at the bottom of the list, so you can scroll up to read older messages.")}>Help</button>
  )
}


function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt');

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => {
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages])
    
  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="... Click here to compose a message ..." />

      <button type="submit" disabled={!formValue}>Send</button>

    </form>
  </>)
}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>)
}


export default App;
