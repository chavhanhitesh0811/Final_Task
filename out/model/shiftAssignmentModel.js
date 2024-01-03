"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const shiftAssignment = new mongoose_2.Schema({
    shiftSchedule: {
        type: mongoose_2.Schema.Types.ObjectId,
        ref: "shiftSchedule",
        required: true
    },
    staffMember: {
        type: mongoose_2.Schema.Types.ObjectId,
        ref: "staffMember",
        required: true
    }
});
exports.default = mongoose_1.default.model("shiftAssignment", shiftAssignment);
