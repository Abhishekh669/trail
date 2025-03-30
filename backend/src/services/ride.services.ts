import { errorMonitor } from "events";
import { RideType } from "../lib/types";
import { Ride } from "../models/ride.model";

export const createRide = async ({
  user,
  pickup,
  destination,
  fare,
  otp,
  duration,
  distance,
  status = "pending",
}: RideType) => {
  if (
    !user ||
    !pickup ||
    !destination ||
    !fare ||
    !otp ||
    !duration ||
    !distance
  ) {
    throw new Error("Invalid  payloads");
  }

  const newRider = await Ride.create({
    user,
    pickup,
    destination,
    fare,
    otp,
    duration,
    status,
    distance,
  });

  if (!newRider) {
    throw new Error("Failed to create new ride");
  }

  return newRider;
};

export const getRideById = async(id : string) =>{
  const data = await Ride.findById({_id: id});
  console.log('this is the id and this is hte data : ',id, data)
  if(!data)throw new Error("no data found")
    return data;
}



export const deleteRide = async (id: string): Promise<boolean> => {
  try {
    if (!id) {
      throw new Error('Invalid ride ID format');
    }

    await getRideById(id);
    
    const deletionResult = await Ride.deleteOne({ _id: id }).exec();
    
    if (deletionResult.deletedCount === 0) {
      throw new Error('Failed to delete ride - no documents were deleted');
    }

    return true;
  } catch (error) {
    console.error(`Error deleting ride ${id}:`, error);
    throw error; // Re-throw the error for the calling function to handle
  }
};