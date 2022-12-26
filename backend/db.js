import mongoose from 'mongoose';
import dotenv from "dotenv-defaults";
import User from './models/user.js'
//Database
dotenv.config();
mongoose
    .connect(
        process.env.MONGO_URL,  {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then((res) => console.log("mongo db connection created"))

const db = mongoose.connection;
db.on("error", (err) => console.log(err));
db.once("open", async () => {
    // await deleteDB();
    await saveUser("Anna", "Subject", 12)
   });

export default {
    connect: () => { /* code to connect Mongoose DB */ }
};