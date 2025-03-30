'use server'

import { get_cookies } from "@/lib/cookie/cookie";
import { BACKEND_URL } from "@/lib/data";
import axios from "axios";

export const changeStatusOfCaptain = async( status : "offline" | "available" | "on_ride") =>{
     const token = await get_cookies("token");
        if(!token){
            throw new Error("User not authenticated")
        }
        console.log(status)
        try {

            const response = await axios.post(`${BACKEND_URL}/captain/updateStatus`,{status},{
                headers : {
                    Authorization : `Bearer ${token.value}`
                }
            })
            
    
          console.log("this is repsonse",response)
    
            const data = await response?.data;
            console.log("this is the data",data)
            
            if(!data){
                throw new Error("failed to update data")
            }
    
            return {
                message : "successfully updated found",
                success : data.success,
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