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
exports.GetIdPersonaListByDocumento = void 0;
const soap = __importStar(require("soap"));
class GetIdPersonaListByDocumento {
    constructor(wsA5WSDL) {
        this.wsA5WSDL = wsA5WSDL;
    }
    getIdPersonaListByDocumento(cuit, token, sign, documento) {
        return __awaiter(this, void 0, void 0, function* () {
            const soapClient = yield soap.createClientAsync(this.wsA5WSDL);
            const requestBody = {
                token: token,
                sign: sign,
                cuitRepresentada: cuit,
                documento: documento,
            };
            try {
                const response = yield soapClient.getIdPersonaListByDocumentoAsync(requestBody);
                //      console.log(response[0].idPersonaListReturn.idPersona);
                return response[0].idPersonaListReturn.idPersona;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Error al obtener ID de Persona: ${error.message}`);
                }
                else {
                    throw new Error(`Error al obtener ID de Persona`);
                }
            }
        });
    }
}
exports.GetIdPersonaListByDocumento = GetIdPersonaListByDocumento;
