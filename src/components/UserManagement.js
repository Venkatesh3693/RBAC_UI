import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from '../firebaseConfig';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '', status: 'active', password: '' });
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      setUsers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    const docRef = await addDoc(collection(db, "users"), newUser);
    setUsers([...users, { id: docRef.id, ...newUser }]);
    setNewUser({ name: '', email: '', role: '', status: 'active', password: '' });
  };

  const handleEditUser = async (id, updatedUser) => {
    const userRef = doc(db, "users", id);
    await updateDoc(userRef, updatedUser);
    setUsers(users.map(user => (user.id === id ? updatedUser : user)));
    setEditUser(null);
  };

  const handleDeleteUser = async (id) => {
    await deleteDoc(doc(db, "users", id));
    setUsers(users.filter(user => user.id !== id));
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    if (editUser) {
      setEditUser({ ...editUser, [name]: value });
    } else {
      setNewUser({ ...newUser, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editUser) {
      handleEditUser(editUser.id, editUser);
    } else {
      handleAddUser(newUser);
      setNewUser({ name: '', email: '', role: '', status: 'active', password: '' });
    }
  };

  const handleEditClick = (user) => {
    setEditUser(user);
  };

  return (
    <div className="container">
      <h2>User Management</h2>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={editUser ? editUser.name : newUser.name}
          onChange={handleUserChange}
          placeholder="Name"
        />
        <input
          type="email"
          name="email"
          value={editUser ? editUser.email : newUser.email}
          onChange={handleUserChange}
          placeholder="Email"
        />
        <input
          type="text"
          name="role"
          value={editUser ? editUser.role : newUser.role}
          onChange={handleUserChange}
          placeholder="Role"
        />
        <input
          type="password"
          name="password"
          value={editUser ? editUser.password : newUser.password}
          onChange={handleUserChange}
          placeholder="Password"
        />
        <label>
          Status:
          <select
            name="status"
            value={editUser ? editUser.status : newUser.status}
            onChange={handleUserChange}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>
        <button type="submit">{editUser ? 'Edit User' : 'Add User'}</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Password</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.status === 'active' ? 'Active' : 'Inactive'}</td>
              <td>{user.password}</td>
              <td>
                <button onClick={() => handleEditClick(user)}>Edit</button>
                <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editUser && (
        <div>
          <input
            type="text"
            name="name"
            value={editUser.name}
            onChange={handleUserChange}
            placeholder="Name"
          />
          <input
            type="email"
            name="email"
            value={editUser.email}
            onChange={handleUserChange}
            placeholder="Email"
          />
          <input
            type="text"
            name="role"
            value={editUser.role}
            onChange={handleUserChange}
            placeholder="Role"
          />
          <input
            type="password"
            name="password"
            value={editUser.password}
            onChange={handleUserChange}
            placeholder="Password"
          />
          <label>
            Status:
            <select
              name="status"
              value={editUser.status}
              onChange={handleUserChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
          <button onClick={() => handleEditUser(editUser.id, editUser)}>Save</button>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
