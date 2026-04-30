import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        if (conn) {
            console.log(`Succesfully connected to database, with hose: ${conn.connection.host}`)
        }
    } catch (error) {
        console.log(error)
        throw new Error("Error while connecting to Database");
    }
}

export default connectDB
