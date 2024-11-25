import React from 'react';
import Note from './Note';

const NoteList = ({ notes, user, handleDeleteNote, handleUpdateNote }) => {
  return (
    <div>
      {notes.map(note => (
        <Note 
          key={note.id} 
          note={note} 
          user={user} 
          handleDeleteNote={handleDeleteNote} 
          handleUpdateNote={handleUpdateNote}
        />
      ))}
    </div>
  );
};

export default NoteList;
