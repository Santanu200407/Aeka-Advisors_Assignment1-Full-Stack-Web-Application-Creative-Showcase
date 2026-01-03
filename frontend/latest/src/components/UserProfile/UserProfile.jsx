import { useState, useEffect } from 'react';
import axios from 'axios';
import './UserProfile.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function UserProfile() {
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null
  });
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const username = localStorage.getItem('username');

  useEffect(() => {
    fetchMyImages();
  }, []);

  const fetchMyImages = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/images/my-images`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setImages(response.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });
      
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.image) {
      setMessage({ type: 'error', text: 'Please select an image' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    const uploadData = new FormData();
    uploadData.append('title', formData.title);
    uploadData.append('description', formData.description);
    uploadData.append('image', formData.image);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/images/upload`, uploadData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage({ type: 'success', text: 'Image uploaded successfully!' });
      setFormData({ title: '', description: '', image: null });
      setPreview('');
      fetchMyImages();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Upload failed' 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/images/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ type: 'success', text: 'Image deleted successfully' });
      fetchMyImages();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Delete failed' 
      });
    }
  };

  return (
    <div className="user-profile">
      <div className="profile-container">
        <h1 className="profile-header">
          Welcome, @{username}
        </h1>

        <section className="upload-section">
          <h2>Upload New Artwork</h2>
          
          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="upload-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Give your artwork a title"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Optional description"
                />
              </div>
            </div>

            <div className="form-group file-input-group">
              <label htmlFor="image" className="file-label">
                Choose Image *
              </label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleChange}
                accept="image/*"
                required
              />
              {preview && (
                <div className="image-preview">
                  <img src={preview} alt="Preview" />
                </div>
              )}
            </div>

            <button type="submit" className="upload-btn" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Artwork'}
            </button>
          </form>
        </section>

        <section className="my-images-section">
          <h2>My Artworks ({images.length})</h2>
          
          {loading ? (
            <div className="loading">Loading your artworks...</div>
          ) : images.length === 0 ? (
            <div className="empty-state">
              <p>You haven't uploaded any artworks yet.</p>
            </div>
          ) : (
            <div className="images-grid">
              {images.map((image) => (
                <div key={image._id} className="image-card">
                  <img src={image.imageUrl} alt={image.title} />
                  <div className="image-info">
                    <h3>{image.title}</h3>
                    {image.description && <p>{image.description}</p>}
                    <span className="image-date">
                      {new Date(image.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleDelete(image._id)}
                    className="delete-btn"
                    title="Delete image"
                  >
                    🗑️ Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default UserProfile