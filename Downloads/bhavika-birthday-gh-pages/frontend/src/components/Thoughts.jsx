import React, { useState, useEffect } from 'react';
import { ref, push, onChildAdded, onValue } from 'firebase/database';
import { db } from '../firebase';
import './Thoughts.css';

const Thoughts = () => {
  const [thoughts, setThoughts] = useState([]);
  const [newThought, setNewThought] = useState('');
  const [author, setAuthor] = useState('Person A'); // Replace with actual names

  // We use the image from public folder for the background
  const cardStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/Thought.png)`
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
      <div className="thought-card input-card" style={cardStyle}>
        <select 
          className="author-select" 
          value={author} 
          onChange={(e) => setAuthor(e.target.value)}
        >
          <option value="Person A">Person A</option>
          <option value="Person B">Person B</option>
        </select>
        
        <textarea 
          className="thought-input" 
          placeholder="Share a thought..." 
          rows="4"
          value={newThought}
          onChange={(e) => setNewThought(e.target.value)}
        ></textarea>
        
        <button className="submit-thought" onClick={handlePostThought}>
          Post Thought
        </button>
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
