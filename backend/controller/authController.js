import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail, findUserById } from '../models/User.js';

// Helper function to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '10d', 
  });
};

//  resister  a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await findUserByEmail(email);

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

     
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in PostgreSQL
    const user = await createUser(name, email, hashedPassword);

    if (user) {
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: error.message });
  }
};

 
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
       
    if(!email || !password){
      res.status(400);
      throw new Error('Please provide email and password');
    }
   
    const user = await findUserByEmail(email);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (user && isPasswordValid) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: error.message });
  }
};

 
const getProfile = async (req, res) => {
  try {
    // req.userId is set by the authMiddleware
    const user = await findUserById(req.userId);

    if (user) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  getProfile,
};
