import express from "express";
import { AfipAuth } from "./services/wsaa";
import { WsfeService } from "./services/wsfe";
import bodyParser from "body-parser";

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

app.get("/api/afip", async (req, res) => {
  try {
    const service = req.query.service as string;
    const cuit = req.query.cuit as string; // Reemplaza esto con el CUIT real que necesitas usar

    const { token, sign } = await afipAuth.getAuthToken(cuit, service);
    if (!token || !sign) {
      return res.status(500).json({ error: Error });
    }
    res.json({ token, sign });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Se produjo un error desconocido" });
    }
  }
});

app.get("/api/last-voucher", async (req, res) => {
  try {
    const cuit = req.query.cuit;
    const service = req.query.service;
    const salesPoint = req.query.salesPoint;
    const invoiceType = req.query.invoiceType;

    // Asegúrate de que todos los parámetros son strings
    if (
      typeof cuit !== "string" ||
      typeof service !== "string" ||
      typeof salesPoint !== "string" ||
      typeof invoiceType !== "string"
    ) {
      return res.status(400).json({ error: "Parámetros inválidos" });
    }

    console.log(service);
    console.log(cuit);
    const { token, sign } = await afipAuth.getAuthToken(cuit, service);
    console.log("Token:", token, "Sign:", sign);

    const FECompUltimoAutorizado = await wsfeService.getLastVoucher(
      salesPoint,
      invoiceType,
      cuit,
      token,
      sign,
      service
    );

    // Devuelve el resultado (ajusta esto según lo que necesites)
    res.json(FECompUltimoAutorizado);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Se produjo un error desconocido" });
    }
  }
});

app.get("/api/sales-point", async (req, res) => {
  try {
    const cuit = req.query.cuit;
    const service = req.query.service;
    const salesPoint = req.query.salesPoint;
    const invoiceType = req.query.invoiceType;

    // Asegúrate de que todos los parámetros son strings
    if (
      typeof cuit !== "string" ||
      typeof service !== "string" ||
      typeof salesPoint !== "string" ||
      typeof invoiceType !== "string"
    ) {
      return res.status(400).json({ error: "Parámetros inválidos" });
    }

    console.log(service);
    console.log(cuit);
    const { token, sign } = await afipAuth.getAuthToken(cuit, service);
    console.log("Token:", token, "Sign:", sign);

    const FECompUltimoAutorizado = await wsfeService.getSalesPoints(
      cuit,
      token,
      sign
    );

    // Devuelve el resultado (ajusta esto según lo que necesites)
    res.json(FECompUltimoAutorizado);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Se produjo un error desconocido" });
    }
  }
});

app.post("/afip/create-invoice", async (req, res) => {
  try {
    const cuit = "23337876609"; // Debes obtener el CUIT de alguna manera
    const service = "wsfe"; // O el servicio correspondiente

    const { token, sign } = await afipAuth.getAuthToken(cuit, service);
    if (!token || !sign) {
      return res
        .status(500)
        .json({ error: "No se pudo obtener el token o la firma" });
    }

    const invoiceData = req.body; // Asume que los datos de la factura vienen en el cuerpo de la solicitud
    const invoiceResponse = await wsfeService.createInvoice(
      cuit,
      token,
      sign,
      invoiceData
    );
    res.json(invoiceResponse);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res
        .status(500)
        .json({ error: "Se produjo un error desconocido creando la factura" });
    }
  }
});

app.get("/afip/server-status", async (req, res) => {
  try {
    const cuit = req.query.cuit as string;
    const service = "wsfe"; // O el servicio correspondiente

    const { token, sign } = await afipAuth.getAuthToken(cuit, service);
    if (!token || !sign) {
      return res
        .status(500)
        .json({ error: "No se pudo obtener el token o la firma" });
    }

    const serverStatus = await wsfeService.checkServerStatus(cuit, token, sign);
    res.json(serverStatus);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Se produjo un error desconocido" });
    }
  }
});

app.listen(port, () => {
  console.log(`Middleware corriendo en http://localhost:${port}`);
});
