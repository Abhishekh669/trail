'use server'

import {   captainRegisterFormSchema, userRegisterFormSchema } from "@/features/types/auth/schema";
import { BACKEND_URL,  } from "@/lib/data";
import axios from "axios";
import { z } from "zod";

export async function userRegister(values: z.infer<typeof userRegisterFormSchema>) {

    try {
        const isError = userRegisterFormSchema.safeParse(values);
        if(isError.error){
            throw new Error(isError.error.message)
        }
        const res = await axios.post(`${BACKEND_URL}/user/register`, values);
        
        return {
            message : "User registered successfully",
            success : true,
        }
    } catch (error) {
        console.log("this is the error from the user register : ",error)
       if(axios.isAxiosError(error)){
         return {
            error : error.response?.data,
         }
       }
       return {
        error : "Something went wrong",
       }
    }
   
}


export async function captainRegister(values: z.infer<typeof captainRegisterFormSchema>) {

    try {
        const isError = captainRegisterFormSchema.safeParse(values);
        if(isError.error){
            throw new Error(isError.error.message)      
        }
        await axios.post(`${BACKEND_URL}/captain/register`, values);
        
        return {
            message : "Captain registered successfully",
            success : true,
        }
    } catch (error) {
        if(axios.isAxiosError(error)){
            return {
                error : error.response?.data,
            }
        }
        return {
            error : "Something went wrong",
        }
    }
}



