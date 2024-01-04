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
exports.Wsa5Service = void 0;
const path_1 = __importDefault(require("path"));
const getIdPersonaListByDocumento5_1 = require("./getIdPersonaListByDocumento5");
const getPersona5_1 = require("./getPersona5");
class Wsa5Service {
    constructor(afipAuth) {
        this.afipAuth = afipAuth;
        this.wsA5WSDL = path_1.default.resolve(__dirname, "../../wsdl/ws_sr_padron_a5.wsdl");
        this.getIdPersonaService = new getIdPersonaListByDocumento5_1.GetIdPersonaListByDocumento(this.wsA5WSDL);
        this.getPersonaService = new getPersona5_1.GetPersona(this.wsA5WSDL);
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
exports.Wsa5Service = Wsa5Service;
