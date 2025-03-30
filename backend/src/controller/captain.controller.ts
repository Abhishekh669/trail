import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { Captain } from "../models/captain.model";
import bcrypt from "bcryptjs"
import { createCaptain } from "../services/captain.service";
import { decodeCaptainToken, decodeToken } from "../lib/db";
import { BlackListToken } from "../models/blaclistToken.model";
export const registerCaptain = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ message: errors.array() })
            return;
        }
        const { fullName, email, password, vehicle, location } = req.body;
        const isCaptainExist = await Captain.findOne({ email })
        if (isCaptainExist) {
            res.status(400).json({ message: "Captain already exists" })
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newCaptain = await createCaptain({ fullName, email, password: hashedPassword, vehicle, location })
        if (!newCaptain) {
            res.status(400).json({ message: "Something went wrong" })
            return;
        }
        const token = newCaptain.generateAuthToken()
        res.status(201).json({ message: "Captain created successfully", newCaptain, token })



    } catch (error) {
        res.status(400).json({ message: error || "Something went wrong" })

    }
}


export const loginCaptain = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ message: errors.array() })
            return;
        }
        const { email, password } = req.body;
        console.log("this is email", email)
        const captain = await Captain.findOne({ email }).select("+password")
        if (!captain) {
            res.status(400).json({ message: "Invalid email or password" })
            return;
        }
        console.log("this is captain", captain)
        const isMatch = await bcrypt.compare(password, captain.password)
        console.log("this is isMatch", isMatch)
        if (!isMatch) {
            res.status(400).json({ message: "Invalid email or password" })
            return;
        }

        const token = captain.generateAuthToken()
        res.cookie('token', token)
        res.status(200).json({ message: "Login successfully", token, captain })
    } catch (error) {
        res.status(400).json({ message: error || "Something went wrong" })
    }
}


export const getCaptainProfile = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token || req.headers?.authorization?.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Unauthorized" })
        return
    }
    try {
        const captain = await decodeCaptainToken(token);
        res.status(200).json({ message: "Captain profile fetched successfully", user : captain })
    } catch (error) {
        res.status(400).json({ message: error || "Something went wrong" })
    }
}

export const logoutCaptain = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token || req.headers?.authorization?.split(" ")[1];
        if (!token) {
            res.status(401).json({ message: "Unauthorized" })
            return
        }
        await BlackListToken.create({ token })
        res.clearCookie("token")
        res.status(200).json({ message: "Logout successfully" })
    } catch (error) {
        res.status(400).json({ message: error || "Something went wrong" })

    }

}   


export const updateStatus = async(req: Request, res: Response, next: NextFunction) =>{
    const token = req.cookies.token || req.headers?.authorization?.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Unauthorized" })
        return
    }
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ message: errors.array() })
            return;
        }
        const {status} = req.body;
        const captainId = await decodeCaptainToken(token)
        const checkCaptain = await Captain.findById({_id : captainId._id});
        if(!checkCaptain || !checkCaptain._id || !checkCaptain.email){
            res.status(401).json({message : "no captain found"})
            return 
        }
        const updateCaptainStatus = await Captain.findByIdAndUpdate(checkCaptain._id, {status})
        if(!updateCaptainStatus){
            res.status(401).json({message : "failed to update captain found"})
            return;
        }
        res.status(201).json({
            message : "successfully updated status",
            success : true
        })
    } catch (error) {
        res.status(400).json({message : error || "something went wrong"})
        
    }
}