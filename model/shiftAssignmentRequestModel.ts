import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { Schema } from "mongoose";
import { IshiftAssignmentRequest } from "../utils/typescriptInterfaces";

export const shiftAssignmentRequest = new Schema({
    shiftScheduleId : {
        type : ObjectId,
        required : true
    },
    staffMembers : {
        type : [],
        required : true
    }
})

export default mongoose.model<IshiftAssignmentRequest>("shiftAssignmentRequest", shiftAssignmentRequest);