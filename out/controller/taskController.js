"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.viewAllShifts = exports.viewAllStaffs = exports.deleteStaff = exports.updateStaffDetails = exports.viewStaffDetails = exports.updateShiftDetails = exports.viewShiftDetails = exports.assignStaffToShifts = exports.createStaffMember = exports.createShiftSchedule = void 0;
const handleAsyncError_1 = __importDefault(require("../middleware/handleAsyncError"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const shiftScheduleModel_1 = __importDefault(require("../model/shiftScheduleModel"));
const staffMemberModel_1 = __importDefault(require("../model/staffMemberModel"));
const formattedDate_1 = require("../utils/formattedDate");
const shiftAssignmentModel_1 = __importDefault(require("../model/shiftAssignmentModel"));
exports.createShiftSchedule = (0, handleAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, startTime, endTime, requiredStaffCount } = req.body;
    if (!date || !startTime || !endTime || !requiredStaffCount) {
        return next(new errorHandler_1.default("Bad Request", 400));
    }
    const newShiftSchedule = new shiftScheduleModel_1.default({ date, startTime, endTime, requiredStaffCount });
    let result = yield newShiftSchedule.save();
    if (!result) {
        return next(new errorHandler_1.default("Bad Request", 400));
    }
    res.status(200).json({
        message: `Shift Schedule details saved with id ${result._id}`
    });
}));
exports.createStaffMember = (0, handleAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, dates, startTime, endTime } = req.body;
    if (!name || !dates || !startTime || !endTime) {
        return next(new errorHandler_1.default("Bad Request", 400));
    }
    const newStaffMember = new staffMemberModel_1.default({ name, dates, startTime, endTime });
    let result = yield newStaffMember.save();
    if (!result) {
        return next(new errorHandler_1.default("Bad Request", 400));
    }
    res.status(200).json({
        message: `Staff member added successfully in the database with staff id ${result._id}`
    });
}));
exports.assignStaffToShifts = (0, handleAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { shiftScheduleId, staffMembers } = req.body;
    // Validation for null input fields
    if (!shiftScheduleId || !staffMembers) {
        return next(new errorHandler_1.default("Bad Request", 400));
    }
    // retriving data for the required shift
    let Shift = yield shiftScheduleModel_1.default.find({ _id: shiftScheduleId });
    // extra validation to check whether the provided shift id is valid.
    // if(Shift.length == 0){
    //     return next(new ErrorHandler("Please Enter a valid shift id.", 400));
    // }
    let fomattedDateOfShift = (0, formattedDate_1.getFormattedDate)(Shift[0].date);
    // checking if the assignment members are greater than required members
    let alreadyAssignedMembers = yield shiftAssignmentModel_1.default.find({ shiftSchedule: shiftScheduleId });
    let newMemberToAdd = 0;
    for (const member of staffMembers) {
        let isNewAlreadyInserted = yield shiftAssignmentModel_1.default.find({ shiftSchedule: shiftScheduleId, staffMember: member });
        if (isNewAlreadyInserted.length == 0) {
            newMemberToAdd++;
        }
    }
    if ((alreadyAssignedMembers.length + newMemberToAdd) > Shift[0].requiredStaffCount) {
        return next(new errorHandler_1.default("Given shiftShedule is full you can try assigning staff in different shift", 400));
    }
    let validStaff = [];
    for (const staffMember of staffMembers) {
        let staff = yield staffMemberModel_1.default.findOne({ _id: staffMember });
        validStaff.push(staff);
    }
    // assigned the empty array to maintain record of the not available for day and not available for time
    let notAvailableStaffId = [];
    let notAvailableForTimeRange = [];
    // iterate through the staff details
    validStaff.map((staff) => __awaiter(void 0, void 0, void 0, function* () {
        let matchCount = 0;
        // iterate through the available dates of staff and increment the count if matched
        for (const date of staff.dates) {
            const dateOfShift = (0, formattedDate_1.getFormattedDate)(date);
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
    }));
    // check if there are any unavailable staff for the day
    if (notAvailableStaffId.length >= 1) {
        return next(new errorHandler_1.default("Some staffs are not available on the given shift date", 400));
    }
    // check if the time of any staff is not matching to the shift time.
    if (notAvailableForTimeRange.length >= 1) {
        let notAvail = "";
        notAvailableForTimeRange.forEach((member) => {
            notAvail += `${member} ,`;
        });
        return next(new errorHandler_1.default(`Staff member ${notAvail} is not available for the shift`, 400));
    }
    // if all the staff members are available the will assigb to the shift and insert the record of that to the database
    staffMembers.map((member) => __awaiter(void 0, void 0, void 0, function* () {
        let fetchResult = yield shiftAssignmentModel_1.default.find({ shiftSchedule: shiftScheduleId, staffMember: member });
        if (fetchResult.length == 0) {
            const newStaffAssignMent = new shiftAssignmentModel_1.default({ shiftSchedule: shiftScheduleId, staffMember: member });
            let insertResult = yield newStaffAssignMent.save();
            if (!insertResult) {
                return next(new errorHandler_1.default("Bad Request", 400));
            }
        }
    }));
    res.status(200).json({
        message: "Staff assigned to shifts successfully"
    });
}));
exports.viewShiftDetails = (0, handleAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { date } = req.body;
    let dateToFetch = date + 'T00:00:00.000+00:00';
    let result = yield shiftScheduleModel_1.default.find({ date: dateToFetch });
    if (result.length == 0) {
        return next(new errorHandler_1.default("No shift details found for given date", 400));
    }
    res.status(200).json({
        shiftDetails: result
    });
}));
exports.updateShiftDetails = (0, handleAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, date, startTime, endTime, requiredStaffCount } = req.body;
    if (!date || !startTime || !endTime || !requiredStaffCount) {
        return next(new errorHandler_1.default("Bad Request", 400));
    }
    const result = yield shiftScheduleModel_1.default.findByIdAndUpdate({ _id: id }, { $set: req.body });
    if (!result) {
        return next(new errorHandler_1.default("Shift Details not found for the given id", 400));
    }
    res.status(200).json({
        message: "Shift Details Updated Successfully."
    });
}));
// Extra functionality
exports.viewStaffDetails = (0, handleAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    let result = yield staffMemberModel_1.default.find({ _id: id });
    if (result.length == 0) {
        return next(new errorHandler_1.default("No staff details found for given id", 400));
    }
    res.status(200).json({
        staffDetails: result
    });
}));
exports.updateStaffDetails = (0, handleAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, name, dates, startTime, endTime } = req.body;
    if (!id || !name || !dates || !startTime || !endTime) {
        return next(new errorHandler_1.default("Bad Request", 400));
    }
    const result = yield staffMemberModel_1.default.findByIdAndUpdate({ _id: id }, { $set: req.body });
    if (!result) {
        return next(new errorHandler_1.default("Staff Details not found for the given id", 400));
    }
    res.status(200).json({
        message: "Staff Details Updated Successfully."
    });
}));
exports.deleteStaff = (0, handleAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    if (!id) {
        return next(new errorHandler_1.default("Bad Request", 400));
    }
    const result = yield staffMemberModel_1.default.deleteOne({ _id: id });
    if (result.deletedCount == 0) {
        return next(new errorHandler_1.default(`Staff id ${id} does not exits. Please provide a valid staff id.`, 400));
    }
    res.status(200).json({
        message: "Staff record deleted Successfully."
    });
}));
exports.viewAllStaffs = (0, handleAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield staffMemberModel_1.default.find({});
    res.status(200).json({
        staffDetails: result
    });
}));
exports.viewAllShifts = (0, handleAsyncError_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let result = yield shiftScheduleModel_1.default.find({});
    res.status(200).json({
        shiftDetails: result
    });
}));
