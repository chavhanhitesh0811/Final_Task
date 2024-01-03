"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shiftAssignmentRequest = void 0;
const mongodb_1 = require("mongodb");
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
exports.shiftAssignmentRequest = new mongoose_2.Schema({
    shiftScheduleId: {
        type: mongodb_1.ObjectId,
        required: true
    },
    staffMembers: {
        type: [],
        required: true
    }
});
exports.default = mongoose_1.default.model("shiftAssignmentRequest", exports.shiftAssignmentRequest);
