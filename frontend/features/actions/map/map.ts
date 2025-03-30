'use server'

import { TransportMode } from "@/components/user/user-sidebar"
import { get_cookies } from "@/lib/cookie/cookie"
import { BACKEND_URL } from "@/lib/data"
import axios from "axios"

interface LocationType{
    location :  string,
    lat : number,
    lon : number,
}


interface CreateRideType{
    userId : string,
    pickup : LocationType,
    destination : LocationType,
    distance : number,
    vehicleType : TransportMode
}


export const createRide = async(data : CreateRideType)=>{
     const token = await get_cookies("token");
        if(!token){
            throw new Error("User not authenticated")
        }
    try {
        console.log('this is the values to create rides : ',data)
        const response = await axios.post(`${BACKEND_URL}/rides/create`,data,
            {
                headers : {
                    Authorization : `Bearer ${token.value}`
                }
            }
        )
        
        const rideData = await response.data;
        if(!rideData){
            throw new Error("Failed to create ride")
        }
        return{
            message : "ride created successfully",
            rideData : JSON.stringify(rideData?.ride),
        }
    } catch (error) {
        console.log("this is the error : ",error)
        if(axios.isAxiosError(error)){
            return {
                error : error.response?.data?.message,
            }
           }    
           return {
            error : "Something went wrong",
           }
        
    }
}