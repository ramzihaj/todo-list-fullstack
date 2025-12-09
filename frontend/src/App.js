import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ text: '', category: 'Personnel' });
  const [theme, setTheme] = useState('light');  // Thème sombre/clair
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    fetchTasks();
    document.body.className = theme;  // Applique le thème
  }, [theme]);

  const fetchTasks = async () => {
    const res = await axios.get('http://localhost:5000/tasks');
    setTasks(res.data);
  };

  const addTask = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/tasks', newTask);
    setNewTask({ text: '', category: 'Personnel' });
    fetchTasks();
  };

  const toggleTask = async (id, completed) => {
    await axios.put(`http://localhost:5000/tasks/${id}`, { completed: !completed });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/tasks/${id}`);
    fetchTasks();
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = async (id) => {
    await axios.put(`http://localhost:5000/tasks/${id}`, { text: editText });
    setEditingId(null);
    fetchTasks();
  };

  const categories = ['Personnel', 'Travail', 'Urgent'];  // Vos catégories personnalisables

  return (
    <div className={`app ${theme}`}>
      <header>
        <h1>Ma To-Do List Personnalisée</h1>
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          {theme === 'light' ? '🌙 Sombre' : '☀️ Clair'}
        </button>
      </header>
      <form onSubmit={addTask}>
        <input
          type="text"
          value={newTask.text}
          onChange={(e) => setNewTask({ ...newTask, text: e.target.value })}
          placeholder="Nouvelle tâche..."
          required
        />
        <select value={newTask.category} onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <button type="submit">Ajouter</button>
      </form>
      <ul>
        {tasks.map(task => (
          <li key={task._id} className={task.completed ? 'completed' : ''}>
            {editingId === task._id ? (
              <>
                <input value={editText} onChange={(e) => setEditText(e.target.value)} />
                <button onClick={() => saveEdit(task._id)}>Sauvegarder</button>
              </>
            ) : (
              <>
                <span onClick={() => toggleTask(task._id, task.completed)}>
                  {task.text} ({task.category})
                </span>
                <button onClick={() => startEdit(task._id, task.text)}>Éditer</button>
                <button onClick={() => deleteTask(task._id)}>Supprimer</button>
              </>
            )}
          </li>
        ))}
      </ul>
      <style jsx>{`
        .app { min-height: 100vh; padding: 20px; transition: background 0.3s; }
        .light { background: #f0f0f0; color: #333; }
        .dark { background: #333; color: #f0f0f0; }
        header { display: flex; justify-content: space-between; align-items: center; }
        form { display: flex; gap: 10px; margin: 20px 0; }
        input, select, button { padding: 10px; border: 1px solid #ccc; border-radius: 5px; }
        ul { list-style: none; padding: 0; }
        li { display: flex; align-items: center; gap: 10px; padding: 10px; border: 1px solid #ddd; margin: 5px 0; border-radius: 5px; }
        .completed { text-decoration: line-through; opacity: 0.6; }
        button { background: ${theme === 'light' ? '#007bff' : '#0056b3'}; color: white; cursor: pointer; }
      `}</style>
    </div>
  );
}

export default App;