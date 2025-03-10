import mongoose from "mongoose";
import ENVIRONMENT from "./env.config.js";


const connectToMongoDB = async () => {
    
    try {
        const response = await mongoose.connect(ENVIRONMENT.MONGO_DB_URL)
        console.log('Successfully connected to MongoDB');
    } catch(err) {
        console.log('Error while connecting with MongoDB');
        console.log(err);
    }
}

connectToMongoDB()

export default mongoose