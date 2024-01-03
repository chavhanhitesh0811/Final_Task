import mongoose from "mongoose";
import { Schema } from "mongoose";
import { IshiftSchedule } from "../utils/typescriptInterfaces";

export const shiftSchedule = new Schema({
    date : {
        type : Date,
    },
    startTime : {
        type : Number,
        min : 1,
        max : 24
    },
    endTime : {
        type : Number,
        min : 1,
        max : 24
    },
    requiredStaffCount : {
        type : Number
    }
})

export default mongoose.model<IshiftSchedule>("shiftSchedule", shiftSchedule);