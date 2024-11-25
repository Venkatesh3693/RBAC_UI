import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from '../firebaseConfig';
import NoteList from '../components/NoteList';

const Notes = ({ user }) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });

  useEffect(() => {
    const fetchNotes = async () => {
      const querySnapshot = await getDocs(collection(db, "notes"));
      setNotes(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchNotes();
  }, []);

  const handleAddNote = async () => {
    if (newNote.title && newNote.content) {
      const docRef = await addDoc(collection(db, "notes"), newNote);
      setNotes([{ id: docRef.id, ...newNote }, ...notes]);
      setNewNote({ title: '', content: '' });
    }
  };

  const handleDeleteNote = async (id) => {
    await deleteDoc(doc(db, "notes", id));
    setNotes(notes.filter(note => note.id !== id));
  };

  const handleUpdateNote = async (id, updatedContent) => {
    const noteRef = doc(db, "notes", id);
    await updateDoc(noteRef, { content: updatedContent });
    setNotes(notes.map(note => note.id === id ? { ...note, content: updatedContent } : note));
  };

  return (
    <div className="container">
      <h2>Notes</h2>
      {(user.role === 'Admin' || user.role === 'Moderator') && (
        <div>
          <input
            type="text"
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            placeholder="Title"
          />
          <textarea
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            placeholder="Content"
            maxLength="2000"
          ></textarea>
          <button onClick={handleAddNote}>+</button>
        </div>
      )}
      <NoteList
        notes={notes}
        user={user}
        handleDeleteNote={handleDeleteNote}
        handleUpdateNote={handleUpdateNote}
      />
    </div>
  );
};

export default Notes;
