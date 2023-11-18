import express from "express";
import { AfipAuth } from "../services/wsaa";
import { WsfeService } from "../services";

const router = express.Router();

const afipAuth = new AfipAuth(
  "./src/certs/privateKey.pem",
  "./src/certs/cert.pem",
  false
);

const wsfeService = new WsfeService(afipAuth);

// Aquí van todas tus rutas relacionadas con AFIP
// Por ejemplo:

router.get("/afip", async (req, res) => {
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

router.get("/afip/last-voucher", async (req, res) => {
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

    const { token, sign } = await afipAuth.getAuthToken(cuit, service);

    const FECompUltimoAutorizado = await wsfeService.getLastVoucher(
      token,
      sign,
      cuit,
      salesPoint,
      invoiceType,
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

router.get("/afip/sales-point", async (req, res) => {
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

    const { token, sign } = await afipAuth.getAuthToken(cuit, service);

    const FECompUltimoAutorizado = await wsfeService.getSalesPoints(
      cuit,
      token,
      sign,
      salesPoint,
      invoiceType,
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

router.get("/afip/tiposCbte", async (req, res) => {
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

    const { token, sign } = await afipAuth.getAuthToken(cuit, service);

    const FEParamGetTiposCbte = await wsfeService.getTiposCbte(
      cuit,
      token,
      sign,
      salesPoint,
      invoiceType,
      service
    );

    // Devuelve el resultado (ajusta esto según lo que necesites)
    res.json(FEParamGetTiposCbte);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Se produjo un error desconocido" });
    }
  }
});

router.get("/afip/tiposDoc", async (req, res) => {
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

    const { token, sign } = await afipAuth.getAuthToken(cuit, service);

    const FEParamGetTiposDoc = await wsfeService.getTiposDoc(cuit, token, sign);

    // Devuelve el resultado (ajusta esto según lo que necesites)
    res.json(FEParamGetTiposDoc);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Se produjo un error desconocido" });
    }
  }
});

router.get("/afip/tiposConc", async (req, res) => {
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

    const { token, sign } = await afipAuth.getAuthToken(cuit, service);

    const FEParamGetTiposConcepto = await wsfeService.getTiposConcepto(
      cuit,
      token,
      sign
    );

    // Devuelve el resultado (ajusta esto según lo que necesites)
    res.json(FEParamGetTiposConcepto);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Se produjo un error desconocido" });
    }
  }
});

router.get("/afip/tiposIva", async (req, res) => {
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

    const { token, sign } = await afipAuth.getAuthToken(cuit, service);

    const FEParamGetTiposIva = await wsfeService.getTiposIva(cuit, token, sign);

    // Devuelve el resultado (ajusta esto según lo que necesites)
    res.json(FEParamGetTiposIva);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Se produjo un error desconocido" });
    }
  }
});

router.get("/afip/tiposMonedas", async (req, res) => {
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

    const { token, sign } = await afipAuth.getAuthToken(cuit, service);

    const FEParamGetTiposMonedas = await wsfeService.getTiposMonedas(
      cuit,
      token,
      sign
    );

    // Devuelve el resultado (ajusta esto según lo que necesites)
    res.json(FEParamGetTiposMonedas);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Se produjo un error desconocido" });
    }
  }
});

router.get("/afip/tiposOpcionales", async (req, res) => {
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

    const { token, sign } = await afipAuth.getAuthToken(cuit, service);

    const FEParamGetTiposOpcionales = await wsfeService.getTiposOpcionales(
      cuit,
      token,
      sign
    );

    // Devuelve el resultado (ajusta esto según lo que necesites)
    res.json(FEParamGetTiposOpcionales);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Se produjo un error desconocido" });
    }
  }
});

router.get("/afip/server-status", async (req, res) => {
  try {
    const cuit = req.query.cuit as string;
    const service = "wsfe"; // O el servicio correspondiente

    const { token, sign } = await afipAuth.getAuthToken(cuit, service);
    if (!token || !sign) {
      return res
        .status(500)
        .json({ error: "No se pudo obtener el token o la firma" });
    }

    const serverStatus = await wsfeService.checkServerStatus();
    res.json(serverStatus);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Se produjo un error desconocido" });
    }
  }
});

router.post("/afip/create-invoice", async (req, res) => {
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

router.get("/afip/tiposPaises", async (req, res) => {
  try {
    const cuit = req.query.cuit as string;
    const service = req.query.service as string;

    if (!cuit || !service) {
      return res
        .status(400)
        .json({ error: "Faltan parámetros requeridos: cuit y service" });
    }

    const { token, sign } = await afipAuth.getAuthToken(cuit, service);
    if (!token || !sign) {
      return res
        .status(500)
        .json({ error: "No se pudo obtener el token o la firma" });
    }

    const tiposPaises = await wsfeService.getTiposPaises(cuit, token, sign);

    res.json(tiposPaises);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Se produjo un error desconocido" });
    }
  }
});

router.get("/afip/tiposTributos", async (req, res) => {
  try {
    const cuit = req.query.cuit as string;
    const service = req.query.service as string;

    if (!cuit || !service) {
      return res
        .status(400)
        .json({ error: "Faltan parámetros requeridos: cuit y service" });
    }

    const { token, sign } = await afipAuth.getAuthToken(cuit, service);
    if (!token || !sign) {
      return res
        .status(500)
        .json({ error: "No se pudo obtener el token o la firma" });
    }

    const tiposPaises = await wsfeService.getTiposTributos(cuit, token, sign);

    res.json(tiposPaises);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Se produjo un error desconocido" });
    }
  }
});

router.post("/afip/caea-consultar", async (req, res) => {
  try {
    const cuit = req.body.cuit as string;
    const service = req.body.service as string;
    const PtoVta = req.body.PtoVta as number;
    const Periodo = req.body.Periodo as number;
    const Orden = req.body.Orden as number;

    if (
      !cuit ||
      !service ||
      PtoVta === undefined ||
      Periodo === undefined ||
      Orden === undefined
    ) {
      return res.status(400).json({
        error: "Faltan parámetros requeridos en el cuerpo de la solicitud",
      });
    }

    const { token, sign } = await afipAuth.getAuthToken(cuit, service);
    if (!token || !sign) {
      return res
        .status(500)
        .json({ error: "No se pudo obtener el token o la firma" });
    }

    const consultaCAEA = await wsfeService.FECAEAConsultar(
      cuit,
      token,
      sign,
      PtoVta,
      Periodo,
      Orden
    );

    res.json(consultaCAEA);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Se produjo un error desconocido" });
    }
  }
});
export default router;
