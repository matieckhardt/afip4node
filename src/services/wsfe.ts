import { AfipAuth } from "./wsaa";
import * as forge from "node-forge";
import * as soap from "soap";
import fs from "fs";
import path from "path";
import * as xml2js from "xml2js";
const isProduction = "production";

export class WsfeService {
  private afipAuth: AfipAuth;
  private wsfeWSDL: string;

  constructor(afipAuth: AfipAuth) {
    this.afipAuth = afipAuth;
    this.wsfeWSDL = path.resolve(__dirname, "../wsdl/wsfe-production.wsdl"); // Ajusta la ruta según sea necesario
  }

  async getLastVoucher(
    salesPoint: string,
    invoiceType: string,
    cuit: string,
    token: string,
    sign: string,
    service: string
  ): Promise<any> {
    // Crear un cliente SOAP utilizando wsfeWSDL
    const soapClient = await soap.createClientAsync(this.wsfeWSDL);

    // Construir el cuerpo de la solicitud según la especificación del servicio WSFE
    const requestBody = {
      Auth: { Token: token, Sign: sign, Cuit: cuit },
      PtoVta: salesPoint,
      CbteTipo: invoiceType,
    };

    try {
      // Realizar la llamada SOAP al servicio WSFE
      const response = await soapClient.FECompUltimoAutorizadoAsync(
        requestBody
      );
      console.log(
        "Respuesta del WSFE:",
        response[0].FECompUltimoAutorizadoResult.CbteNro
      );
      const parsedResponse = response[0].FECompUltimoAutorizadoResult;
      // Analizar y devolver la respuesta
      // Ajusta esta parte según la estructura real de la respuesta del WSFE

      return parsedResponse; // Ejemplo: asumiendo que los datos relevantes están en el primer elemento del array de respuesta
    } catch (error) {
      // Manejar cualquier error que ocurra durante la llamada SOAP
      if (error instanceof Error) {
        // Ahora TypeScript sabe que 'error' es de tipo Error y puedes acceder a 'error.message'
        throw new Error(
          `Error al obtener el último comprobante: ${error.message}`
        );
      } else {
        // Si no es una instancia de Error, manejarlo como un error genérico
        throw new Error(`Error al obtener el último comprobante`);
      }
    }
  }

  async getSalesPoints(
    cuit: string,
    token: string,
    sign: string
  ): Promise<any> {
    // Crear un cliente SOAP utilizando wsfeWSDL
    const soapClient = await soap.createClientAsync(this.wsfeWSDL);

    // Construir el cuerpo de la solicitud según la especificación del servicio WSFE
    const requestBody = {
      Auth: { Token: token, Sign: sign, Cuit: cuit },
    };

    try {
      // Realizar la llamada SOAP al servicio WSFE
      const response = await soapClient.FEParamGetPtosVentaAsync({
        Auth: requestBody.Auth,
      });
      console.log("Respuesta del WSFE para puntos de venta:", response);

      // Analizar y devolver la respuesta
      // La estructura de la respuesta dependerá de cómo AFIP estructura sus respuestas SOAP
      const parsedResponse = response[0].FEParamGetPtosVentaResult.ResultGet;
      return parsedResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error al obtener puntos de venta: ${error.message}`);
      } else {
        throw new Error(`Error al obtener puntos de venta`);
      }
    }
  }

  async checkServerStatus(
    cuit: string,
    token: string,
    sign: string
  ): Promise<any> {
    // Asegúrate de que las rutas al certificado y la clave sean correctas

    const cert = fs.readFileSync(path.resolve("./src/certs/cert"), "utf8");
    const key = fs.readFileSync(path.resolve("./src/certs/key"), "utf8");

    const options = {
      wsdl_options: {
        cert: cert,
        key: key,
      },
    };

    try {
      const soapClient = await soap.createClientAsync(this.wsfeWSDL, options);
      const result = await soapClient.FEDummyAsync({});
      const { AppServer, DbServer, AuthServer } = result[0].FEDummyResult;

      const afipStatus = {
        status:
          AppServer === "OK" && DbServer === "OK" && AuthServer === "OK"
            ? "Online"
            : "Offline",
      };

      console.log("AFIP Server Status", afipStatus);
      return afipStatus;
    } catch (error) {
      console.error("Error calling AFIP Server Status:", error);
      throw new Error("Error al verificar el estado del servidor AFIP");
    }
  }

  async createInvoice(
    cuit: string,
    token: string,
    sign: string,
    invoiceData: any
  ): Promise<any> {
    const soapClient = await soap.createClientAsync(this.wsfeWSDL);

    // Preparación de los datos de la factura
    let formattedInvoiceData = {
      ...invoiceData, // Copia todos los campos de invoiceData
      ImpTotal: invoiceData.ImpTotal.toString(),
      ImpTotConc: invoiceData.ImpTotConc.toString(),
      ImpNeto: invoiceData.ImpNeto.toString(),
      ImpOpEx: invoiceData.ImpOpEx.toString(),
      ImpTrib: invoiceData.ImpTrib.toString(),
      ImpIVA: invoiceData.ImpIVA.toString(),
      Iva: invoiceData.Iva ? { AlicIva: invoiceData.Iva } : undefined,
      Tributos: invoiceData.Tributos
        ? { Tributo: invoiceData.Tributos }
        : undefined,
      CbtesAsoc: invoiceData.CbtesAsoc
        ? { CbteAsoc: invoiceData.CbtesAsoc }
        : undefined,
      Compradores: invoiceData.Compradores
        ? { Comprador: invoiceData.Compradores }
        : undefined,
      Opcionales: invoiceData.Opcionales
        ? { Opcional: invoiceData.Opcionales }
        : undefined,
    };

    // Elimina los campos que ya no son necesarios en el detalle de la solicitud
    delete formattedInvoiceData.CantReg;
    delete formattedInvoiceData.PtoVta;
    delete formattedInvoiceData.CbteTipo;

    // Creación de la solicitud
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
      const response = await soapClient.FECAESolicitarAsync(requestBody);
      console.log(
        "RESPONSE COMPLETA de creación de factura:",
        response[0].FECAESolicitarResult
      );
      return response[0].FECAESolicitarResult;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error al crear la factura: ${error.message}`);
      } else {
        throw new Error(`Error al crear la factura`);
      }
    }
  }

  // Additional helper methods as needed
}
