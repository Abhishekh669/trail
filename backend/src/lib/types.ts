import { Request } from "express";

export interface CreateUserType{
    firstName : string,
    lastName ?: string,
    email : string,
    password : string
}


export interface loginUserType{
    email : string,
    password : string;
}




export interface UserType{
    _id : string,
    fullName : {
        firstName : string,
        lastName ?: string,
    },
    email : string,
    password : string,
    socketId ?: string,
    createdAt ?: Date,
}


export interface CustomRequest extends Request {
    user?: UserType;
}


export interface CreateCaptainDataType{
   fullName : {
    firstName : string,
    lastName ?: string,
   },
   email : string,
   password : string,
   vehicle : {  
    color : string,
    plate : string,
    capacity : number,
    vehicleType : string,
   },
   location ?: {
    ltd ?: number,
    lng ?: number,
   },
   createdAt ?: Date,
}

interface LocationType{
    location :  string,
    lat : number,
    lon : number,
}



export interface RideType{
    user: string;
    captain?: string;
    pickup: LocationType;
    destination: LocationType;
    fare: number;
    status : 'pending' | 'accepted' | 'ongoing' | 'completed' | 'cancelled';
    duration: number; // in seconds
    distance: number; // in meters
    paymentID?: string;
    orderId?: string;
    signature?: string;
    otp : string;
    createdAt?: Date;
    updatedAt?: Date;
  }