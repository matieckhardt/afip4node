"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const afipRoutes_1 = __importDefault(require("./routes/afipRoutes"));
const cors_1 = __importDefault(require("cors")); // Import CORS module
require("dotenv").config();
const morgan_1 = __importDefault(require("morgan"));
const app = (0, express_1.default)();
const port = process.env.PORT || 4000; // Fallback to 3000 if PORT is not defined
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev")); // 'dev' format for development logging
app.use(afipRoutes_1.default);
app.listen(port, () => {
    console.log(`afip4node esta corriendo en http://localhost:${port}`);
});
