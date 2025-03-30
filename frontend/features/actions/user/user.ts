'use server'

import { get_cookies } from "@/lib/cookie/cookie";
import { BACKEND_URL } from "@/lib/data";
import axios from "axios";


export const getUserFromToken = async(userType : string) =>{
    const token = await get_cookies("token");
    if(!token){
        throw new Error("User not authenticated")
    }
    
   
    try {
        let response;
        if(userType === "user"){
            response = await axios.get(`${BACKEND_URL}/user/profile`, {
                headers : {
                    Authorization : `Bearer ${token.value}`
                }
            })

        }else if(userType === "captain"){
            console.log('i will run')
            response = await axios.get(`${BACKEND_URL}/captain/profile`, {
                headers : {
                    Authorization : `Bearer ${token.value}`
                }
            })
        }

      console.log("this is repsonse",response)

        const data = await response?.data;
        console.log("this is the data",data)
        
        if(!data){
            throw new Error("User not found")
        }

        return {
            message : "User found",
            user : JSON.stringify(data.user),
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