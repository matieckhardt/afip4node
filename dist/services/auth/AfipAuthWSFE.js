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
exports.AfipAuth = void 0;
const forge = __importStar(require("node-forge"));
const soap = __importStar(require("soap"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const xml2js = __importStar(require("xml2js"));
const isProduction = "production";
require("dotenv").config();
const certificate = fs_1.default.readFileSync(path_1.default.resolve("./src/certs/cert"), "utf8");
const privateKey = fs_1.default.readFileSync(path_1.default.resolve("./src/certs/key"), "utf8");
class AfipAuth {
    constructor(privateKeyPath, certPath, production) {
        this.wsaaWSDL = path_1.default.resolve(__dirname, "../../certs/wsaa.wsdl");
        this.wsaaUrl = isProduction;
        (this.certificate = certificate),
            (this.privateKey = privateKey),
            (this.wsaaUrl =
                process.env.WSAAURL || "https://wsaahomo.afip.gov.ar/ws/services/LoginCms");
    }
    getAuthToken(cuit, service) {
        return __awaiter(this, void 0, void 0, function* () {
            const taFileName = `TA-WSFE-${cuit}.json`;
            const taPath = path_1.default.resolve(__dirname, `../../certs/${taFileName}`);
            // Primero intenta leer un TA existente
            const existingTA = this.readTA(taPath);
            if (existingTA && this.isTAValid(existingTA)) {
                // Si el TA existente es válido, devuélvelo
                return existingTA;
            }
            try {
                // Si no hay TA existente o está vencido, crea uno nuevo
                const tra = this.createTRA(service);
                const signedTRA = this.signTRA(tra);
                const newTA = yield this.sendTRA(signedTRA);
                // Guardar el nuevo TA
                this.saveTA(newTA, taPath);
                return newTA;
            }
            catch (error) {
                console.error("Error al obtener el token de autenticación:", error);
                throw error; // Propagar el error para un manejo externo
            }
        });
    }
    saveTA(ta, taPath) {
        fs_1.default.writeFileSync(taPath, JSON.stringify(ta, null, 2));
    }
    readTA(taPath) {
        try {
            if (fs_1.default.existsSync(taPath)) {
                const taData = fs_1.default.readFileSync(taPath, "utf8");
                return JSON.parse(taData);
            }
            return null;
        }
        catch (error) {
            console.error("Error al leer el TA:", error);
            return null;
        }
    }
    isTAValid(ta) {
        const now = new Date();
        const expirationTime = new Date(ta.expirationTime);
        return now < expirationTime;
    }
    createTRA(service) {
        const date = new Date();
        const generationTime = new Date(date.getTime() - 600000).toISOString();
        const expirationTime = new Date(date.getTime() + 600000).toISOString();
        const uniqueId = Math.floor(date.getTime() / 1000);
        const tra = `
            <loginTicketRequest version="1.0">
                <header>
                    <uniqueId>${uniqueId}</uniqueId>
                    <generationTime>${generationTime}</generationTime>
                    <expirationTime>${expirationTime}</expirationTime>
                </header>
                <service>${service}</service>
            </loginTicketRequest>
        `.trim();
        return tra;
    }
    signTRA(tra) {
        const pki = forge.pki;
        const md = forge.md.sha1.create();
        md.update(tra, "utf8");
        const key = pki.privateKeyFromPem(this.privateKey);
        const cert = pki.certificateFromPem(this.certificate);
        const p7 = forge.pkcs7.createSignedData();
        p7.content = forge.util.createBuffer(tra, "utf8");
        p7.addCertificate(cert);
        p7.addSigner({
            key: key,
            certificate: cert,
            digestAlgorithm: forge.pki.oids.sha1,
            authenticatedAttributes: [
                {
                    type: forge.pki.oids.contentType,
                    value: forge.pki.oids.data,
                },
                {
                    type: forge.pki.oids.messageDigest,
                    // The value will be automatically filled with the hash of the content (TRA)
                },
                {
                    type: forge.pki.oids.signingTime,
                    // The value will be automatically filled with the current date/time
                },
            ],
        });
        p7.sign();
        const asn1 = forge.asn1.toDer(p7.toAsn1()).getBytes();
        // Encode the ASN.1 structure as Base64
        const base64Cms = forge.util.encode64(asn1);
        return base64Cms;
    }
    sendTRA(signedTRA) {
        return __awaiter(this, void 0, void 0, function* () {
            const soapClient = yield soap.createClientAsync(this.wsaaWSDL, {
                endpoint: this.wsaaUrl,
            });
            const result = yield soapClient.loginCmsAsync({ in0: signedTRA });
            // La respuesta viene en 'result[0].loginCmsReturn', y es una cadena XML
            const responseXml = result[0].loginCmsReturn;
            // Desencapsular y analizar la cadena XML
            const parsedResponse = yield xml2js.parseStringPromise(responseXml);
            const loginTicketResponse = parsedResponse.loginTicketResponse;
            // Extraer 'token', 'sign' y 'expirationTime'
            const token = loginTicketResponse.credentials[0].token[0];
            const sign = loginTicketResponse.credentials[0].sign[0];
            const expirationTime = loginTicketResponse.header[0].expirationTime[0];
            return { token, sign, expirationTime };
        });
    }
}
exports.AfipAuth = AfipAuth;
