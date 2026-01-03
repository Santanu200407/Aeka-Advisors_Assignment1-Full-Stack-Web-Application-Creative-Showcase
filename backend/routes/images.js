const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const Image = require('../models/Image');
const auth = require('../middleware/auth');

const router = express.Router();


const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});


router.post('/upload', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'creative-showcase' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    const image = new Image({
      title,
      description: description || '',
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id,
      userId: req.user.userId,
      username: req.user.username
    });

    await image.save();

    res.status(201).json({
      message: 'Image uploaded successfully',
      image
    });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

router.get('/all', async (req, res) => {
  try {
    const images = await Image.find()
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/my-images', auth, async (req, res) => {
  try {
    const images = await Image.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/user/:username', async (req, res) => {
  try {
    const images = await Image.find({ username: req.params.username })
      .sort({ createdAt: -1 });
    
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const image = await Image.findOne({ 
      _id: req.params.id, 
      userId: req.user.userId 
    });

    if (!image) {
      return res.status(404).json({ message: 'Image not found or unauthorized' });
    }

    await cloudinary.uploader.destroy(image.cloudinaryId);

    await Image.deleteOne({ _id: req.params.id });

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;