import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from '../firebaseConfig';

const Login = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const q = query(collection(db, "users"), where("email", "==", username), where("password", "==", password));
      const querySnapshot = await getDocs(q);
      const user = querySnapshot.docs.map(doc => doc.data()).find(user => user.email === username && user.password === password);

      if (user) {
        setUser(user);
        navigate('/');
      } else {
        alert('Invalid username or password');
      }
    } catch (error) {
      console.error("There was an error logging in!", error);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
