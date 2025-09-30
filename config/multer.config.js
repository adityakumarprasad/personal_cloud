const multer = require('multer')

// Simple memory storage for Supabase
const storage = multer.memoryStorage()

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Add any file type restrictions here if needed
    cb(null, true)
  }
})

module.exports = upload;