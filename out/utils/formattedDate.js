"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFormattedDate = void 0;
const getFormattedDate = (date) => {
    const newDate = new Date(date);
    const formattedDate = newDate.toISOString().split('T')[0];
    return formattedDate;
};
exports.getFormattedDate = getFormattedDate;
