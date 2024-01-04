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
exports.FECompUltimoAutorizado = void 0;
// services/wsfe/FECompUltimoAutorizado.ts
const soap = __importStar(require("soap"));
class FECompUltimoAutorizado {
    constructor(wsfeWSDL) {
        this.wsfeWSDL = wsfeWSDL;
    }
    getLastVoucher(token, sign, cuit, salesPoint, invoiceType, service) {
        return __awaiter(this, void 0, void 0, function* () {
            const soapClient = yield soap.createClientAsync(this.wsfeWSDL);
            const requestBody = {
                Auth: { Token: token, Sign: sign, Cuit: cuit },
                PtoVta: salesPoint,
                CbteTipo: invoiceType,
            };
            try {
                const response = yield soapClient.FECompUltimoAutorizadoAsync(requestBody);
                console.log("Respuesta del WSFE:", response[0].FECompUltimoAutorizadoResult.CbteNro);
                return response[0].FECompUltimoAutorizadoResult;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Error al obtener el último comprobante: ${error.message}`);
                }
                else {
                    throw new Error(`Error al obtener el último comprobante`);
                }
            }
        });
    }
}
exports.FECompUltimoAutorizado = FECompUltimoAutorizado;
