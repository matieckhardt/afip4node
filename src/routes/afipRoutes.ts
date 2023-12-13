import express from "express";
import { AfipAuth } from "../services/AfipAuthWSFE";
import { AfipAuthWSA13 } from "../services/AfipAuthWSA13";
import { AfipAuthWSA5 } from "../services/AfipAuthWSA5";
import { WsfeService } from "../services";
import { Wsa13Service } from "../services/wsa13";
import { Wsa5Service } from "../services/wsa5";

const router = express.Router();

const afipAuth = new AfipAuth(
  "./src/certs/privateKey.pem",
  "./src/certs/cert.pem",
  false
);

const afipAuthWSA13 = new AfipAuthWSA13(
  "./src/certs/privateKey.pem",
  "./src/certs/cert.pem",
  false
);
const afipAuthWSA5 = new AfipAuthWSA5(
  "./src/certs/privateKey.pem",
  "./src/certs/cert.pem",
  false
);

const wsfeService = new WsfeService(afipAuth);
const wsa13Service = new Wsa13Service(afipAuth);
const wsa5Service = new Wsa5Service(afipAuth);
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
    const service = "wsfe";
    const salesPoint = req.query.salesPoint;
    const invoiceType = req.query.invoiceType;

    // Asegúrate de que todos los parámetros son strings
    if (
      typeof cuit !== "string" ||
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
    const cuit = process.env.CUIT;
    const service = process.env.SERVICE;

    console.log(cuit, service);
    // Asegúrate de que todos los parámetros son strings
    if (typeof cuit !== "string" || typeof service !== "string") {
      return res.status(400).json({ error: "Parámetros inválidos" });
    }

    const { token, sign } = await afipAuth.getAuthToken(cuit, service);

    const FEParamGetPtosVenta = await wsfeService.getSalesPoints(
      cuit,
      token,
      sign,
      service
    );
    res.json(FEParamGetPtosVenta);
  } catch (error) {
    console.error("Route Error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
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
    const cuit = req.query.cuit; // Debes obtener el CUIT de alguna manera

    const service = "wsfe"; // O el servicio correspondiente
    const salesPoint = req.body.PtoVta;
    const invoiceType = req.body.CbteTipo;
    if (typeof cuit !== "string" || typeof service !== "string") {
      return res.status(400).json({
        error: "Invalid parameters: cuit and service must be strings",
      });
    }
    const { token, sign } = await afipAuth.getAuthToken(cuit, service);
    if (!token || !sign) {
      return res
        .status(500)
        .json({ error: "No se pudo obtener el token o la firma" });
    }

    const FECompUltimoAutorizado = await wsfeService.getLastVoucher(
      token,
      sign,
      cuit,
      salesPoint,
      invoiceType,
      service
    );
    console.log("ultimo autorizado create", FECompUltimoAutorizado.CbteNro);

    const invoiceData = req.body;
    invoiceData.CbteDesde = FECompUltimoAutorizado.CbteNro + 1;
    invoiceData.CbteHasta = FECompUltimoAutorizado.CbteNro + 1;

    console.log("invoice Data", invoiceData);
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

router.get("/afip/constancia", async (req, res) => {
  try {
    const documento = req.query.documento as string;
    const cuit = req.query.cuit as string;

    const { token, sign } = await afipAuthWSA13.getAuthToken(
      cuit,
      "ws_sr_padron_a13"
    );

    if (documento.length === 11) {
      const cuitInfo = await wsa13Service.getCUIT(cuit, token, sign, documento);
      res.json(cuitInfo);
    } else {
      const cuitList = await wsa13Service.getDNI(cuit, token, sign, documento);
      if (cuitList.length === 1) {
        const personaInfo = await wsa13Service.getCUIT(
          cuit,
          token,
          sign,
          cuitList[0]
        );
        res.json(personaInfo);
      } else {
        const allInfo = await Promise.all(
          cuitList.map(
            async (documento: string) =>
              await wsa13Service.getCUIT(cuit, token, sign, documento)
          )
        );
        res.json(allInfo);
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Se produjo un error desconocido" });
    }
  }
});

router.get("/afip/persona", async (req, res) => {
  try {
    const documento = req.query.documento as string;
    const cuit = req.query.cuit as string;

    const { token, sign } = await afipAuthWSA5.getAuthToken(
      cuit,
      "ws_sr_padron_a5"
    );

    if (documento.length === 11) {
      const cuitInfo = await wsa5Service.getCUIT(cuit, token, sign, documento);
      res.json(cuitInfo);
    } else {
      const cuitList = await wsa5Service.getDNI(cuit, token, sign, documento);
      if (cuitList.length === 1) {
        const personaInfo = await wsa5Service.getCUIT(
          cuit,
          token,
          sign,
          cuitList[0]
        );
        res.json(personaInfo);
      } else {
        const allInfo = await Promise.all(
          cuitList.map(
            async (documento: string) =>
              await wsa5Service.getCUIT(cuit, token, sign, documento)
          )
        );
        res.json(allInfo);
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Se produjo un error desconocido" });
    }
  }
});

export default router;
