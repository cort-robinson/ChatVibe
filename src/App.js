/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import './App.css';

import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
// import firebase from 'firebase/compat/app';
import { initializeApp } from 'firebase/app';
// import { getAnalytics } from "firebase/analytics";
// import 'firebase/compat/firestore';
import { getFirestore, collection, FieldValue, query, orderBy, limit } from 'firebase/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';



const firebaseConfig = {
  apiKey: "AIzaSyCKw8zkQtr5z4oG1z1pzWtJR84yjvTbWeA",
  authDomain: "chatvibe-686ed.firebaseapp.com",
  projectId: "chatvibe-686ed",
  storageBucket: "chatvibe-686ed.appspot.com",
  messagingSenderId: "938234616449",
  appId: "1:938234616449:web:d071fb1bd3cd8cbd184b80",
  measurementId: "G-ZDP2DYD4JJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore();


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header">
        <h1>ChatVibe</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  );
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => signOut(auth)}>Sign Out</button>
  );
}

function ChatRoom() {
  const messagesRef = collection(db, 'messages');
  const q = query(messagesRef, orderBy('createdAt'), limit(25));

  const [messages] = useCollectionData(q, { idField: 'id' });

  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');
  };

  return (
    <>
      <div>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      </div>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button type='submit'>send</button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <>
      <div className={`message ${messageClass}`}>
        <img src={photoURL} alt='' />
        <p>{text}</p>
      </div>
    </>
  );
}

export default App;
