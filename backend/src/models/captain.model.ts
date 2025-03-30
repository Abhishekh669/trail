import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Interfaces
interface IName {
    firstName: string;
    lastName?: string;
}

interface IVehicle {
    color: string;
    plate: string;
    capacity: number;
    vehicleType: 'car' | 'motorcycle' | 'auto';
}

interface ILocation {
    ltd?: number;
    lng?: number;
}

interface ICaptain extends Document {
    fullName: IName;
    email: string;
    password: string;
    socketId?: string;
    status: "offline" | "available" | "on_ride";
    vehicle: IVehicle;
    location: ILocation;
    createdAt : Date;
    generateAuthToken(): string;
    comparePassword(password: string): Promise<boolean>;
}

interface ICaptainModel extends Model<ICaptain> {
    hashPassword(password: string): Promise<string>;
}

const captainSchema = new mongoose.Schema<ICaptain, ICaptainModel>({
    fullName: {
        firstName: {
            type: String,
            required: true,
            minlength: [3, 'firstName must be at least 3 characters long'],
        },
        lastName: {
            type: String,
            minlength: [3, 'lastName must be at least 3 characters long'],
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    socketId: {
        type: String,
    },
    status: {
        type: String,
        enum: ["offline" , "available" , "on_ride"],
        default: 'offline',
    },
    vehicle: {
        color: {
            type: String,
            required: true,
            minlength: [3, 'Color must be at least 3 characters long'],
        },
        plate: {
            type: String,
            required: true,
            minlength: [3, 'Plate must be at least 3 characters long'],
        },
        capacity: {
            type: Number,
            required: true,
            min: [1, 'Capacity must be at least 1'],
        },
        vehicleType: {
            type: String,
            required: true,
            enum: ['car', 'motorcycle', 'auto'],
        }
    },
    location: {
        ltd: {
            type: Number,
        },
        lng: {
            type: Number,
        }
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
   
});

// Methods
captainSchema.methods.generateAuthToken = function(): string {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET!, { expiresIn: '24h' });
};


export const Captain = mongoose.models.Captain || mongoose.model<ICaptain, ICaptainModel>('Captain', captainSchema);