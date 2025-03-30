import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.model";
import { validationResult } from "express-validator";
import { createUser } from "../services/user.services";
import bcrypt from "bcryptjs"
import { decodeToken } from "../lib/db";
import { BlackListToken } from "../models/blaclistToken.model";


export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { fullName, email, password } = req.body;

        const isUserAlready = await User.findOne({ email });


        if (isUserAlready) {
            res.status(401).json({ message: 'User already exist' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUserData = await createUser({
            firstName: fullName.firstName,
            lastName: fullName.lastName,
            email,
            password: hashedPassword,
        });
        const token = newUserData.generateAuthToken();
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: 30 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
        })
        res.status(201).json({message : "User created successfully", token, newUserData })
    } catch (error) {
        res.status(400).json({ message: error || "something went wrong" })
    }
}




export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const { email, password } = req.body;
        console.log("this is the email and password for the user login : ",email, password)

        const user = await User.findOne({ email }).select("+password")
        console.log("this is the user for the user login : ",user)
        if (!user) {
            res.status(400).json({ message: "Invaid email or password" })
            return
        }

        const isMatch = await user.comparePassword(password);

        console.log("this is the isMatch for the user login : ",isMatch)

        if (!isMatch) {
            res.status(400).json({ message: "Invaid email or password" })
            return
        }

        const token = user.generateAuthToken();
        res.cookie('token', token)
        res.status(200).json({message : "Login successfully", token, user })

    } catch (error) {
        res.status(400).json({ message: error || "something went wrong" })
    }

}



export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token || req.headers?.authorization?.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Unauthorized" })
        return
    }
    try {
        const user = await decodeToken(token);
       res.status(200).json({message : "User profile fetched successfully", user})
    } catch (error) {
        res.status(400).json({ message: error || "something went wrong" })
    }
}

export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token || req.headers?.authorization?.split(" ")[1];
    if(!token){
        res.status(401).json({message : "Unauthorized"})
        return
    }
    try {
        const token = req.cookies.token || req.headers?.authorization?.split(" ")[1];
        if(!token){
            res.status(401).json({message : "Unauthorized"})
            return
        }
        
        await BlackListToken.create({token})
        res.clearCookie("token")
        res.status(200).json({message : "Logout successfully"})
    } catch (error) {
        res.status(400).json({message : error || "something went wrong"})
        
    }
}   

