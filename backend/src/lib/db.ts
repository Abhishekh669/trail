import mongoose  from "mongoose"
import { User } from "../models/user.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Captain } from "../models/captain.model";

export const connectDB = async() =>{
    mongoose.set("strictQuery", true)
    if(!process.env.MONGO_URL) return console.log("MONGO_URL not found");
try {
    const response = await mongoose.connect(`${process.env.MONGO_URL}`);
    console.log("successfully connected  to mongodb ")
    
    
} catch (error: any) {
    console.log("Failed to connect MongoDB :: ",error.message)
    
}
}


export const decodeToken = async(token : string) =>{
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
    const user = await User.findById(decoded._id);
    return user;
}


export const decodeCaptainToken = async(token : string) =>{
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
    const captain = await Captain.findById(decoded._id);
    return captain;
}