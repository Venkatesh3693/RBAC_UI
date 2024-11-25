import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from '../firebaseConfig';

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState({ name: '', permissions: '' });
  const [editRole, setEditRole] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      const querySnapshot = await getDocs(collection(db, "roles"));
      setRoles(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchRoles();
  }, []);

  const handleAddRole = async () => {
    if (newRole.name && newRole.permissions) {
      const docRef = await addDoc(collection(db, "roles"), newRole);
      setRoles([...roles, { id: docRef.id, ...newRole }]);
      setNewRole({ name: '', permissions: '' });
    }
  };

  const handleEditRole = async (id, updatedRole) => {
    const roleRef = doc(db, "roles", id);
    await updateDoc(roleRef, updatedRole);
    setRoles(roles.map(role => (role.id === id ? updatedRole : role)));
    setEditRole(null);
  };

  const handleDeleteRole = async (id) => {
    await deleteDoc(doc(db, "roles", id));
    setRoles(roles.filter(role => role.id !== id));
  };

  const handleRoleChange = (e) => {
    const { name, value } = e.target;
    if (editRole) {
      setEditRole({ ...editRole, [name]: value });
    } else {
      setNewRole({ ...newRole, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editRole) {
      handleEditRole(editRole.id, editRole);
    } else {
      handleAddRole(newRole);
      setNewRole({ name: '', permissions: '' });
    }
  };

  const handleEditClick = (role) => {
    setEditRole(role);
  };

  return (
    <div className="container">
      <h2>Role Management</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={editRole ? editRole.name : newRole.name}
          onChange={handleRoleChange}
          placeholder="Role Name"
        />
        <input
          type="text"
          name="permissions"
          value={editRole ? editRole.permissions : newRole.permissions}
          onChange={handleRoleChange}
          placeholder="Permissions (comma-separated)"
        />
        <button type="submit">{editRole ? 'Edit Role' : 'Add Role'}</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Role Name</th>
            <th>Permissions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td>{role.name}</td>
              <td>{role.permissions.split(',').join(', ')}</td>
              <td>
                <button onClick={() => handleEditClick(role)}>Edit</button>
                <button onClick={() => handleDeleteRole(role.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoleManagement;
