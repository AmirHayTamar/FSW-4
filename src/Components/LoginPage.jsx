import React, { useState } from 'react';
import App from './App';
import { registerUser, loginUser } from '../DB/StorageUtils'; // כמובן נתאים את הנתיב
import { setCurrentUserUtils} from '../DB/StorageUtils';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [resoot,setResoot] =useState(false);

  const handleLogin = () => {
    const result = loginUser(username, password);
    if (result.success) {
      setCurrentUserUtils(username);
      setResoot(true);
      return <App currentUser={username}/>;
    } else {
      alert(result.message);
    }
  };
  
  const handleRegister = () => {
    const result = registerUser(username, password);
    if (result.success) {
      setCurrentUserUtils(username);
      setResoot(true);
      return <App currentUser={username}/>;
    } else {
      alert(result.message);
    }
  };
  if(resoot){
    return <App currentUser={username}/>;
  }
  return (
<div className="login-page">
  <h2>התחברות</h2>
  <input
    type="text"
    placeholder="שם משתמש"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
  />
  <input
    type="password"
    placeholder="סיסמה"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
  <div>
    <button onClick={handleLogin}>התחבר</button>
    <button onClick={handleRegister}>הרשם</button>
  </div>
</div>

  );
};

export default LoginPage;
