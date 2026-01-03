const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173', 
  process.env.FRONTEND_URL, 
].filter(Boolean)

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600, 
  optionsSuccessStatus: 200
};

const devCorsOptions = {
  origin: true, 
  credentials: true
};

module.exports = process.env.NODE_ENV === 'production' ? corsOptions : devCorsOptions