"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AfipAuthWSFE_1 = require("../services/auth/AfipAuthWSFE");
const AfipAuthWSA13_1 = require("../services/auth/AfipAuthWSA13");
const AfipAuthWSA5_1 = require("../services/auth/AfipAuthWSA5");
const services_1 = require("../services");
const wsa13_1 = require("../services/wsa13");
const wsa5_1 = require("../services/wsa5");
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const upload = (0, multer_1.default)();
const routeCerts = path_1.default.resolve(__dirname, "certs"); // Adjust the path as needed
const router = express_1.default.Router();
const afipAuth = new AfipAuthWSFE_1.AfipAuth("./src/certs/privateKey.pem", "./src/certs/cert.pem", false);
const afipAuthWSA13 = new AfipAuthWSA13_1.AfipAuthWSA13("./src/certs/privateKey.pem", "./src/certs/cert.pem", false);
const afipAuthWSA5 = new AfipAuthWSA5_1.AfipAuthWSA5("./src/certs/privateKey.pem", "./src/certs/cert.pem", false);
const wsfeService = new services_1.WsfeService(afipAuth);
const wsa13Service = new wsa13_1.Wsa13Service(afipAuthWSA13);
const wsa5Service = new wsa5_1.Wsa5Service(afipAuthWSA5);
// Aquí van todas tus rutas relacionadas con AFIP
// Por ejemplo:
router.get("/afip", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const service = req.query.service;
        const cuit = req.query.cuit; // Reemplaza esto con el CUIT real que necesitas usar
        const { token, sign } = yield afipAuth.getAuthToken(cuit, service);
        if (!token || !sign) {
            return res.status(500).json({ error: Error });
        }
        res.json({ token, sign });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "Se produjo un error desconocido" });
        }
    }
}));
router.get("/afip/last-voucher", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cuit = req.query.cuit;
        const service = "wsfe";
        const salesPoint = req.query.salesPoint;
        const invoiceType = req.query.invoiceType;
        // Asegúrate de que todos los parámetros son strings
        if (typeof cuit !== "string" ||
            typeof salesPoint !== "string" ||
            typeof invoiceType !== "string") {
            return res.status(400).json({ error: "Parámetros inválidos" });
        }
        const { token, sign } = yield afipAuth.getAuthToken(cuit, service);
        const FECompUltimoAutorizado = yield wsfeService.getLastVoucher(token, sign, cuit, salesPoint, invoiceType, service);
        // Devuelve el resultado (ajusta esto según lo que necesites)
        res.json(FECompUltimoAutorizado);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "Se produjo un error desconocido" });
        }
    }
}));
router.get("/afip/sales-point", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cuit = process.env.CUIT;
        const service = process.env.SERVICE;
        // Asegúrate de que todos los parámetros son strings
        if (typeof cuit !== "string" || typeof service !== "string") {
            return res.status(400).json({ error: "Parámetros inválidos" });
        }
        const { token, sign } = yield afipAuth.getAuthToken(cuit, service);
        const FEParamGetPtosVenta = yield wsfeService.getSalesPoints(cuit, token, sign, service);
        res.json(FEParamGetPtosVenta);
    }
    catch (error) {
        console.error("Route Error:", error);
        res.status(500).json({
            error: error instanceof Error ? error.message : "Unknown error occurred",
        });
    }
}));
router.get("/afip/tiposCbte", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cuit = req.query.cuit;
        const service = req.query.service;
        const salesPoint = req.query.salesPoint;
        const invoiceType = req.query.invoiceType;
        // Asegúrate de que todos los parámetros son strings
        if (typeof cuit !== "string" ||
            typeof service !== "string" ||
            typeof salesPoint !== "string" ||
            typeof invoiceType !== "string") {
            return res.status(400).json({ error: "Parámetros inválidos" });
        }
        const { token, sign } = yield afipAuth.getAuthToken(cuit, service);
        const FEParamGetTiposCbte = yield wsfeService.getTiposCbte(cuit, token, sign, salesPoint, invoiceType, service);
        // Devuelve el resultado (ajusta esto según lo que necesites)
        res.json(FEParamGetTiposCbte);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "Se produjo un error desconocido" });
        }
    }
}));
router.get("/afip/tiposDoc", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cuit = req.query.cuit;
        const service = req.query.service;
        const salesPoint = req.query.salesPoint;
        const invoiceType = req.query.invoiceType;
        // Asegúrate de que todos los parámetros son strings
        if (typeof cuit !== "string" ||
            typeof service !== "string" ||
            typeof salesPoint !== "string" ||
            typeof invoiceType !== "string") {
            return res.status(400).json({ error: "Parámetros inválidos" });
        }
        const { token, sign } = yield afipAuth.getAuthToken(cuit, service);
        const FEParamGetTiposDoc = yield wsfeService.getTiposDoc(cuit, token, sign);
        // Devuelve el resultado (ajusta esto según lo que necesites)
        res.json(FEParamGetTiposDoc);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "Se produjo un error desconocido" });
        }
    }
}));
router.get("/afip/tiposConc", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cuit = req.query.cuit;
        const service = req.query.service;
        const salesPoint = req.query.salesPoint;
        const invoiceType = req.query.invoiceType;
        // Asegúrate de que todos los parámetros son strings
        if (typeof cuit !== "string" ||
            typeof service !== "string" ||
            typeof salesPoint !== "string" ||
            typeof invoiceType !== "string") {
            return res.status(400).json({ error: "Parámetros inválidos" });
        }
        const { token, sign } = yield afipAuth.getAuthToken(cuit, service);
        const FEParamGetTiposConcepto = yield wsfeService.getTiposConcepto(cuit, token, sign);
        // Devuelve el resultado (ajusta esto según lo que necesites)
        res.json(FEParamGetTiposConcepto);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "Se produjo un error desconocido" });
        }
    }
}));
router.get("/afip/tiposIva", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cuit = req.query.cuit;
        const service = req.query.service;
        const salesPoint = req.query.salesPoint;
        const invoiceType = req.query.invoiceType;
        // Asegúrate de que todos los parámetros son strings
        if (typeof cuit !== "string" ||
            typeof service !== "string" ||
            typeof salesPoint !== "string" ||
            typeof invoiceType !== "string") {
            return res.status(400).json({ error: "Parámetros inválidos" });
        }
        const { token, sign } = yield afipAuth.getAuthToken(cuit, service);
        const FEParamGetTiposIva = yield wsfeService.getTiposIva(cuit, token, sign);
        // Devuelve el resultado (ajusta esto según lo que necesites)
        res.json(FEParamGetTiposIva);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "Se produjo un error desconocido" });
        }
    }
}));
router.get("/afip/tiposMonedas", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cuit = req.query.cuit;
        const service = req.query.service;
        const salesPoint = req.query.salesPoint;
        const invoiceType = req.query.invoiceType;
        // Asegúrate de que todos los parámetros son strings
        if (typeof cuit !== "string" ||
            typeof service !== "string" ||
            typeof salesPoint !== "string" ||
            typeof invoiceType !== "string") {
            return res.status(400).json({ error: "Parámetros inválidos" });
        }
        const { token, sign } = yield afipAuth.getAuthToken(cuit, service);
        const FEParamGetTiposMonedas = yield wsfeService.getTiposMonedas(cuit, token, sign);
        // Devuelve el resultado (ajusta esto según lo que necesites)
        res.json(FEParamGetTiposMonedas);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "Se produjo un error desconocido" });
        }
    }
}));
router.get("/afip/tiposOpcionales", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cuit = req.query.cuit;
        const service = req.query.service;
        const salesPoint = req.query.salesPoint;
        const invoiceType = req.query.invoiceType;
        // Asegúrate de que todos los parámetros son strings
        if (typeof cuit !== "string" ||
            typeof service !== "string" ||
            typeof salesPoint !== "string" ||
            typeof invoiceType !== "string") {
            return res.status(400).json({ error: "Parámetros inválidos" });
        }
        const { token, sign } = yield afipAuth.getAuthToken(cuit, service);
        const FEParamGetTiposOpcionales = yield wsfeService.getTiposOpcionales(cuit, token, sign);
        // Devuelve el resultado (ajusta esto según lo que necesites)
        res.json(FEParamGetTiposOpcionales);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "Se produjo un error desconocido" });
        }
    }
}));
router.get("/afip/server-status", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cuit = req.query.cuit;
        const service = "wsfe"; // O el servicio correspondiente
        const { token, sign } = yield afipAuth.getAuthToken(cuit, service);
        if (!token || !sign) {
            return res
                .status(500)
                .json({ error: "No se pudo obtener el token o la firma" });
        }
        const serverStatus = yield wsfeService.checkServerStatus();
        res.json(serverStatus);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "Se produjo un error desconocido" });
        }
    }
}));
router.post("/afip/create-invoice", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { token, sign } = yield afipAuth.getAuthToken(cuit, service);
        if (!token || !sign) {
            return res
                .status(500)
                .json({ error: "No se pudo obtener el token o la firma" });
        }
        const FECompUltimoAutorizado = yield wsfeService.getLastVoucher(token, sign, cuit, salesPoint, invoiceType, service);
        console.log("ultimo autorizado create", FECompUltimoAutorizado.CbteNro);
        const invoiceData = req.body;
        invoiceData.CbteDesde = FECompUltimoAutorizado.CbteNro + 1;
        invoiceData.CbteHasta = FECompUltimoAutorizado.CbteNro + 1;
        console.log("invoice Data", invoiceData);
        const invoiceResponse = yield wsfeService.createInvoice(cuit, token, sign, invoiceData);
        res.json(invoiceResponse);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res
                .status(500)
                .json({ error: "Se produjo un error desconocido creando la factura" });
        }
    }
}));
router.post("/afip/save-cert", upload.any(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cert, key } = req.body;
    try {
        // Define the paths for the certificate and key
        const certificatesDir = path_1.default.join(__dirname, "../certs");
        const certPath = path_1.default.join(certificatesDir, "cert");
        const keyPath = path_1.default.join(certificatesDir, "key");
        // Check if the certificates directory exists, create it if not
        if (!fs_1.default.existsSync(certificatesDir)) {
            fs_1.default.mkdirSync(certificatesDir, { recursive: true });
        }
        // Save the cert and key in the certificates folder
        fs_1.default.writeFileSync(certPath, cert, "utf8");
        fs_1.default.writeFileSync(keyPath, key, "utf8");
        console.log(`Files saved: ${certPath}, ${keyPath}`);
        res.send("Received and saved the cert and key");
    }
    catch (error) {
        console.error("Error saving files:", error);
        res.status(500).send("Error saving the cert and key");
    }
}));
router.get("/afip/tiposPaises", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cuit = req.query.cuit;
        const service = req.query.service;
        if (!cuit || !service) {
            return res
                .status(400)
                .json({ error: "Faltan parámetros requeridos: cuit y service" });
        }
        const { token, sign } = yield afipAuth.getAuthToken(cuit, service);
        if (!token || !sign) {
            return res
                .status(500)
                .json({ error: "No se pudo obtener el token o la firma" });
        }
        const tiposPaises = yield wsfeService.getTiposPaises(cuit, token, sign);
        res.json(tiposPaises);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "Se produjo un error desconocido" });
        }
    }
}));
router.get("/afip/tiposTributos", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cuit = req.query.cuit;
        const service = req.query.service;
        if (!cuit || !service) {
            return res
                .status(400)
                .json({ error: "Faltan parámetros requeridos: cuit y service" });
        }
        const { token, sign } = yield afipAuth.getAuthToken(cuit, service);
        if (!token || !sign) {
            return res
                .status(500)
                .json({ error: "No se pudo obtener el token o la firma" });
        }
        const tiposPaises = yield wsfeService.getTiposTributos(cuit, token, sign);
        res.json(tiposPaises);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "Se produjo un error desconocido" });
        }
    }
}));
router.post("/afip/caea-consultar", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cuit = req.body.cuit;
        const service = req.body.service;
        const PtoVta = req.body.PtoVta;
        const Periodo = req.body.Periodo;
        const Orden = req.body.Orden;
        if (!cuit ||
            !service ||
            PtoVta === undefined ||
            Periodo === undefined ||
            Orden === undefined) {
            return res.status(400).json({
                error: "Faltan parámetros requeridos en el cuerpo de la solicitud",
            });
        }
        const { token, sign } = yield afipAuth.getAuthToken(cuit, service);
        if (!token || !sign) {
            return res
                .status(500)
                .json({ error: "No se pudo obtener el token o la firma" });
        }
        const consultaCAEA = yield wsfeService.FECAEAConsultar(cuit, token, sign, PtoVta, Periodo, Orden);
        res.json(consultaCAEA);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "Se produjo un error desconocido" });
        }
    }
}));
router.get("/afip/persona", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const documento = req.query.documento;
        const cuit = req.query.cuit;
        const { token, sign } = yield afipAuthWSA13.getAuthToken(cuit, "ws_sr_padron_a13");
        if (documento.length === 11) {
            const cuitInfo = yield wsa13Service.getCUIT(cuit, token, sign, documento);
            res.json(cuitInfo);
        }
        else {
            const cuitList = yield wsa13Service.getDNI(cuit, token, sign, documento);
            if (cuitList.length === 1) {
                const personaInfo = yield wsa13Service.getCUIT(cuit, token, sign, cuitList[0]);
                res.json(personaInfo);
            }
            else {
                const allInfo = yield Promise.all(cuitList.map((documento) => __awaiter(void 0, void 0, void 0, function* () { return yield wsa13Service.getCUIT(cuit, token, sign, documento); })));
                res.json(allInfo);
            }
        }
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "Se produjo un error desconocido" });
        }
    }
}));
router.get("/afip/constancia", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const documento = req.query.documento;
        const cuitRepresentante = req.query.cuit;
        let cuitPersonas; // Array para almacenar uno o más CUITs
        // Si el documento es un DNI (menos de 11 caracteres), buscar el CUIT correspondiente
        if (documento.length < 11) {
            const { token, sign } = yield afipAuthWSA13.getAuthToken(cuitRepresentante, "ws_sr_padron_a13");
            cuitPersonas = yield wsa13Service.getDNI(cuitRepresentante, token, sign, documento);
            if (cuitPersonas.length === 0) {
                return res
                    .status(404)
                    .json({ error: "CUIT no encontrado para el DNI proporcionado" });
            }
        }
        else {
            // Si el documento ya es un CUIT
            cuitPersonas = [documento];
        }
        // Obtener el token para el servicio de constancia de inscripción
        const { token: tokenConstancia, sign: signConstancia } = yield afipAuthWSA5.getAuthToken(cuitRepresentante, "ws_sr_constancia_inscripcion");
        // Consultar la constancia de inscripción para cada CUIT
        const afipData = yield Promise.all(cuitPersonas.map((cuitPersona) => __awaiter(void 0, void 0, void 0, function* () {
            return yield wsa5Service.getCUIT(cuitRepresentante, tokenConstancia, signConstancia, cuitPersona);
        })));
        const constancias = afipData.map((data) => {
            var _a, _b;
            let categoria = "IVA Exento";
            if (data.categoriaAutonomo) {
                categoria = "IVA Responsable Inscripto";
            }
            else if (data.datosMonotributo) {
                categoria = "IVA Responsable Monotributo";
            }
            const setTaxCategory = (impuestos) => {
                if (!impuestos) {
                    return "Consumidor Final";
                }
                const codigosBuscados = [30, 32];
                const categoriaEncontrada = impuestos.find((impuesto) => codigosBuscados.includes(impuesto.idImpuesto));
                return categoriaEncontrada
                    ? categoriaEncontrada.descripcionImpuesto === "IVA"
                        ? "IVA Responsable Inscripto"
                        : categoriaEncontrada.descripcionImpuesto === "IVA EXENTO"
                            ? "IVA Exento"
                            : "Consumidor Final"
                    : "Consumidor Final"; // Add a default value here
            };
            return {
                nombre: data.datosGenerales.nombre,
                apellido: data.datosGenerales.apellido,
                direccion: data.datosGenerales.domicilioFiscal.direccion,
                localidad: data.datosGenerales.domicilioFiscal.localidad,
                codPostal: data.datosGenerales.domicilioFiscal.codPostal,
                provincia: data.datosGenerales.domicilioFiscal.descripcionProvincia,
                tipoClave: data.datosGenerales.tipoClave,
                tipoPersona: data.datosGenerales.tipoPersona,
                idPersona: data.datosGenerales.idPersona,
                razonSocial: (_a = data.datosGenerales) === null || _a === void 0 ? void 0 : _a.razonSocial,
                impuesto: data.datosMonotributo
                    ? "IVA Responsable Monotributo"
                    : setTaxCategory((_b = data.datosRegimenGeneral) === null || _b === void 0 ? void 0 : _b.impuesto),
            };
        });
        console.log(afipData[0]);
        console.log(constancias);
        res.json(constancias[0]);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: "Se produjo un error desconocido" });
        }
    }
}));
exports.default = router;
