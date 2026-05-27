import React, { useState, useEffect } from 'react';
import { ref, push, onValue, remove } from 'firebase/database';
import { db } from '../firebase';
import './Thoughts.css';

const Thoughts = () => {
  const [thoughts, setThoughts] = useState([]);
  const [newThought, setNewThought] = useState('');
  const [author, setAuthor] = useState('Sharan');

  // We use the new template image from public folder for the background
  const cardStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/template.png)`
  };

  useEffect(() => {
    const thoughtsRef = ref(db, 'thoughts');
    
    // Listen for new data
    const unsubscribe = onValue(thoughtsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
        const now = Date.now();
        
        // Convert object to array, attach id, filter > 30 days, sort by timestamp
        const thoughtsArray = Object.entries(data)
          .map(([id, val]) => ({ id, ...val }))
          .filter(t => (now - t.timestamp) <= THIRTY_DAYS_MS)
          .sort((a, b) => b.timestamp - a.timestamp);
          
        setThoughts(thoughtsArray);
      } else {
        setThoughts([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = (id) => {
    const password = prompt("Enter secret password to delete this thought:");
    if (password === "sharan") {
      const thoughtRef = ref(db, `thoughts/${id}`);
      remove(thoughtRef).then(() => {
        // Successfully deleted
      }).catch((error) => {
        console.error("Error deleting thought: ", error);
        alert("Failed to delete thought.");
      });
    } else if (password !== null) {
      alert("Incorrect password!");
    }
  };

  const handlePostThought = () => {
    if (!newThought.trim()) {
      alert("Please write a thought before posting!");
      return;
    }

    const thoughtsRef = ref(db, 'thoughts');
    push(thoughtsRef, {
      text: newThought.trim(),
      author: author,
      timestamp: Date.now()
    }).then(() => {
      setNewThought(''); // Clear input
    }).catch(error => {
      console.error("Error posting thought: ", error);
      alert("Failed to post thought. Check console for details.");
    });
  };

  return (
    <div className="thoughts-section">
      <div className="input-container">
        <textarea 
          className="thought-input" 
          id="thought-input"
          style={cardStyle}
          placeholder="Share a thought..." 
          value={newThought}
          onChange={(e) => setNewThought(e.target.value)}
        ></textarea>
        
        <div className="input-controls">
          <select 
            className="author-select" 
            value={author} 
            onChange={(e) => setAuthor(e.target.value)}
          >
            <option value="Sharan">Sharan</option>
            <option value="Bhavika">Bhavika</option>
          </select>
          
          <button className="submit-thought" onClick={handlePostThought}>
            Post Thought
          </button>
        </div>
      </div>

      <div className="thoughts-container">
        {thoughts.map((thought) => (
          <div key={thought.id} className="thought-card" style={cardStyle}>
            <button className="delete-thought" onClick={() => handleDelete(thought.id)} title="Delete thought">
              &times;
            </button>
            <p className="thought-text">{thought.text}</p>
            <p className="author">- {thought.author}</p>
            <p className="timestamp">
              {new Date(thought.timestamp).toLocaleString([], {
                year: 'numeric', month: 'short', day: 'numeric', 
                hour: '2-digit', minute:'2-digit'
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Thoughts;
