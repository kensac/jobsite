import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Levels from '../database/models/levelsModel.js';

dotenv.config();

const router = express.Router();

router.get('/', async (req, res) => {
    res.send('Hello from internship route');
}
);

export default router;