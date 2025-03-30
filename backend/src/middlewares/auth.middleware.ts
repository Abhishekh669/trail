import { NextFunction,  Request,  Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user.model";
import { BlackListToken } from "../models/blaclistToken.model";
import { Captain } from "../models/captain.model";



export const middlewareValidation = async (req : Request, res : Response, next : NextFunction) =>{
    const token = req.cookies.token || req.headers?.authorization?.split(" ")[1];
    if(!token){
        res.status(401).json({message : "Unauthorized"})
        return
    }

    const blackListedToken = await BlackListToken.findOne({token})
    if(blackListedToken){
        res.status(401).json({message : "Unauthorized"})
        return
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
        const user = await User.findById(decoded._id);
        if(!user){
            res.status(401).json({message : "Unauthorized"})
            return
        }
        next();
    } catch (error) {

        res.status(400).json({error : "something went wrong"})
    }
}


export const captainMiddlewareValidation = async (req : Request, res : Response, next : NextFunction) =>{
    const token = req.cookies.token || req.headers?.authorization?.split(" ")[1];
    if(!token){
        res.status(401).json({message : "Unauthorized"})
        return
    }
    const blackListedToken = await BlackListToken.findOne({token})
    if(blackListedToken){
        res.status(401).json({message : "Unauthorized"})
        return
    }
    try {   
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
        const captain = await Captain.findById(decoded._id);
        if(!captain){
            res.status(401).json({message : "Unauthorized"})
            return
        }
        next();
    } catch (error) {
        res.status(400).json({error : "something went wrong"})
    }
}


