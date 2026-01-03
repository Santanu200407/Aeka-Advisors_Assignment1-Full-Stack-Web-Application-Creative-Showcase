import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './PublicProfile.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function PublicProfile() {
  const { username } = useParams();
  const [images, setImages] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserData();
  }, [username]);

  const fetchUserData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const [userResponse, imagesResponse] = await Promise.all([
        axios.get(`${API_URL}/users/${username}`),
        axios.get(`${API_URL}/images/user/${username}`)
      ]);

      setUser(userResponse.data);
      setImages(imagesResponse.data);
    } catch (error) {
      setError(error.response?.data?.message || 'User not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-page">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="error-page">
        <h2>User Not Found</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="public-profile">
      <div className="profile-header-section">
        <div className="profile-header-content">
          <div className="profile-avatar">
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h1>@{username}</h1>
            <p className="profile-stats">
              {images.length} {images.length === 1 ? 'Artwork' : 'Artworks'}
            </p>
            <p className="member-since">
              Member since {new Date(user.createdAt).toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="profile-gallery">
        {images.length === 0 ? (
          <div className="empty-state">
            <p>This user hasn't uploaded any artworks yet.</p>
          </div>
        ) : (
          <div className="masonry-grid">
            {images.map((image) => (
              <div key={image._id} className="masonry-item">
                <img src={image.imageUrl} alt={image.title} />
                <div className="image-overlay">
                  <h3>{image.title}</h3>
                  {image.description && (
                    <p className="image-description">{image.description}</p>
                  )}
                  <span className="image-date">
                    {new Date(image.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PublicProfile;