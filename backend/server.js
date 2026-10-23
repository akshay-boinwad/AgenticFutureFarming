const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
// Hey this is pavan pawar
const PORT = 5000;
const ML_SERVICE_URL = 'http://127.0.0.1:8000';

// Middleware
app.use(cors());
app.use(express.json());

// Receive uploaded images in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (allowedTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(
        new Error('Only JPG, PNG, and WEBP images are allowed.')
      );
    }
  },
});

// Backend health check
app.get('/', (req, res) => {
  res.json({
    message: 'Future Farming Backend is running!',
    status: 'OK',
  });
});

// Check whether the Python ML service is reachable
app.get('/api/health', async (req, res) => {
  try {
    const response = await axios.get(
      `${ML_SERVICE_URL}/health`,
      { timeout: 5000 }
    );

    res.json({
      backend: 'healthy',
      mlService: response.data,
    });
  } catch (error) {
    console.error('ML health check failed:', error.message);

    res.status(503).json({
      backend: 'healthy',
      mlService: 'unavailable',
      message:
        'The Python ML service could not be reached. Check that it is running on port 8000.',
    });
  }
});

// Crop disease analysis
app.post(
  '/api/crop/analyze',
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please upload a crop image.',
        });
      }

      console.log(
        'Received crop image:',
        req.file.originalname
      );

      // Forward the image to the Python ML service
      const form = new FormData();

      form.append('image', req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });

      const mlResponse = await axios.post(
        `${ML_SERVICE_URL}/api/crop/analyze`,
        form,
        {
          headers: form.getHeaders(),
          timeout: 60000,
          maxBodyLength: 6 * 1024 * 1024,
        }
      );

      return res.status(200).json({
        success: true,
        message: 'Crop image processed by the ML service.',
        result: mlResponse.data,
      });
    } catch (error) {
      console.error(
        'Crop analysis failed:',
        error.response?.data || error.message
      );

      if (error.response) {
        return res.status(error.response.status).json({
          success: false,
          message: 'The ML service could not process the image.',
          details: error.response.data,
        });
      }

      if (
        error.code === 'ECONNREFUSED' ||
        error.code === 'ECONNABORTED'
      ) {
        return res.status(503).json({
          success: false,
          message:
            'The ML service is unavailable or took too long to respond.',
        });
      }

      return res.status(500).json({
        success: false,
        message: 'An error occurred during crop analysis.',
      });
    }
  }
);

// Handle invalid uploads and other request errors
app.use((err, req, res, next) => {
  console.error('Request error:', err.message);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message:
        err.code === 'LIMIT_FILE_SIZE'
          ? 'Image must be smaller than 5 MB.'
          : err.message,
    });
  }

  return res.status(400).json({
    success: false,
    message: err.message || 'Invalid request.',
  });
});

// Start the backend
app.listen(PORT, '0.0.0.0', () => {
  console.log(
    `Future Farming Backend running on port ${PORT}`
  );

  console.log(
    `ML service configured at ${ML_SERVICE_URL}`
  );
});