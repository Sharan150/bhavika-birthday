import React, { useState, useEffect } from 'react';
import { ref, push, onChildAdded, onValue } from 'firebase/database';
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
        // Convert object to array and sort by timestamp descending (newest first)
        const thoughtsArray = Object.values(data).sort((a, b) => b.timestamp - a.timestamp);
        setThoughts(thoughtsArray);
      }
    });

    return () => unsubscribe();
  }, []);

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
        {thoughts.map((thought, index) => (
          <div key={index} className="thought-card" style={cardStyle}>
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
