import mongoose from 'mongoose';
const { Schema } = mongoose;

const levelsSchema = new Schema({
    name: String,
    location: String,
    terms: String,
    salaryHourly: Number,
    salaryMonthly: Number,
    additional: String,
    link: String
});

const Levels = mongoose.model('Levels', levelsSchema);

export default Levels;