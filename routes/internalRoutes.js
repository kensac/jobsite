import express from 'express';
import mongoose from 'mongoose';
import Levels from '../database/models/levelsModel.js';

const router = express.Router();

router.get('/internships', async (req, res) => {
    const internships = await Levels.find({});
    res.send(internships);
}
);

router.get('/internships/:id', async (req, res) => {
    const internship = await Levels.findById(req.params.id);
    res.send(internship);
}
);


export default router;