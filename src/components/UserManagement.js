
import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from '../firebaseConfig';
import EditModal from './EditModal';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '', status: 'active', password: '' });
  const [editUser, setEditUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    setIsModalOpen(false);
  };

  const handleDeleteUser = async (id) => {
    await deleteDoc(doc(db, "users", id));
    setUsers(users.filter(user => user.id !== id));
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setEditUser({ ...editUser, [name]: value });
  };

  const openEditModal = (user) => {
    setEditUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="container">
      <h2>User Management</h2>

      <form onSubmit={handleAddUser}>
        <input
          type="text"
          name="name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          placeholder="Name"
        />
        <input
          type="email"
          name="email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          placeholder="Email"
        />
        <input
          type="text"
          name="role"
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          placeholder="Role"
        />
        <input
          type="password"
          name="password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          placeholder="Password"
        />
        <select
          name="status"
          value={newUser.status}
          onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button type="submit">Add User</button>
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
                <button onClick={() => openEditModal(user)}>Edit</button>
                <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editUser && (
        <EditModal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          data={editUser}
          handleInputChange={handleUserChange}
          handleSubmit={(e) => {
            e.preventDefault();
            handleEditUser(editUser.id, editUser);
          }}
        />
      )}
    </div>
  );
};

export default UserManagement;
