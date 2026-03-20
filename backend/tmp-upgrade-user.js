import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/invoice-generator").then(async () => {
    const db = mongoose.connection.db;
    const result = await db.collection("users").updateOne(
        { email: "unique_user_2026@gmail.com" },
        { $set: { plan: "PRO" } }
    );
    console.log("Updated:", result.modifiedCount);
    process.exit(0);
}).catch(console.error);
