import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/api/listings';

function App() {
  const [listings, setListings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({
    name: '', email: '', type: 'find-teammate',
    projectTitle: '', description: '', skills: ''
  });

  const fetchListings = async () => {
    const query = filter === 'all' ? '' : `?type=${filter}`;
    const res = await axios.get(`${API_URL}${query}`);
    setListings(res.data);
  };

  useEffect(() => { fetchListings(); }, [filter]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('Submit clicked', form);
  try {
    await axios.post(API_URL, form);
    console.log('Post successful');
  } catch (err) {
    console.error('Post failed:', err);
  }
  setForm({ name: '', email: '', type: 'find-teammate', projectTitle: '', description: '', skills: '' });
  fetchListings();
};

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchListings();
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🚀 TeamUp</h1>
        <p>Find a teammate. Find a team. Build something.</p>
      </header>

      <div className="container">
        <form className="form-card" onSubmit={handleSubmit}>
          <h2>Post a Listing</h2>

          <input name="name" placeholder="Your name" value={form.name} onChange={handleChange} required />
          <input name="email" type="email" placeholder="Your email" value={form.email} onChange={handleChange} required />

          <select name="type" value={form.type} onChange={handleChange}>
            <option value="find-teammate">Looking for teammates</option>
            <option value="find-team">Looking for a team</option>
          </select>

          <input name="projectTitle" placeholder="Project / Hackathon title" value={form.projectTitle} onChange={handleChange} required />
          <textarea
  name="description"
  placeholder={
    form.type === 'find-teammate'
      ? "Describe your project and what skills/roles you need (e.g. 'Need a backend dev and designer for a hackathon app')"
      : "Describe your skills and what kind of team/project you're looking for (e.g. 'React dev looking to join a hackathon team')"
  }
  value={form.description}
  onChange={handleChange}
  required
/>
          <input
  name="skills"
  placeholder={
    form.type === 'find-teammate'
      ? "Skills you need in teammates (e.g. React, Figma, ML)"
      : "Your own skills (e.g. React, Python, UI Design)"
  }
  value={form.skills}
  onChange={handleChange}
  required
/>

          <button type="submit">Post Listing</button>
        </form>

        <div className="listings-section">
          <div className="filter-bar">
            <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
            <button className={filter === 'find-teammate' ? 'active' : ''} onClick={() => setFilter('find-teammate')}>Looking for Teammates</button>
            <button className={filter === 'find-team' ? 'active' : ''} onClick={() => setFilter('find-team')}>Looking for a Team</button>
          </div>

          <div className="listings-grid">
            {listings.length === 0 && <p className="empty">No listings yet. Be the first to post!</p>}
            {listings.map((item) => (
              <div className="card" key={item._id}>
                <span className={`badge ${item.type}`}>
                  {item.type === 'find-teammate' ? 'Needs Teammates' : 'Needs a Team'}
                </span>
                <h3>{item.projectTitle}</h3>
                <p className="desc">{item.description}</p>
                <p className="skills"> {item.skills}</p>
                <div className="footer-row">
                  <span>{item.name} — {item.email}</span>
                  <button className="delete-btn" onClick={() => handleDelete(item._id)}>✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
console.log('App component rendered');
export default App;