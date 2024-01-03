import { Long } from "mongodb";
import mongoose from "mongoose";
import { Schema } from "mongoose";
import { IstaffMember } from "../utils/typescriptInterfaces";

export const staffMember = new Schema({
    name : {
        type : String,
        required : true
    },
    dates : {
        type : [Date],
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
})

export default mongoose.model<IstaffMember>("staffMember", staffMember);