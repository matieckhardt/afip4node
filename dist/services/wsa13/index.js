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
exports.Wsa13Service = void 0;
const path_1 = __importDefault(require("path"));
const getIdPersonaListByDocumento_1 = require("./getIdPersonaListByDocumento");
const getPersona_1 = require("./getPersona");
class Wsa13Service {
    constructor(afipAuth) {
        this.afipAuth = afipAuth;
        this.wsA13WSDL = path_1.default.resolve(__dirname, "../../wsdl/ws_sr_padron_a13.wsdl");
        this.getIdPersonaService = new getIdPersonaListByDocumento_1.GetIdPersonaListByDocumento(this.wsA13WSDL);
        this.getPersonaService = new getPersona_1.GetPersona(this.wsA13WSDL);
    }
    getDNI(cuit, token, sign, documento) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getIdPersonaService.getIdPersonaListByDocumento(cuit, token, sign, documento);
        });
    }
    getCUIT(cuit, token, sign, documento) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getPersonaService.getPersona(cuit, token, sign, documento);
        });
    }
}
exports.Wsa13Service = Wsa13Service;
