import mongoose from "mongoose";

export const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!);     // ! -> non null assertion operator
        const connection = mongoose.connection
        connection.once("connected", () => {
            console.log("MongoDB connected successfully")
        })
        connection.on("error", (error) => {
            console.log("MongoDB connection ERROR : ", error)
            process.exit(1)
        })
    } catch (error) {
        console.log("Something went wrong while connecting to the database : ", error)
    }
}