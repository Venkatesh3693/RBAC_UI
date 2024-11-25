import React, { useState } from 'react';

const Note = ({ note, user, handleDeleteNote, handleUpdateNote }) => {
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(note.content);

  const handleReadClick = () => {
    setIsContentVisible(!isContentVisible);
  };

  const handleWriteClick = () => {
    setIsEditing(true);
    setIsContentVisible(true);
  };

  const handleSaveClick = () => {
    handleUpdateNote(note.id, editedContent);
    setIsEditing(false);
  };

  return (
    <div className="note">
      <h3>{note.title}</h3>
      {isContentVisible && (
        isEditing ? (
          <textarea 
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
        ) : (
          <p>{note.content}</p>
        )
      )}
      <div>
        <button onClick={handleReadClick}>
          {isContentVisible ? 'Hide' : 'Read'}
        </button>
        {(user.role === 'Admin' || user.role === 'Moderator') && (
          <>
            {isEditing ? (
              <button onClick={handleSaveClick}>Save</button>
            ) : (
              <button onClick={handleWriteClick}>Write</button>
            )}
            <button onClick={() => handleDeleteNote(note.id)}>Delete</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Note;
