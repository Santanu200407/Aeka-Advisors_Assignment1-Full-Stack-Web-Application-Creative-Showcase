import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './LandingPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function LandingPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get(`${API_URL}/images/all`);
      setImages(response.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Showcase Your Creative Journey</h1>
          <p className="hero-subtitle">
            Share your digital memories and artwork with the world
          </p>
          <div className="hero-buttons">
            <Link to="/signup" className="hero-btn primary">Get Started</Link>
            <Link to="/login" className="hero-btn secondary">Sign In</Link>
          </div>
        </div>
      </section>

      <section className="gallery-section">
        <h2 className="gallery-title">Featured Artworks</h2>
        
        {loading ? (
          <div className="loading">Loading amazing artworks...</div>
        ) : images.length === 0 ? (
          <div className="empty-state">
            <p>No artworks yet. Be the first to share your creativity!</p>
          </div>
        ) : (
          <div className="masonry-grid">
            {images.map((image) => (
              <div key={image._id} className="masonry-item">
                <Link to={`/profile/${image.username}`}>
                  <img src={image.imageUrl} alt={image.title} />
                  <div className="image-overlay">
                    <h3>{image.title}</h3>
                    <p className="artist-name">by @{image.username}</p>
                    {image.description && (
                      <p className="image-description">{image.description}</p>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default LandingPage;