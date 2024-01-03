"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shiftSchedule = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
exports.shiftSchedule = new mongoose_2.Schema({
    date: {
        type: Date,
    },
    startTime: {
        type: Number,
        min: 1,
        max: 24
    },
    endTime: {
        type: Number,
        min: 1,
        max: 24
    },
    requiredStaffCount: {
        type: Number
    }
});
exports.default = mongoose_1.default.model("shiftSchedule", exports.shiftSchedule);
