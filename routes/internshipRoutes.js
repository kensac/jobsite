import express from 'express';
import mongoose from 'mongoose';
import Levels from '../database/models/levelsModel.js';


const router = express.Router();

router.get('/', async (req, res) => {
    res.render('internships',{internships: await fetch('http://localhost:3000/internal/internships').then(res => res.json())});
}
);

export default router;