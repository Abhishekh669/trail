import mongoose, { mongo, Schema } from "mongoose";


const rideSchema = new Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
    captain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'captain',
    },
    pickup: {
        location : {
            type : String,
            required: true,
        },
        lat : {
            type : Number,
            required: true,
        },
        lon : {
            type : Number,
            required: true,
        },

    },
    destination: {
        location : {
            type : String,
            required: true,
        },
        lat : {
            type : Number,
            required: true,
        },
        lon : {
            type : Number,
            required: true,
        },

    },
    fare: {
        type: Number,
        required: true,
    },

    status: {
        type: String,
        enum: [ 'pending', 'accepted', "ongoing", 'completed', 'cancelled' ],
        default: 'pending',
    },

    duration: {
        type: Number,
    }, // in seconds

    distance: {
        type: Number,
    }, // in meters

    paymentID: {
        type: String,
    },
    orderId: {
        type: String,
    },
    signature: {
        type: String,
    },

    otp: {
        type: String,
        select: false,
        required : true,
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    updatedAt : {
        type : Date,
        default : Date.now
    }
})


export const Ride = mongoose.models.Ride || mongoose.model("Ride", rideSchema);
