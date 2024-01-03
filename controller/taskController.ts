import { Request, Response, NextFunction } from 'express';
import handleAsyncError from '../middleware/handleAsyncError';
import ErrorHandler from '../utils/errorHandler';
import { IshiftAssignmentRequest, IshiftSchedule, IstaffMember } from '../utils/typescriptInterfaces';
import shiftScheduleModel from '../model/shiftScheduleModel';
import staffMemberModel from '../model/staffMemberModel';
import { getFormattedDate } from '../utils/formattedDate';
import shiftAssignmentModel from '../model/shiftAssignmentModel';
import { ObjectId } from 'mongodb';

export const createShiftSchedule = handleAsyncError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { date, startTime, endTime, requiredStaffCount }: IshiftSchedule = req.body;

    if (!date || !startTime || !endTime || !requiredStaffCount) {
        return next(new ErrorHandler("Bad Request", 400));
    }

    const newShiftSchedule = new shiftScheduleModel({ date, startTime, endTime, requiredStaffCount });
    let result = await newShiftSchedule.save();

    if (!result) {
        return next(new ErrorHandler("Bad Request", 400));
    }

    res.status(200).json({
        message: `Shift Schedule details saved with id ${result._id}`
    })
});

export const createStaffMember = handleAsyncError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { name, dates, startTime, endTime }: IstaffMember = req.body;

    if (!name || !dates || !startTime || !endTime) {
        return next(new ErrorHandler("Bad Request", 400));
    }

    const newStaffMember = new staffMemberModel({ name, dates, startTime, endTime });
    let result = await newStaffMember.save();

    if (!result) {
        return next(new ErrorHandler("Bad Request", 400));
    }

    res.status(200).json({
        message: `Staff member added successfully in the database with staff id ${result._id}`
    })
});

export const assignStaffToShifts = handleAsyncError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { shiftScheduleId, staffMembers }: IshiftAssignmentRequest = req.body;

    // Validation for null input fields
    if (!shiftScheduleId || !staffMembers) {
        return next(new ErrorHandler("Bad Request", 400));
    }

    // retriving data for the required shift
    let Shift = await shiftScheduleModel.find({ _id: shiftScheduleId });

    // extra validation to check whether the provided shift id is valid.
    // if(Shift.length == 0){
    //     return next(new ErrorHandler("Please Enter a valid shift id.", 400));
    // }

    let fomattedDateOfShift: String = getFormattedDate(Shift[0].date);


    // checking if the assignment members are greater than required members
    let alreadyAssignedMembers = await shiftAssignmentModel.find({ shiftSchedule : shiftScheduleId });
    let newMemberToAdd = 0;

    for(const member of staffMembers){
        let isNewAlreadyInserted = await shiftAssignmentModel.find({ shiftSchedule : shiftScheduleId , staffMember: member });
        if(isNewAlreadyInserted.length == 0){
            newMemberToAdd++;
        }
    }

    if ((alreadyAssignedMembers.length + newMemberToAdd ) > Shift[0].requiredStaffCount) {
        return next(new ErrorHandler("Given shiftShedule is full you can try assigning staff in different shift", 400));
    }

    let validStaff: any[] = [];
    for (const staffMember of staffMembers) {
        let staff = await staffMemberModel.findOne({ _id: staffMember });
        validStaff.push(staff);
    }

    // assigned the empty array to maintain record of the not available for day and not available for time
    let notAvailableStaffId: ObjectId[] = [];
    let notAvailableForTimeRange: ObjectId[] = [];

    // iterate through the staff details
    validStaff.map(async (staff: any) => {
        let matchCount = 0;

        // iterate through the available dates of staff and increment the count if matched
        for (const date of staff.dates) {
            const dateOfShift : String = getFormattedDate(date);
            if (dateOfShift == fomattedDateOfShift) {
                matchCount++;
            }
        }

        // if dates of shift and staff not matched then 0 otherwise 1
        if (matchCount == 0) {
            notAvailableStaffId.push(staff._id);
        }
        else if (matchCount == 1) {
            if (staff.startTime < Shift[0].startTime || staff.endTime > Shift[0].endTime) {
                notAvailableForTimeRange.push(staff._id);
            }
        }
    });

    // check if there are any unavailable staff for the day
    if (notAvailableStaffId.length >= 1) {
        return next(new ErrorHandler("Some staffs are not available on the given shift date", 400));
    }

    // check if the time of any staff is not matching to the shift time.
    if (notAvailableForTimeRange.length >= 1) {
        let notAvail = "";
        notAvailableForTimeRange.forEach((member: ObjectId) => {
            notAvail += `${member} ,`;
        });

        return next(new ErrorHandler(`Staff member ${notAvail} is not available for the shift`, 400));
    }

    // if all the staff members are available the will assigb to the shift and insert the record of that to the database
    staffMembers.map(async (member) => {
        let fetchResult = await shiftAssignmentModel.find({ shiftSchedule: shiftScheduleId, staffMember: member });
        if (fetchResult.length == 0) {
            const newStaffAssignMent = new shiftAssignmentModel({ shiftSchedule: shiftScheduleId, staffMember: member });
            let insertResult = await newStaffAssignMent.save();

            if (!insertResult) {
                return next(new ErrorHandler("Bad Request", 400));
            }
        }
    });

    res.status(200).json({
        message: "Staff assigned to shifts successfully"
    });
});

export const viewShiftDetails = handleAsyncError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const { date } = req.body;
    let dateToFetch = date + 'T00:00:00.000+00:00';
    let result = await shiftScheduleModel.find({ date: dateToFetch });

    if (result.length == 0) {
        return next(new ErrorHandler("No shift details found for given date", 400));
    }

    res.status(200).json({
        shiftDetails: result
    })
});

export const updateShiftDetails = handleAsyncError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const { id, date, startTime, endTime, requiredStaffCount } = req.body;

    if (!date || !startTime || !endTime || !requiredStaffCount) {
        return next(new ErrorHandler("Bad Request", 400));
    }

    const result = await shiftScheduleModel.findByIdAndUpdate({ _id: id }, { $set: req.body });
    if(!result){
        return next(new ErrorHandler("Shift Details not found for the given id", 400));
    }

    res.status(200).json({
        message: "Shift Details Updated Successfully."
    })
});

// Extra functionality

export const viewStaffDetails = handleAsyncError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const { id } = req.body;
    let result = await staffMemberModel.find({ _id : id });

    if (result.length == 0) {
        return next(new ErrorHandler("No staff details found for given id", 400));
    }

    res.status(200).json({
        staffDetails: result
    })
});

export const updateStaffDetails = handleAsyncError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const { id, name, dates, startTime, endTime } = req.body;

    if (!id || !name || !dates || !startTime || !endTime) {
        return next(new ErrorHandler("Bad Request", 400));
    }

    const result = await staffMemberModel.findByIdAndUpdate({ _id: id }, { $set: req.body });
    if(!result){
        return next(new ErrorHandler("Staff Details not found for the given id", 400));
    }

    res.status(200).json({
        message: "Staff Details Updated Successfully."
    })
});

export const deleteStaff = handleAsyncError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const { id } = req.body;

    if (!id) {
        return next(new ErrorHandler("Bad Request", 400));
    }

    const result = await staffMemberModel.deleteOne({ _id: id });
    if(result.deletedCount == 0){
        return next(new ErrorHandler(`Staff id ${id} does not exits. Please provide a valid staff id.`, 400));
    }

    res.status(200).json({
        message: "Staff record deleted Successfully."
    })
});

export const viewAllStaffs = handleAsyncError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    let result = await staffMemberModel.find({});

    res.status(200).json({
        staffDetails: result
    })
});

export const viewAllShifts = handleAsyncError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    let result = await shiftScheduleModel.find({});

    res.status(200).json({
        shiftDetails: result
    })
});