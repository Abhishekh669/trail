import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { createRide, deleteRide } from "../services/ride.services";
import crypto from "crypto";
import { getUserProfile } from "./user.controller";
import { decodeToken } from "../lib/db";
import { io } from "../lib/socket-io";
import { Captain } from "../models/captain.model";

type TransportMode = "driving" | "walking" | "cycling";

interface FareDetails {
  duration: number; // in hours
  fare: number; // in ₹
}

interface FareResult {
  distance: number; // in km
  modes: Map<TransportMode, FareDetails>;
  getFareByMode: (mode: TransportMode) => FareDetails;
}

export const getFare = async (distance: number): Promise<FareResult> => {
  const AVG_SPEEDS = {
    driving: 40,    // km/h (average car speed)
    cycling: 15,    // km/h (average cycling speed)
    walking: 5,     // km/h (average walking speed)
  };

  const BASE_RATES = {
    driving: 20,    // ₹/km (car rate)
    cycling: 10,    // ₹/km (bicycle rate)
    walking: 5,     // ₹/km (walking rate)
  };

  const MINIMUM_FARES = {
    driving: 50,    // ₹ (minimum fare for driving)
    cycling: 25,    // ₹ (minimum fare for cycling)
    walking: 20,    // ₹ (minimum fare for walking)
  };

  const fareMap = new Map<TransportMode, FareDetails>();

  (Object.keys(AVG_SPEEDS) as TransportMode[]).forEach((mode) => {
    const duration = distance / AVG_SPEEDS[mode];
    const fare = Math.max(distance * BASE_RATES[mode], MINIMUM_FARES[mode]);

    fareMap.set(mode, {
      duration: parseFloat(duration.toFixed(2)),
      fare: Math.round(fare),
    });
  });

  return {
    distance: parseFloat(distance.toFixed(2)),
    modes: fareMap,
    getFareByMode: (mode: TransportMode) => {
      const details = fareMap.get(mode);
      if (!details) {
        throw new Error(`Invalid transport mode: ${mode}`);
      }
      return details;
    },
  };
};


function getOtp(length: number): string {
  if (length <= 0 || !Number.isInteger(length)) {
    throw new Error("OTP length must be a positive integer");
  }
  const actualLength = Math.max(4, length);
  const min = 10 ** (actualLength - 1);
  const max = 10 ** actualLength - 1;

  return crypto
    .randomInt(min, max + 1)
    .toString()
    .padStart(actualLength, "0");
}

export const createRiderHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const token = req.cookies.token || req.headers?.authorization?.split(" ")[1];
  if (!token) {
      res.status(401).json({ message: "Unauthorized" })
      return
  }
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ message: errors.array() });
    return;
  }

   const user = await decodeToken(token);



  const { userId, pickup, destination, vehicleType, distance } = req.body;
  console.log("user  id i have sent : ",userId, "userId from token : ",user._id)
  if(userId !== user._id.toString()){
    res.status(401).json({
      message : "unauthorrized"
    })
    return;
  }
  const fareResult = await getFare(distance);
  const fare = fareResult.getFareByMode(vehicleType).fare;

  try {
    const ride = await createRide({
      user: user._id.toString(),
      pickup,
      destination,
      fare,
      duration: fareResult.getFareByMode(vehicleType).duration,
      otp: getOtp(6),
      distance: distance,
      status: "pending",
    });

    if (!ride) {
      res.status(400).json({
        message: "failed to create new ride",
      });
      return;
    }
    console.log("this is the created ride : ",ride)
    const availableCaptains = await Captain.find({
        status : 'available'
    })

    availableCaptains && availableCaptains.length > 0 && availableCaptains.forEach(captain =>{
      io.to(captain.socketId).emit('newRideRequest', ride)
    })




    res.status(201).json({
      message: "ride created successfully",
      ride,
    });
  } catch (error) {
    res.status(400).json({ message : error || "something went wrong" });
  }
};


export const DeleteRideController = async(req: Request,
  res: Response,
  next: NextFunction)=>{
  try {
    const id = req.params.id;
    if(!id){
      res.status(400).json({message : "invalid id"})
      return;
    }
    await deleteRide(id)
    
    res.status(200).json({message : "deleted successfully", success : true})
    
  } catch (error) {
    res.status(400).json({message  : error || "something went wrong"})
    
  }

}
