import express from "express";
import { AfipAuth } from "./services/wsaa";
import { WsfeService } from "./services";
import bodyParser from "body-parser";
import afipRoutes from "./routes/afipRoutes";

import morgan from "morgan";

const app = express();
const port = 4000; // El puerto en el que se ejecutará tu middleware
app.use(express.json());
app.use(bodyParser.json());

const afipAuth = new AfipAuth(
  "./src/certs/privateKey.pem",
  "./src/certs/cert.pem",
  false
);
const wsfeService = new WsfeService(afipAuth);

app.use(morgan("dev")); // 'dev' format for development logging

app.use(afipRoutes);

app.listen(port, () => {
  console.log(`Middleware corriendo en http://localhost:${port}`);
});
