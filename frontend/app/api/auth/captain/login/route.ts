'use server'

import { NextResponse } from "next/server";
import axios from "axios";
import { BACKEND_URL } from "@/lib/data";


export  async function POST(req : Request){
    const {email, password} = await req.json();
    if(!email || !password){
        return NextResponse.json({error : "Email and password are required"}, {status : 400})
    }
    try {
        const res = await axios.post(`${BACKEND_URL}/captain/login`, {email, password})
        const data = await res.data;
        if(!data){
            return NextResponse.json({error : "Invalid credentials"}, {status : 401})
        }
        const token = data.token;
        if(!token){
            return NextResponse.json({error : "Invalid credentials"}, {status : 401})
        }
        console.log("this is hte token ",token)
        const response = NextResponse.json({message : "Login successful", success : true}, {status : 200})
        response.cookies.set("token", token, {
            httpOnly : true,
            secure : process.env.NODE_ENV !== "development",
            maxAge : 60 * 60 * 24 * 30,
            path : "/",
        })
        response.cookies.set("user", btoa("captain"), {
            httpOnly : true,
            secure : process.env.NODE_ENV !== "development",
            maxAge : 60 * 60 * 24 * 30,
            path : "/",
        })
        return response;
        
        
        
    } catch (error) {
        if(axios.isAxiosError(error)){
            return NextResponse.json({error : error.response?.data}, {status : 400})
        }
        return NextResponse.json({error : "Something went wrong"}, {status : 500})
    }
}