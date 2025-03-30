interface LocationType{
    location :  string,
    lat : number,
    lon : number,
}



export interface RideType{
    _id ?: string,
    user: string;
    captain?: string;
    pickup: LocationType;
    destination: LocationType;
    fare: number;
    status : 'pending' | 'accepted' | 'ongoing' | 'completed' | 'cancelled';
    duration: number; // in seconds
    distance: number; // in meters
    paymentID?: string;
    orderId?: string;
    signature?: string;
    otp : string;
    createdAt?: Date;
    updatedAt?: Date;
  }