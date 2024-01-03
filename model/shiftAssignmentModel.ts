import mongoose from "mongoose";
import { Schema } from "mongoose";
import { IshiftAssignment } from "../utils/typescriptInterfaces";

const shiftAssignment: Schema = new Schema({
    shiftSchedule: { 
        type: Schema.Types.ObjectId, 
        ref: "shiftSchedule", 
        required: true 
    },
    staffMember: { 
        type: Schema.Types.ObjectId, 
        ref: "staffMember", 
        required: true 
    }
});

export default mongoose.model<IshiftAssignment>("shiftAssignment", shiftAssignment);