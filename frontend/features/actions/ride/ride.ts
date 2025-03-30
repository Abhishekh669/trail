'use server'

import { get_cookies } from "@/lib/cookie/cookie"
import { BACKEND_URL } from "@/lib/data"
import axios from "axios"

export const deleteRide = async(id : string) =>{

    if(!id){
        return {
            error : "invalid id"
        }
    }

    const token = await get_cookies("token");
            if(!token){
                throw new Error("User not authenticated")
            }


    console.log("this ishte delete ride id : ",id, token)
    try {
        const response = await axios.delete(`${BACKEND_URL}/rides/delete/${id}`,
            {
                headers : {
                    Authorization : `Bearer ${token.value}`
                }
            }
        )
        const deleteResponse = await response.data;
        console.log("this is delete reposne ",deleteResponse)
        if(!deleteResponse){
            throw new Error("failed to delete ride")
        }
        return {
            message : deleteResponse.message,
            success : deleteResponse.success
        }
        
    } catch (error) {
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