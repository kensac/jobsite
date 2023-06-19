import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Levels from './database/models/levelsModel.js';
import internshipRoutes from './routes/internshipRoutes.js';

dotenv.config();

const app = express();
const port = 3000;

app.use('/internships',internshipRoutes)


app.get('/', (req, res) => {
    res.send('Server is ready');
}
);


app.listen(port, () => {
    console.log(`Server is running on port localhost:${port}`);
}
);
