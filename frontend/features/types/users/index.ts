export interface CaptainDataType{
    _id : string
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
    status : "offline" | "available" | "on_ride"
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
