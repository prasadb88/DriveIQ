import mongoose from "mongoose";
import { User } from "./user.model.js";



const testDriveSchema = new mongoose.Schema({
    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
        required: [true, 'Test drive must be for a specific car']
    },
    buyer: {
         type: mongoose.Schema.Types.ObjectId,
            ref: User ,
            required:true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: [true, 'Test drive must be associated with a seller']
    },
    requestedTime: {
        type: String,
        required: [true, 'Requested test drive time is required']
    },
    requestedDate : {
        type:Date,
        required:[true]
      },
   
    confirmedTime: {
        type: Date,
        default: null 
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled','in-progress'],
        default: 'none'
    },
    rejectionReason: {
        type: String,
        trim: true 
    },
    testDriveCompleted: {
        type: Boolean,
        default: false 
    }
}, {
    timestamps: true 
});

export const TestDrive = mongoose.model('TestDrive', testDriveSchema);