
import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = '/api/listings';
const RECOMMENDATION_URL = '/api/recommendations';

function App() {
  const [listings, setListings] = useState([]);
  const [filter, setFilter] = useState('all');

  const [recommendations, setRecommendations] = useState({});
  const [loading, setLoading] = useState({});

  const [form, setForm] = useState({
    name: '',
    email: '',
    type: 'find-teammate',
    projectTitle: '',
    description: '',
    skills: ''
  });

  // Fetch listings from backend
  const fetchListings = async () => {
    try {
      const query = filter === 'all' ? '' : `?type=${filter}`;
      const res = await axios.get(`${API_URL}${query}`);
      setListings(res.data);
    } catch (err) {
      console.error('Failed to fetch listings:', err);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [filter]);

  // Handle form input
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Submit a new listing
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(API_URL, form);

      alert('Listing posted successfully!');

      setForm({
        name: '',
        email: '',
        type: 'find-teammate',
        projectTitle: '',
        description: '',
        skills: ''
      });

      fetchListings();

    } catch (err) {
      console.error('Post failed:', err);
      alert('Could not post listing.');
    }
  };

  // Delete a listing
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchListings();

      // Remove deleted listing's recommendations from the UI
      setRecommendations(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });

    } catch (err) {
      console.error('Delete failed:', err);
      alert('Could not delete listing.');
    }
  };

  // Get AI recommendations for a project
  const loadRecommendations = async (projectId) => {
    setLoading(prev => ({
      ...prev,
      [projectId]: true
    }));

    try {
      const res = await axios.get(
        `${RECOMMENDATION_URL}/${projectId}`
      );

      setRecommendations(prev => ({
        ...prev,
        [projectId]: res.data.recommendations || []
      }));

    } catch (err) {
      console.error('Recommendation error:', err);

      setRecommendations(prev => ({
        ...prev,
        [projectId]: null
      }));

    } finally {
      setLoading(prev => ({
        ...prev,
        [projectId]: false
      }));
    }
  };

  return (
    <div className="app">

      <header className="header">
        <h1>🚀 TeamUp</h1>
        <p>Find a teammate. Find a team. Build something.</p>
      </header>

      <div className="container">

        {/* Post Listing Form */}
        <form className="form-card" onSubmit={handleSubmit}>
          <h2>Post a Listing</h2>

          <input
            name="name"
            placeholder="Your name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Your email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
          >
            <option value="find-teammate">
              Looking for teammates
            </option>

            <option value="find-team">
              Looking for a team
            </option>
          </select>

          <input
            name="projectTitle"
            placeholder="Project / Hackathon title"
            value={form.projectTitle}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder={
              form.type === 'find-teammate'
                ? 'Describe your project and what skills/roles you need'
                : 'Describe your skills and what kind of team/project you are looking for'
            }
            value={form.description}
            onChange={handleChange}
            required
          />

          <input
            name="skills"
            placeholder={
              form.type === 'find-teammate'
                ? 'Skills you need (e.g. React, Python, ML)'
                : 'Your skills (e.g. React, Python, UI Design)'
            }
            value={form.skills}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Post Listing
          </button>
        </form>


        {/* Listings Section */}
        <div className="listings-section">

          <div className="filter-bar">

            <button
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              All
            </button>

            <button
              className={filter === 'find-teammate' ? 'active' : ''}
              onClick={() => setFilter('find-teammate')}
            >
              Looking for Teammates
            </button>

            <button
              className={filter === 'find-team' ? 'active' : ''}
              onClick={() => setFilter('find-team')}
            >
              Looking for a Team
            </button>

          </div>


          <div className="listings-grid">

            {listings.length === 0 && (
              <p className="empty">
                No listings yet. Be the first to post!
              </p>
            )}

            {listings.map((item) => (

              <div className="card" key={item._id}>

                <span className={`badge ${item.type}`}>
                  {item.type === 'find-teammate'
                    ? 'Needs Teammates'
                    : 'Needs a Team'}
                </span>

                <h3>{item.projectTitle}</h3>

                <p className="desc">
                  {item.description}
                </p>

                <p className="skills">
                  Skills: {item.skills}
                </p>

                <div className="footer-row">
                  <span>
                    {item.name} — {item.email}
                  </span>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(item._id)}
                  >
                    ✕
                  </button>
                </div>


                {/* AI Recommendation Section */}
                {item.type === 'find-teammate' && (

                  <div className="recommendation-section">

                    <button
                      className="recommend-btn"
                      onClick={() => loadRecommendations(item._id)}
                      disabled={loading[item._id]}
                    >
                      {loading[item._id]
                        ? 'Finding teammates...'
                        : '✨ Find Recommended Teammates'}
                    </button>


                    {loading[item._id] && (
                      <p>Analysing student profiles...</p>
                    )}


                    {recommendations[item._id] === null && (
                      <p className="recommend-error">
                        Could not load recommendations. Please try again.
                      </p>
                    )}


                    {recommendations[item._id] &&
                      recommendations[item._id].length > 0 && (

                      <div className="recommendation-results">

                        <h4>🤖 AI Recommended Teammates</h4>

                        {recommendations[item._id].map((student) => (

                          <div
                            className="student-card"
                            key={student.listingId}
                          >

                            <div className="student-header">
                              <h4>{student.name}</h4>

                              <span className="match-score">
                                {student.matchScore}% Match
                              </span>
                            </div>

                            <p>
                              <strong>Skills:</strong> {student.skills}
                            </p>

                            <p>
                              <strong>Matched Skills:</strong>{' '}
                              {student.matchedSkills?.length > 0
                                ? student.matchedSkills.join(', ')
                                : 'No exact skill matches'}
                            </p>

                            <p>
                              <strong>Email:</strong> {student.email}
                            </p>

                          </div>

                        ))}

                      </div>
                    )}


                    {recommendations[item._id]?.length === 0 && (
                      <p className="empty">
                        No matching teammates found.
                      </p>
                    )}

                  </div>

                )}

              </div>

            ))}

          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
