import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavBar = ({ setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/'); 
  };

  return (
    <nav>
      <ul>
        <li><button onClick={() => navigate('/')}>Notes</button></li>
        <li><button onClick={() => navigate('/users')}>User Management</button></li>
        <li><button onClick={() => navigate('/roles')}>Role Management</button></li>
        <li><button onClick={() => navigate('/permissions')}>Permission Management</button></li>
        <li><button onClick={handleLogout}>Home</button></li>
      </ul>
    </nav>
  );
};

export default NavBar;
