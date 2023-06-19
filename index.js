import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Levels from './database/models/levelsModel.js';
import internshipRoutes from './routes/internshipRoutes.js';
import internalRoutes from './routes/internalRoutes.js';

dotenv.config();

const app = express();
const port = 3000;

mongoose.connect(process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}
).then(() => {
    console.log('Connected to MongoDB');
}
).catch((error) => {
    console.log(error);
}
);

app.set('view engine', 'ejs');
app.use(express.static('public'))

app.use('/internships',internshipRoutes)
app.use("/internal", internalRoutes)


app.get('/', (req, res) => {
    res.send('Server is ready');
}
);


app.listen(port, () => {
    console.log(`Server is running on port localhost:${port}`);
}
);