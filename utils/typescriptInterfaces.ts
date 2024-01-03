import { ObjectId } from "mongodb";
import { shiftSchedule } from "../model/shiftScheduleModel";
import { staffMember } from "../model/staffMemberModel";

export interface IshiftAssignment{
    shiftSchedule: typeof shiftSchedule;
    staffMember : typeof staffMember;
}

export interface IshiftAssignmentRequest{
    shiftScheduleId : ObjectId,
    staffMembers : any[]
}

export interface IshiftSchedule{
    date : Date,
    startTime : number,
    endTime : number,
    requiredStaffCount : number
}

export interface IstaffMember{
    name : string,
    dates : Date[],
    startTime : number,
    endTime : number
}