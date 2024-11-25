import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from '../firebaseConfig';

const PermissionManagement = () => {
  const [permissions, setPermissions] = useState([]);
  const [newPermission, setNewPermission] = useState({ name: '' });
  const [editPermission, setEditPermission] = useState(null);

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
  };

  const handleDeletePermission = async (id) => {
    await deleteDoc(doc(db, "permissions", id));
    setPermissions(permissions.filter(permission => permission.id !== id));
  };

  const handlePermissionChange = (e) => {
    const { name, value } = e.target;
    if (editPermission) {
      setEditPermission({ ...editPermission, [name]: value });
    } else {
      setNewPermission({ ...newPermission, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editPermission) {
      handleEditPermission(editPermission.id, editPermission);
    } else {
      handleAddPermission(newPermission);
      setNewPermission({ name: '' });
    }
  };

  const handleEditClick = (permission) => {
    setEditPermission(permission);
  };

  return (
    <div className="container">
      <h2>Permission Management</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={editPermission ? editPermission.name : newPermission.name}
          onChange={handlePermissionChange}
          placeholder="Permission Name"
        />
        <button type="submit">{editPermission ? 'Edit Permission' : 'Add Permission'}</button>
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
                <button onClick={() => handleEditClick(permission)}>Edit</button>
                <button onClick={() => handleDeletePermission(permission.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PermissionManagement;
