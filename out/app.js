"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const Error_1 = __importDefault(require("./middleware/Error"));
const connection_1 = __importDefault(require("./config/connection"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
(0, connection_1.default)();
app.use(express_1.default.urlencoded({
    extended: true,
}));
dotenv_1.default.config({
    path: './config/.env'
});
const taskRouter_1 = __importDefault(require("./routes/taskRouter"));
app.use("/api", taskRouter_1.default);
exports.default = app;
app.use(Error_1.default);
