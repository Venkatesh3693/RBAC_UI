
import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from '../firebaseConfig';
import EditModal from './EditModal';

const PermissionManagement = () => {
  const [permissions, setPermissions] = useState([]);
  const [newPermission, setNewPermission] = useState({ name: '' });
  const [editPermission, setEditPermission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPermissions = async () => {
      const querySnapshot = await getDocs(collection(db, "permissions"));
      setPermissions(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchPermissions();
  }, []);

  const handleAddPermission = async () => {
    if (newPermission.name) {
      const docRef = await addDoc(collection(db, "permissions"), newPermission);
      setPermissions([...permissions, { id: docRef.id, ...newPermission }]);
      setNewPermission({ name: '' });
    }
  };

  const handleEditPermission = async (id, updatedPermission) => {
    const permissionRef = doc(db, "permissions", id);
    await updateDoc(permissionRef, updatedPermission);
    setPermissions(permissions.map(permission => (permission.id === id ? updatedPermission : permission)));
    setEditPermission(null);
    setIsModalOpen(false);
  };

  const handleDeletePermission = async (id) => {
    await deleteDoc(doc(db, "permissions", id));
    setPermissions(permissions.filter(permission => permission.id !== id));
  };

  const handlePermissionChange = (e) => {
    const { name, value } = e.target;
    setEditPermission({ ...editPermission, [name]: value });
  };

  const openEditModal = (permission) => {
    setEditPermission(permission);
    setIsModalOpen(true);
  };

  return (
    <div className="container">
      <h2>Permission Management</h2>

      <form onSubmit={handleAddPermission}>
        <input
          type="text"
          name="name"
          value={newPermission.name}
          onChange={(e) => setNewPermission({ ...newPermission, name: e.target.value })}
          placeholder="Permission Name"
        />
        <button type="submit">Add Permission</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Permission Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {permissions.map((permission) => (
            <tr key={permission.id}>
              <td>{permission.name}</td>
              <td>
                <button onClick={() => openEditModal(permission)}>Edit</button>
                <button onClick={() => handleDeletePermission(permission.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editPermission && (
        <EditModal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          data={editPermission}
          handleInputChange={handlePermissionChange}
          handleSubmit={(e) => {
            e.preventDefault();
            handleEditPermission(editPermission.id, editPermission);
          }}
        />
      )}
    </div>
  );
};

export default PermissionManagement;
