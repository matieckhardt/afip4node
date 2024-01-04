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
exports.FEParamGetPtosVenta = void 0;
// services/wsfe/FECompUltimoAutorizado.ts
const soap = __importStar(require("soap"));
class FEParamGetPtosVenta {
    constructor(wsfeWSDL) {
        this.wsfeWSDL = wsfeWSDL;
    }
    getSalesPoints(cuit, token, sign) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create a SOAP client using wsfeWSDL
            const soapClient = yield soap.createClientAsync(this.wsfeWSDL);
            // Build the request body according to the WSFE service specification
            const requestBody = {
                Auth: { Token: token, Sign: sign, Cuit: cuit },
            };
            try {
                // Perform the SOAP call to the WSFE service
                const response = yield soapClient.FEParamGetPtosVentaAsync({
                    Auth: requestBody.Auth,
                });
                // Check for errors in the response
                const result = response[0].FEParamGetPtosVentaResult;
                if (result.Errors) {
                    // Handle the error scenario
                    const errors = result.Errors.Err;
                    throw new Error(`Error response from AFIP: ${JSON.stringify(errors)}`);
                }
                // If no errors, process the successful response
                const parsedResponse = result.ResultGet;
                return parsedResponse;
            }
            catch (error) {
                console.error("SOAP Service Error:", error);
                throw new Error(`Error al obtener puntos de venta: ${error instanceof Error ? error.message : "Unknown Error"}`);
            }
        });
    }
}
exports.FEParamGetPtosVenta = FEParamGetPtosVenta;
