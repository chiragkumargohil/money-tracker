import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(() => console.log("database connected!")).catch((err) => console.log("ERR_DB:", err));

const recordsSchema = new mongoose.Schema({
    id: String,
    name: String,
    email: String,
    money: String,
    owe: String
});

const userSchema = new mongoose.Schema({
    googleId: String,
    name: String,
    email_id: String
});

const Record = mongoose.model('Record', recordsSchema);
export const User = mongoose.model('User', userSchema);

export default Record;