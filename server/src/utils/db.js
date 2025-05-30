import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export default function connectDB() {
  mongoose.connect(process.env.MONGO_URI, { dbName: "coffee_shop" })
    .then(() => console.log("Database Connected"))
    .catch((err) => console.log(`Database Error: ${err}`));
}