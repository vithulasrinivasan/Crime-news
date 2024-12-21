import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../App.css';

const EntryDetails = () => {
  const [entry, setEntry] = useState(null);
  const [entries, setEntries] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntryDetails = async () => {
      try {
        const allEntriesResponse = await fetch('http://localhost:5000/entries');
        const allEntries = await allEntriesResponse.json();
        setEntries(allEntries);

        const entryResponse = await fetch(`http://localhost:5000/entries/${id}`);
        const entryData = await entryResponse.json();
        setEntry(entryData);
      } catch (error) {
        console.error('Error fetching entry details:', error);
      }
    };

    fetchEntryDetails();
  }, [id]);

  const handlePreviousEntry = () => {
    const currentIndex = entries.findIndex(e => e.id === parseInt(id));
    if (currentIndex > 0) {
      const prevEntryId = entries[currentIndex - 1].id;
      navigate(`/entry/${prevEntryId}`);
    }
  };

  const handleNextEntry = () => {
    const currentIndex = entries.findIndex(e => e.id === parseInt(id));
    if (currentIndex < entries.length - 1) {
      const nextEntryId = entries[currentIndex + 1].id;
      navigate(`/entry/${nextEntryId}`);
    }
  };

  if (!entry) return <div className="loading">Loading Crime Details...</div>;

  return (
    <div className="entry-details-container">
      <div className="navigation-buttons">
        <button
          onClick={handlePreviousEntry}
          disabled={entries.findIndex(e => e.id === parseInt(id)) === 0}
          className="nav-button"
        >
          ← Previous
        </button>
        <button
          onClick={handleNextEntry}
          disabled={entries.findIndex(e => e.id === parseInt(id)) === entries.length - 1}
          className="nav-button"
        >
          Next →
        </button>
      </div>

      <div className="entry-details-card">
        <h1 className="entry-title">{entry.title}</h1>
        <div className="entry-meta-info">
          <p><strong>Date:</strong> {entry.date}</p>
          <p><strong>Time:</strong> {entry.time}</p>
          <p><strong>Category:</strong> {entry.category}</p>
          <p><strong>Location:</strong> {entry.location}</p>
        </div>

        <div className="entry-description">
          <h2>Description</h2>
          <p>{entry.description}</p>
        </div>

        <div className="entry-additional-info">
          <p><strong>Tags:</strong> {entry.tags || 'No tags'}</p>
          <p><strong>Persons Involved:</strong> {entry.personsInvolved}</p>
        </div>

        {entry.media_files && entry.media_files.length > 0 && (
          <div className="entry-media">
            <h2>Media Files</h2>
            <div className="media-gallery">
              {entry.media_files.map((file, index) => (
                <div key={index} className="media-item">
                  {file.endsWith('.mp4') || file.endsWith('.mov') ? (
                    <video controls className="media-video">
                      <source src={`http://localhost:5000/media/${file.split('/').pop()}`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={`http://localhost:5000/media/${file.split('/').pop()}`}
                      alt={`Media ${index + 1}`}
                      className="media-image"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EntryDetails;
