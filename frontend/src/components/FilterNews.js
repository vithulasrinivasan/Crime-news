import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import '../App.css';
import { Link } from 'react-router-dom';
const FilterNews = () => {
  const [filters, setFilters] = useState({
    category: '',
    tags: '',
    date: '',
    location: '',
  });
  const [filteredEntries, setFilteredEntries] = useState([]); // Explicitly initialize as array
  const [allEntries, setAllEntries] = useState([]); // To hold all entries

  // Fetch all entries on component mount
  useEffect(() => {
    fetch('http://localhost:5000/entries') // Adjust this URL as necessary
      .then((response) => response.json())
      .then((data) => {
        setAllEntries(data); // Store all entries
        setFilteredEntries(data); // Initially show all entries
      })
      .catch((error) => console.error('Error fetching entries:', error));
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleFilterSubmit = () => {
    let filteredData = allEntries;

    // Apply filters
    if (filters.category) {
      filteredData = filteredData.filter(entry => entry.category === filters.category);
    }
    
    if (filters.tags) {
      filteredData = filteredData.filter(entry => 
        entry.tags.toLowerCase().includes(filters.tags.toLowerCase())
      );
    }

    if (filters.date) {
      filteredData = filteredData.filter(entry => entry.date === filters.date);
    }

    if (filters.location) {
      filteredData = filteredData.filter(entry => 
        entry.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setFilteredEntries(filteredData); // Update state with filtered entries
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Filtered Crime Entries', 14, 10);
    doc.autoTable({
      head: [['Title', 'Description', 'Date', 'Category', 'Tags', 'Location']],
      body: filteredEntries.map(entry => [
        entry.title,
        entry.description,
        entry.date,
        entry.category,
        entry.tags,
        entry.location,
      ]),
      startY: 20,
    });
    doc.save('Filtered_CrimeEntries.pdf');
  };

  return (
    <div className="filter-container">
      <h2>Filter News</h2>
      <div className="filter-form">
        <div className="form-field">
          <label>Category:</label>
          <select name="category" value={filters.category} onChange={handleFilterChange} className="styled-select">
            <option value="">All Categories</option>
            <option value="violent-crimes">Violent Crimes</option>
            <option value="property-crimes">Property Crimes</option>
            <option value="cyber-crimes">Cyber Crimes</option>
            <option value="drug-related-crimes">Drug-Related Crimes</option>
            <option value="white-collar-crimes">White-Collar Crimes</option>
          </select>
        </div>

        <div className="form-field">
          <label>Tags:</label>
          <input
            type="text"
            name="tags"
            placeholder="Enter tags"
            value={filters.tags}
            onChange={handleFilterChange}
            className="styled-input"
          />
        </div>

        <div className="form-field">
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            className="styled-input"
          />
        </div>

        <div className="form-field">
          <label>Location:</label>
          <input
            type="text"
            name="location"
            placeholder="Enter location"
            value={filters.location}
            onChange={handleFilterChange}
            className="styled-input"
          />
        </div>

        <button onClick={handleFilterSubmit} className="filter-button">Apply Filters</button>
      </div>

      <h2>Filtered Crime Entries</h2>
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
          {filteredEntries.map((entry, index) => (
            <tr key={index}>
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

      {filteredEntries.length > 0 && (
        <button onClick={exportToPDF} className="export-button">Export to PDF</button>
      )}
    </div>
  );
};

export default FilterNews;