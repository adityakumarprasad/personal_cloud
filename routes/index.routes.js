const express = require('express')
const router = express.Router()
const upload = require('../config/multer.config')
const supabase = require('../config/supabase.config')

const fileModel = require('../models/files.models')
const authenticateToken = require('../middlewares/auth')

// Add root route
router.get('/', (req, res) => {
  // Check if user has token
  const token = req.cookies.token;
  if (token) {
    res.redirect('/home');
  } else {
    res.redirect('/user/login');
  }
})

router.get('/home', authenticateToken, async (req, res) => {
  try {
    // Fetch files uploaded by this user
    const userFiles = await fileModel.find({ user: req.user.userId });
        
    res.render('home', { files: userFiles }); // Pass files to the EJS template
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
})

router.post('/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    // Get the uploaded file
    const file = req.file
    
    // Check if file exists
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Create a unique name for the file
    const fileName = Date.now() + '-' + file.originalname
    
    // Upload file to Supabase
    const { data, error } = await supabase.storage
      .from('files')
      .upload(fileName, file.buffer)
    
    // If upload failed
    if (error) {
      console.error('Supabase upload error:', error);
      return res.status(500).json({ error: 'Upload failed: ' + error.message })
    }
    
    // Save file info to database
    const newfile = await fileModel.create({
      path: data.path,
      originalname: file.originalname,
      user: req.user.userId
    })
    
    // If upload successful
    res.json(newfile)
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
})

router.get('/download/:id', authenticateToken, async (req, res) => {
  try {
    const file = await fileModel.findById(req.params.id);
    
    // Check if file exists
    if (!file) {
      return res.status(404).send('File not found');
    }
    
    // Check if the file belongs to the logged-in user
    if (file.user.toString() !== req.user.userId) {
      return res.status(403).send('Access denied');
    }
    
    // Download file from Supabase storage
    const { data, error } = await supabase
      .storage
      .from('files')
      .download(file.path);
    
    if (error) {
      console.error('Supabase download error:', error);
      return res.status(500).send('Error downloading file');
    }
    
    // Set headers and send file
    res.setHeader('Content-Disposition', `attachment; filename="${file.originalname}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    
    // Convert the data to buffer and send
    const buffer = Buffer.from(await data.arrayBuffer());
    res.send(buffer);
    
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router