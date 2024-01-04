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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FECAESolicitar = void 0;
// services/wsfe/FECAESolicitar.ts
const soap = __importStar(require("soap"));
class FECAESolicitar {
    constructor(wsfeWSDL) {
        this.wsfeWSDL = wsfeWSDL;
    }
    solicitarCAE(cuit, token, sign, invoiceData) {
        return __awaiter(this, void 0, void 0, function* () {
            const soapClient = yield soap.createClientAsync(this.wsfeWSDL);
            let formattedInvoiceData = Object.assign(Object.assign({}, invoiceData), { ImpTotal: invoiceData.ImpTotal.toString(), ImpTotConc: invoiceData.ImpTotConc.toString(), ImpNeto: invoiceData.ImpNeto.toString(), ImpOpEx: invoiceData.ImpOpEx.toString(), ImpTrib: invoiceData.ImpTrib.toString(), ImpIVA: invoiceData.ImpIVA.toString(), Iva: invoiceData.Iva ? { AlicIva: invoiceData.Iva } : undefined, Tributos: invoiceData.Tributos
                    ? { Tributo: invoiceData.Tributos }
                    : undefined, CbtesAsoc: invoiceData.CbtesAsoc
                    ? { CbteAsoc: invoiceData.CbtesAsoc }
                    : undefined, Compradores: invoiceData.Compradores
                    ? { Comprador: invoiceData.Compradores }
                    : undefined, Opcionales: invoiceData.Opcionales
                    ? { Opcional: invoiceData.Opcionales }
                    : undefined });
            delete formattedInvoiceData.CantReg;
            delete formattedInvoiceData.PtoVta;
            delete formattedInvoiceData.CbteTipo;
            const requestBody = {
                Auth: { Token: token, Sign: sign, Cuit: cuit },
                FeCAEReq: {
                    FeCabReq: {
                        CantReg: 1,
                        PtoVta: invoiceData.PtoVta,
                        CbteTipo: invoiceData.CbteTipo,
                    },
                    FeDetReq: {
                        FECAEDetRequest: [formattedInvoiceData],
                    },
                },
            };
            try {
                const response = yield soapClient.FECAESolicitarAsync(requestBody);
                console.log("RESPONSE COMPLETA de creación de factura:", response[0].FECAESolicitarResult.Observaciones.Obs);
                if (response[0].FECAESolicitarResult.Resultado === "R") {
                    console.log(response[0].FECAESolicitarResult[0].Observaciones.Obs);
                }
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
exports.FECAESolicitar = FECAESolicitar;
