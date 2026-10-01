import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Mongo Db Connected..")
    } catch (error) {
        console.error("Mongo db connection failed", error.message)
        throw error
    }
}