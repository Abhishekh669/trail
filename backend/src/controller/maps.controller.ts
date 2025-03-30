



import express, { Express, Request, Response } from "express";
import { validationResult } from "express-validator";

const getCoordinatedHandler = async (req: express.Request, res: express.Response ) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).json({errors : errors.array()})
        return
    }

    const {address} = req.query;

    try{
    }

}