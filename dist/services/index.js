"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.WsfeService = void 0;
const soap = __importStar(require("soap"));
const path_1 = __importDefault(require("path"));
const FEDummy_1 = require("./wsfe/FEDummy");
const FECompUltimoAutorizado_1 = require("./wsfe/FECompUltimoAutorizado");
const FEParamGetPtosVenta_1 = require("./wsfe/FEParamGetPtosVenta");
const FEParamGetTiposCbte_1 = require("./wsfe/FEParamGetTiposCbte");
const FEParamGetTiposDoc_1 = require("./wsfe/FEParamGetTiposDoc");
const FEParamGetTiposConcepto_1 = require("./wsfe/FEParamGetTiposConcepto");
const FEParamGetTiposIva_1 = require("./wsfe/FEParamGetTiposIva");
const FEParamGetTiposMonedas_1 = require("./wsfe/FEParamGetTiposMonedas");
const FEParamGetTiposOpcionales_1 = require("./wsfe/FEParamGetTiposOpcionales");
const FEParamGetTiposPaises_1 = require("./wsfe/FEParamGetTiposPaises");
const FEParamGetTiposTributos_1 = require("./wsfe/FEParamGetTiposTributos");
const FEParamGetCotizacion_1 = require("./wsfe/FEParamGetCotizacion");
const FECAEAInformar_1 = require("./wsfe/FECAEAInformar");
const FECAEASinMovimientoConsultar_1 = require("./wsfe/FECAEASinMovimientoConsultar");
const FECAEASinMovimientoInformar_1 = require("./wsfe/FECAEASinMovimientoInformar");
const FECAEASolicitar_1 = require("./wsfe/FECAEASolicitar");
const FECAESolicitar_1 = require("./wsfe/FECAESolicitar");
const FECompConsultar_1 = require("./wsfe/FECompConsultar");
const FECompTotXRequest_1 = require("./wsfe/FECompTotXRequest");
const FECAEAConsultar_1 = require("./wsfe/FECAEAConsultar"); // Asegúrate de que la ruta sea correcta
class WsfeService {
    constructor(afipAuth) {
        this.afipAuth = afipAuth;
        this.wsfeWSDL = path_1.default.resolve(__dirname, "../wsdl/wsfe.wsdl");
        this.caeaConsultarService = new FECAEAConsultar_1.FECAEAConsultarService(this.wsfeWSDL);
        this.dummyService = new FEDummy_1.FEDummyService(this.wsfeWSDL);
        this.ultimoAutorizadoService = new FECompUltimoAutorizado_1.FECompUltimoAutorizado(this.wsfeWSDL);
        this.ptosVentaService = new FEParamGetPtosVenta_1.FEParamGetPtosVenta(this.wsfeWSDL);
        this.tiposCbteService = new FEParamGetTiposCbte_1.FEParamGetTiposCbte(this.wsfeWSDL);
        this.tiposDocService = new FEParamGetTiposDoc_1.FEParamGetTiposDoc(this.wsfeWSDL);
        this.tiposConceptoService = new FEParamGetTiposConcepto_1.FEParamGetTiposConcepto(this.wsfeWSDL);
        this.tiposIvaService = new FEParamGetTiposIva_1.FEParamGetTiposIva(this.wsfeWSDL);
        this.tiposMonedasService = new FEParamGetTiposMonedas_1.FEParamGetTiposMonedas(this.wsfeWSDL);
        this.tiposOpcionalesService = new FEParamGetTiposOpcionales_1.FEParamGetTiposOpcionales(this.wsfeWSDL);
        this.tiposPaisesService = new FEParamGetTiposPaises_1.FEParamGetTiposPaises(this.wsfeWSDL);
        this.tiposTributosService = new FEParamGetTiposTributos_1.FEParamGetTiposTributos(this.wsfeWSDL);
        this.cotizacionService = new FEParamGetCotizacion_1.FEParamGetCotizacion(this.wsfeWSDL);
        this.caeaInformarService = new FECAEAInformar_1.FECAEAInformar(this.wsfeWSDL);
        this.caeaSinMovimientoConsultarService = new FECAEASinMovimientoConsultar_1.FECAEASinMovimientoConsultar(this.wsfeWSDL);
        this.caeaSinMovimientoInformarService = new FECAEASinMovimientoInformar_1.FECAEASinMovimientoInformar(this.wsfeWSDL);
        this.caeaSolicitarService = new FECAEASolicitar_1.FECAEASolicitar(this.wsfeWSDL);
        this.caeSolicitarService = new FECAESolicitar_1.FECAESolicitar(this.wsfeWSDL);
        this.compConsultarService = new FECompConsultar_1.FECompConsultar(this.wsfeWSDL);
        this.compTotXRequestService = new FECompTotXRequest_1.FECompTotXRequest(this.wsfeWSDL);
    }
    FECAEAConsultar(cuit, token, sign, PtoVta, Periodo, Orden) {
        return __awaiter(this, void 0, void 0, function* () {
            // Llama al servicio de FECAEAConsultar
            return this.caeaConsultarService.consultarCAEA(cuit, token, sign, PtoVta, Periodo, Orden);
        });
    }
    getLastVoucher(cuit, token, sign, salesPoint, invoiceType, service) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.ultimoAutorizadoService.getLastVoucher(cuit, token, sign, salesPoint, invoiceType, service);
        });
    }
    getSalesPoints(cuit, token, sign, service) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.ptosVentaService.getSalesPoints(cuit, token, sign);
        });
    }
    getTiposCbte(cuit, token, sign, salesPoint, invoiceType, service) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tiposCbteService.getTiposCbte(cuit, token, sign);
        });
    }
    getTiposTributos(cuit, token, sign) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tiposTributosService.getTiposTributos(cuit, token, sign);
        });
    }
    getTiposPaises(cuit, token, sign) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tiposPaisesService.getTiposPaises(cuit, token, sign);
        });
    }
    getTiposDoc(cuit, token, sign) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tiposDocService.getTiposDoc(cuit, token, sign);
        });
    }
    checkServerStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            const certPath = "./src/certs/cert";
            const keyPath = "./src/certs/key";
            return this.dummyService.checkServerStatus();
        });
    }
    getTiposConcepto(cuit, token, sign) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tiposConceptoService.getTiposConcepto(cuit, token, sign);
        });
    }
    getTiposIva(cuit, token, sign) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tiposIvaService.getTiposIva(cuit, token, sign);
        });
    }
    getTiposMonedas(cuit, token, sign) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tiposMonedasService.getTiposMonedas(cuit, token, sign);
        });
    }
    getTiposOpcionales(cuit, token, sign) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.tiposOpcionalesService.getTiposOpcionales(cuit, token, sign);
        });
    }
    FECAEAInformar(cuit, token, sign, PtoVta, CbteTipo, Periodo, Orden) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.caeaInformarService.informarCAEA(cuit, token, sign, PtoVta, CbteTipo, Periodo, Orden);
        });
    }
    FECAEASinMovimientoConsultar(cuit, token, sign, PtoVta, CbteTipo, Periodo, Orden) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.caeaSinMovimientoConsultarService.informarCAEA(cuit, token, sign, PtoVta, CbteTipo, Periodo, Orden);
        });
    }
    FECAEASinMovimientoInformar(cuit, token, sign, CAEA, PtoVta) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.caeaSinMovimientoInformarService.informarSinMovimiento(cuit, token, sign, CAEA, PtoVta);
        });
    }
    FECAEASolicitar(cuit, token, sign, periodo, orden) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.caeaSolicitarService.solicitarCAEA(cuit, token, sign, periodo, orden);
        });
    }
    FECAESolicitar(cuit, token, sign, invoiceData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.caeSolicitarService.solicitarCAE(cuit, token, sign, invoiceData);
        });
    }
    FECompConsultar(cuit, token, sign, consultaCompData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.compConsultarService.consultarComprobante(cuit, token, sign, consultaCompData);
        });
    }
    FECompTotXRequest(cuit, token, sign) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.compTotXRequestService.obtenerTotalXRequest(cuit, token, sign);
        });
    }
    FEParamGetCotizacion(cuit, token, sign, moneda) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.cotizacionService.obtenerCotizacion(cuit, token, sign, moneda);
        });
    }
    createInvoice(cuit, token, sign, invoiceData) {
        return __awaiter(this, void 0, void 0, function* () {
            const soapClient = yield soap.createClientAsync(this.wsfeWSDL);
            console.log("antes de mandar por soap", invoiceData);
            let formattedInvoiceData = Object.assign(Object.assign({}, invoiceData), { ImpTotal: invoiceData.ImpTotal.toString(), ImpTotConc: invoiceData.ImpTotConc.toString(), ImpNeto: invoiceData.ImpNeto.toString(), ImpOpEx: invoiceData.ImpOpEx.toString(), ImpTrib: invoiceData.ImpTrib.toString(), ImpIVA: invoiceData.ImpIVA.toString(), Iva: invoiceData.Iva ? { AlicIva: invoiceData.Iva } : undefined, Tributos: invoiceData.Tributos
                    ? { Tributo: invoiceData.Tributos }
                    : undefined, CbtesAsoc: invoiceData.CbtesAsoc
                    ? { CbteAsoc: invoiceData.CbtesAsoc }
                    : undefined, Compradores: invoiceData.Compradores
                    ? { Comprador: invoiceData.Compradores }
                    : undefined, Opcionales: invoiceData.Opcionales
                    ? { Opcional: invoiceData.Opcionales }
                    : undefined });
            let dataToAuth = {
                CantReg: "1",
                CbteDesde: invoiceData.CbteDesde.toString(),
                CbteFch: invoiceData.CbteFch,
                CbteHasta: invoiceData.CbteHasta.toString(),
                CbteTipo: invoiceData.CbteTipo.toString(),
                Concepto: invoiceData.Concepto.toString(),
                DocNro: invoiceData.DocNro.toString(),
                DocTipo: invoiceData.DocTipo.toString(),
                ImpIVA: invoiceData.ImpIVA.toString(),
                ImpNeto: invoiceData.ImpNeto.toString(),
                ImpOpEx: invoiceData.ImpOpEx.toString(),
                ImpTotal: invoiceData.ImpTotal.toString(),
                ImpTotConc: invoiceData.ImpTotConc.toString(),
                ImpTrib: invoiceData.ImpTrib.toString(),
                Iva: invoiceData.Iva ? { AlicIva: invoiceData.Iva } : undefined,
                MonCotiz: 1,
                MonId: "PES",
                PtoVta: invoiceData.PtoVta.toString(),
                CbtesAsoc: (invoiceData === null || invoiceData === void 0 ? void 0 : invoiceData.CbtesAsoc) || null,
                FchServDesde: invoiceData.Concepto === 2 || invoiceData.Concepto === 3
                    ? invoiceData.CbteFch
                    : null,
                FchServHasta: invoiceData.Concepto === 2 || invoiceData.Concepto === 3
                    ? invoiceData.CbteFch
                    : null,
                FchVtoPago: invoiceData.Concepto === 2 || invoiceData.Concepto === 3
                    ? invoiceData.CbteFch
                    : null,
            };
            //  delete formattedInvoiceData.CantReg;
            //  delete formattedInvoiceData.PtoVta;
            //  delete formattedInvoiceData.CbteTipo;
            console.log("antes dformattedInvoiceData", dataToAuth);
            const requestBody = {
                Auth: { Token: token, Sign: sign, Cuit: cuit },
                FeCAEReq: {
                    FeCabReq: {
                        CantReg: 1,
                        PtoVta: invoiceData.PtoVta,
                        CbteTipo: invoiceData.CbteTipo,
                    },
                    FeDetReq: {
                        FECAEDetRequest: [dataToAuth],
                    },
                },
            };
            try {
                const response = yield soapClient.FECAESolicitarAsync(requestBody);
                console.log("RESPONSE COMPLETA de creación de factura:", response[0].FECAESolicitarResult);
                return response[0].FECAESolicitarResult;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Error al crear la factura: ${error.message}`);
                }
                else {
                    throw new Error(`Error al crear la factura`);
                }
            }
        });
    }
}
exports.WsfeService = WsfeService;
