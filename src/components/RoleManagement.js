import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from '../firebaseConfig';
import EditModal from './EditModal';

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState({ name: '', permissions: '' });
  const [editRole, setEditRole] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    setIsModalOpen(false);
  };

  const handleDeleteRole = async (id) => {
    await deleteDoc(doc(db, "roles", id));
    setRoles(roles.filter(role => role.id !== id));
  };

  const handleRoleChange = (e) => {
    const { name, value } = e.target;
    setEditRole({ ...editRole, [name]: value });
  };

  const openEditModal = (role) => {
    setEditRole(role);
    setIsModalOpen(true);
  };

  return (
    <div className="container">
      <h2>Role Management</h2>

      <form onSubmit={(e) => { e.preventDefault(); handleAddRole(); }}>
        <input
          type="text"
          name="name"
          value={newRole.name}
          onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
          placeholder="Role Name"
        />
        <input
          type="text"
          name="permissions"
          value={newRole.permissions}
          onChange={(e) => setNewRole({ ...newRole, permissions: e.target.value })}
          placeholder="Permissions (comma-separated)"
        />
        <button type="submit">Add Role</button>
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
              <td>{role.permissions}</td>
              <td>
                <button onClick={() => openEditModal(role)}>Edit</button>
                <button onClick={() => handleDeleteRole(role.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editRole && (
        <EditModal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          data={editRole}
          handleInputChange={handleRoleChange}
          handleSubmit={(e) => {
            e.preventDefault();
            handleEditRole(editRole.id, editRole);
          }}
        />
      )}
    </div>
  );
};

export default RoleManagement;
