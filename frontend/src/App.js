import React, { useState, useEffect } from 'react';
import './App.css';

const url = 'https://todolist-backend-ui76.onrender.com/api';

function App() {
  const [dailyChores, setDailyChores] = useState([]);
  const [dailyChoreText, setDailyChoreText] = useState('');

  const [allChores, setAllChores] = useState([]);
  const [allChoreText, setAllChoreText] = useState('');
  const [newChoreDeadline, setNewChoreDeadline] = useState('');
  const [newChoreTime, setNewChoreTime] = useState('');

  useEffect(() => {
    fetchChores();
    fetchDailyChores();
  }, []);

  const fetchChores = async () => {
    try {
      const response = await fetch(`${url}/chores`);
      const data = await response.json();
      setAllChores(data);
    } catch (error) {
      console.error('Failed to fetch chores:', error);
      setAllChores([]);
    }
  };

  const fetchDailyChores = async ()=>{
    try{
      const response = await fetch(`${url}/dailychores`);
      const data = await response.json();
      setDailyChores(data);
    }
    catch(err)
    {
      console.log('Failed to fetch Daily Chores: ', err);
      setDailyChores([]);
    } 
  };

  const handleAddChore = async (listType) => {
    if (listType === 'daily') {
      if (dailyChoreText === '') return;
      const response = await fetch(`${url}/dailychores`, {
        method : 'POST',
        headers: {'Content-type': 'application/json'},
        body : JSON.stringify({ title: dailyChoreText })
      });
      if(response.ok) 
      {
        fetchDailyChores();
        setDailyChoreText('');
      }
    } else {
      if (allChoreText.trim() === '') return;
      const response = await fetch(`${url}/chores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: allChoreText, date: newChoreDeadline, time: newChoreTime }),
      });
      if (response.ok) {
        setAllChoreText('');
        setNewChoreDeadline('');
        setNewChoreTime('');
        fetchChores();
      }
    }
  };

  const handleDeleteChore = async (listType, choreId) => {
    if (listType === 'daily') {
      const response = await fetch(`${url}/dailychores/${choreId}`, {method: 'DELETE'});
      if(response.ok) fetchDailyChores();
      
    } else {
      const response = await fetch(`${url}/chores/${choreId}`, { method: 'DELETE' });
      if (response.ok) fetchChores();
    }
  };

  const handleEditChore = async (listType, chore) => {
    if (listType === 'daily') {
      const newText = prompt('Edit chore:', chore.title);
      if (newText !== null && newText.trim() !== '') {
        const updatedChore = {title: newText || chore.title};
        const response = await fetch(`${url}/dailychores/${chore._id}`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body : JSON.stringify(updatedChore),
        });
        if(response.ok) fetchDailyChores();
      }
    } else {
      const newText = prompt('Edit chore:', chore.title);
      const newDeadline = prompt('Edit deadline (YYYY-MM-DD):', chore.date);
      const newTime = prompt('Edit time (HH:MM):', chore.time);

      if (newText !== null || newDeadline !== null || newTime !== null) {
        const updatedChore = {
          title: newText || chore.title,
          date: newDeadline || chore.date,
          time: newTime || chore.time
        };
        const response = await fetch(`${url}/chores/${chore._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedChore),
        });

        if(response.ok) fetchChores();

      }
    }
  };

  const renderChoreItem = (chore, listType) => {
    const isDailyChoreString = listType === 'daily' && typeof chore === 'string';

    return (
      <div key={chore._id || chore} className="chore-item">
        {isDailyChoreString ? (
          <span>{chore}</span>
        ) : (
          <span>
            {listType === 'daily' ? chore.title : chore.title} <br />
            {listType === 'all' && (
              <small>Deadline: {chore.date || 'N/A'} at {chore.time || 'N/A'}</small>
            )}
          </span>
        )}
        <div className="chore-actions">
          <button onClick={() => handleEditChore(listType, chore)}>Edit</button>
          <button onClick={() => handleDeleteChore(listType, chore._id)}>Delete</button>
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      <h1>To-Do List</h1>
      <div className="main-content">
        
        <div className="list-section left-section">
          <h2>Daily Chores</h2>
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Add a new daily chore" 
              value={dailyChoreText}
              onChange={(e) => setDailyChoreText(e.target.value)}
            />
            <button className="add-button" onClick={() => handleAddChore('daily')}>Add</button>
          </div>
          <div className="chore-list">
            {Array.isArray(dailyChores) && dailyChores.map((chore, index) => renderChoreItem(chore, 'daily'))}
          </div>
        </div>

        <div className="list-section middle-section">
          <h2>Add Chores with Deadlines</h2>
          <div className="input-group-vertical">
            <input 
              type="text" 
              placeholder="Chore name" 
              value={allChoreText}
              onChange={(e) => setAllChoreText(e.target.value)}
            />
            <input
              type="date"
              value={newChoreDeadline}
              onChange={(e) => setNewChoreDeadline(e.target.value)}
            />
            <input
              type="time"
              value={newChoreTime}
              onChange={(e) => setNewChoreTime(e.target.value)}
            />
            <button className="add-button" onClick={() => handleAddChore('all')}>Add</button>
          </div>
        </div>

        <div className="list-section right-section">
          <h2>All Chores</h2>
          <div className="chore-list">
            {Array.isArray(allChores) && allChores.map((chore) => renderChoreItem(chore, 'all'))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;