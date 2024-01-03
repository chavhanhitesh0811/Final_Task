"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffMember = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
exports.staffMember = new mongoose_2.Schema({
    name: {
        type: String,
        required: true
    },
    dates: {
        type: [Date],
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
});
exports.default = mongoose_1.default.model("staffMember", exports.staffMember);
