import express from "express";
import bodyParser from "body-parser";
import afipRoutes from "./routes/afipRoutes";
import cors from "cors"; // Import CORS module
require("dotenv").config();

import morgan from "morgan";

const app = express();
const port = process.env.PORT || 4000; // Fallback to 3000 if PORT is not defined
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json());
app.use(cors());

app.use(morgan("dev")); // 'dev' format for development logging

app.use(afipRoutes);

app.listen(port, () => {
  console.log(`Middleware corriendo en http://localhost:${port}`);
});
