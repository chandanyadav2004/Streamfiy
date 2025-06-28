import mongoose from "mongoose";

const  connectDB = async () => {
    try{
        const conn =await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB Connected: ${conn.connection.host}`)

    }
    catch(error){
        console.log("Error connecting to mongodb",error);
        process.exit(1); // failure code is 1 

    }
}

export default connectDB;
