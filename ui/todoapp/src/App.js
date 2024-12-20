import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const API_URL = "http://localhost:5038/";

  useEffect(() => {
    refreshNotes();
  }, []);

  const refreshNotes = async () => {
    try {
      const response = await fetch(API_URL + "api/todoapp/GetNotes");
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      alert("Error loading notes");
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return alert("Note cannot be empty!");
    const formData = new FormData();
    formData.append("newNotes", newNote);
    try {
      await fetch(API_URL + "api/todoapp/AddNotes", {
        method: "POST",
        body: formData,
      });
      setNewNote('');
      refreshNotes();
    } catch (error) {
      alert("Error adding note");
    }
  };

  const deleteNote = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await fetch(API_URL + `api/todoapp/DeleteNotes?id=${id}`, {
        method: "DELETE",
      });
      refreshNotes();
    } catch (error) {
      alert("Error Deleting Note");
    }
  };

  return (
    <div className="App">
      <h2>Todo App</h2>
      <div className="input-container">
        <input type="text" value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Add new note"/>
        <button onClick={addNote}>Add</button>
      </div>
      <div className="notes-container">
        <div className="notes-list">
          {notes.map((note) => (
            <div key={note.id} className="note-item">{note.description}</div>
          ))}
        </div>
        <div className="button-container">
          {notes.map((note) => (
            <button key={note.id} onClick={() => deleteNote(note.id)}>Delete</button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;