

import React from 'react';
import Modal from 'react-modal';

const EditModal = ({ isOpen, onRequestClose, data, handleInputChange, handleSubmit }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Edit Modal">
      <h2>Edit Data</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(data).map(key => (
          <div key={key}>
            <label>{key}</label>
            <input
              type="text"
              name={key}
              value={data[key]}
              onChange={handleInputChange}
            />
          </div>
        ))}
        <button type="submit">Save</button>
      </form>
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
};

export default EditModal;
