import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const SubmitNews = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    category: '',
    tags: '',
    location: '',
    personsInvolved: '',
    mediaFiles: [],
  });

  const [crimeEntries, setCrimeEntries] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMediaChange = (e) => {
    setFormData(prev => ({ ...prev, mediaFiles: e.target.files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSubmit = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'mediaFiles') {
        Array.from(formData.mediaFiles).forEach(file => {
          dataToSubmit.append('mediaFiles', file);
        });
      } else {
        dataToSubmit.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch('http://localhost:5000/entries', {
        method: 'POST',
        body: dataToSubmit,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      fetchEntries();

      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        category: '',
        tags: '',
        location: '',
        personsInvolved: '',
        mediaFiles: [],
      });

      document.querySelector('input[type="file"]').value = '';

      alert('Entry submitted successfully!');
    } catch (error) {
      console.error('Submission Error:', error);
      alert('Failed to submit news entry. Please try again.');
    }
  };

  const fetchEntries = async () => {
    try {
      const response = await fetch('http://localhost:5000/entries');
      const data = await response.json();
      setCrimeEntries(data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div className="content-container">
      <div className="card">
        <h2>Submit News</h2>
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-field">
            <label>Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-field">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Enter description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-field">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-field">
            <label>Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-field">
            <label>Category</label>
            <select name="category" value={formData.category} onChange={handleInputChange} required>
              <option value="">Select Category</option>
              <option value="violent-crimes">Violent Crimes</option>
              <option value="property-crimes">Property Crimes</option>
              <option value="cyber-crimes">Cyber Crimes</option>
              <option value="drug-related-crimes">Drug-Related Crimes</option>
              <option value="white-collar-crimes">White-Collar Crimes</option>
            </select>
          </div>

          <div className="form-field">
            <label>Tags</label>
            <input
              type="text"
              name="tags"
              placeholder="Enter tags (e.g., theft, violence)"
              value={formData.tags}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-field">
            <label>Location</label>
            <input
              type="text"
              name="location"
              placeholder="Enter location"
              value={formData.location}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-field">
            <label>Persons Involved</label>
            <input
              type="number"
              name="personsInvolved"
              placeholder="Number of persons involved"
              value={formData.personsInvolved}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-field">
            <label>Upload Media Files</label>
            <input
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.mp4,.mov"
              onChange={handleMediaChange}
            />
          </div>

          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>

      <div className="card">
        <h2>Crime Entries</h2>
        <table className="crime-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Date</th>
              <th>Category</th>
              <th>Tags</th>
              <th>Location</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {crimeEntries.length > 0 ? (
              crimeEntries.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.title}</td>
                  <td>{entry.description}</td>
                  <td>{entry.date}</td>
                  <td>{entry.category}</td>
                  <td>{entry.tags}</td>
                  <td>{entry.location}</td>
                  <td>
                    <Link to={`/entry/${entry.id}`}>View Details</Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No entries found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubmitNews;