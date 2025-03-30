import { CreateCaptainDataType } from "../lib/types"
import { Captain } from "../models/captain.model"

export const createCaptain = async({fullName, email, password, vehicle, location} : CreateCaptainDataType) =>{
    if(!fullName || !email || !password || !vehicle.color || !vehicle.plate || !vehicle.capacity || !vehicle.vehicleType){
        throw new Error("All fields are required")
    }

    const newCaptain = await Captain.create({fullName, email, password, vehicle, location})
    return newCaptain;

    
    
}