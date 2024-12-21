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
    setFormData({ ...formData, [name]: value });
  };

  const handleMediaChange = (e) => {
    setFormData({ ...formData, mediaFiles: e.target.files });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSubmit = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'mediaFiles') {
        Array.from(value).forEach((file) => {
          dataToSubmit.append('mediaFiles', file);
        });
      } else {
        dataToSubmit.append(key, value);
      }
    });

    fetch('http://localhost:5000/entries', {
      method: 'POST',
      body: dataToSubmit,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to add entry');
        }
        return response.json();
      })
      .then(() => fetch('http://localhost:5000/entries'))
      .then((res) => res.json())
      .then((data) => setCrimeEntries(data))
      .catch((error) => console.error('Error:', error));
  };


  useEffect(() => {
    fetch('http://localhost:5000/entries')
      .then((response) => response.json())
      .then((data) => setCrimeEntries(data))
      .catch((error) => console.error('Error fetching entries:', error));
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
          {Array.isArray(crimeEntries) && crimeEntries.map((entry) => (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubmitNews;
