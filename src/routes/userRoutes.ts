import express from "express";
import jwt = require('jsonwebtoken');
import { userRepository } from "../repositories/UserRepository";
import multer =  require("multer");
import path = require("path");

const router = express.Router();
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/avatars/');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `avatar-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
    }
  },
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB file size limit
  }
});

router.post('/register', async (req, res:any) => {
  try {
    const {  username, password, email, dob, role } = req.body;

    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = await userRepository.create({ 
      username, 
      email,
      dob,
      role,
      password 
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

router.post('/login', async (req, res:any) => {
  try {
    const { email, password } = req.body;

    const user = await userRepository.login(email, password);
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const accessToken = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ accessToken, user: { username: user.username, email: user.email, id: user.id, avatar: user.avatar } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

router.post('/:id/avatar', upload.single('avatar'), async (req, res:any) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (!req.file) {
      return res.status(400).json({ error: 'No avatar uploaded' });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    const updatedUser = await userRepository.updateAvatar(userId, avatarUrl);

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ 
      message: 'Avatar updated successfully', 
      avatarUrl 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating avatar' });
  }
});

router.get('/:id', async (req, res:any) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await userRepository.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving user' });
  }
});

router.get('/', async (req, res:any) => {
  try {
    const users = await userRepository.findAll();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving users' });
  }
});

export default router;