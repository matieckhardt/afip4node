import { AfipAuth } from "./wsaa";
import * as forge from "node-forge";
import * as soap from "soap";
import fs from "fs";
import path from "path";
import * as xml2js from "xml2js";
const isProduction = "production";

import { FEDummyService } from "./wsfe/FEDummy";
import { FECompUltimoAutorizado } from "./wsfe/FECompUltimoAutorizado"; // Asegúrate de que la ruta sea correcta
import { FEParamGetPtosVenta } from "./wsfe/FEParamGetPtosVenta"; // Asegúrate de que la ruta sea correcta
import { FEParamGetTiposCbte } from "./wsfe/FEParamGetTiposCbte"; // Asegúrate de que la ruta sea correcta
import { FEParamGetTiposDoc } from "./wsfe/FEParamGetTiposDoc"; // Asegúrate de que la ruta sea correcta
import { FEParamGetTiposConcepto } from "./wsfe/FEParamGetTiposConcepto"; // Asegúrate de que la ruta sea correcta
import { FEParamGetTiposIva } from "./wsfe/FEParamGetTiposIva"; // Asegúrate de que la ruta sea correcta
import { FEParamGetTiposMonedas } from "./wsfe/FEParamGetTiposMonedas"; // Asegúrate de que la ruta sea correcta
import { FEParamGetTiposOpcionales } from "./wsfe/FEParamGetTiposOpcionales"; // Asegúrate de que la ruta sea correcta
import { FEParamGetTiposPaises } from "./wsfe/FEParamGetTiposPaises"; // Asegúrate de que la ruta sea correcta
import { FEParamGetTiposTributos } from "./wsfe/FEParamGetTiposTributos"; // Asegúrate de que la ruta sea correcta

export class WsfeService {
  private afipAuth: AfipAuth;
  private wsfeWSDL: string;
  private dummyService: FEDummyService;
  private ultimoAutorizadoService: FECompUltimoAutorizado;
  private ptosVetaDisponibles: FEParamGetPtosVenta;
  private TiposCbte: FEParamGetTiposCbte;
  private TiposDoc: FEParamGetTiposDoc;
  private TiposConc: FEParamGetTiposConcepto;
  private TiposIva: FEParamGetTiposIva;
  private TiposMonedas: FEParamGetTiposMonedas;
  private TiposOpcionales: FEParamGetTiposOpcionales;

  constructor(afipAuth: AfipAuth) {
    this.afipAuth = afipAuth;
    this.wsfeWSDL = path.resolve(__dirname, "../wsdl/wsfe-production.wsdl"); // Ajusta la ruta según sea necesario
    this.dummyService = new FEDummyService(this.wsfeWSDL);
    this.ultimoAutorizadoService = new FECompUltimoAutorizado(this.wsfeWSDL);
    this.ptosVetaDisponibles = new FEParamGetPtosVenta(this.wsfeWSDL);
    this.TiposCbte = new FEParamGetTiposCbte(this.wsfeWSDL);
    this.TiposDoc = new FEParamGetTiposDoc(this.wsfeWSDL);
    this.TiposConc = new FEParamGetTiposConcepto(this.wsfeWSDL);
    this.TiposIva = new FEParamGetTiposIva(this.wsfeWSDL);
    this.TiposMonedas = new FEParamGetTiposMonedas(this.wsfeWSDL);
    this.TiposOpcionales = new FEParamGetTiposOpcionales(this.wsfeWSDL);
  }

  async getLastVoucher(
    cuit: string,
    token: string,
    sign: string,
    salesPoint: string,
    invoiceType: string,
    service: string
  ): Promise<any> {
    return this.ultimoAutorizadoService.getLastVoucher(
      cuit,
      token,
      sign,
      salesPoint,
      invoiceType,
      service
    );
  }

  async getSalesPoints(
    cuit: string,
    token: string,
    sign: string,
    salesPoint: string,
    invoiceType: string,
    service: string
  ): Promise<any> {
    return this.ptosVetaDisponibles.getSalesPoints(cuit, token, sign);
  }

  async getTiposCbte(
    cuit: string,
    token: string,
    sign: string,
    salesPoint: string,
    invoiceType: string,
    service: string
  ): Promise<any> {
    return this.TiposCbte.getTiposCbte(cuit, token, sign);
  }
  async getTiposDoc(cuit: string, token: string, sign: string): Promise<any> {
    return this.TiposDoc.getTiposDoc(cuit, token, sign);
  }
  async checkServerStatus(): Promise<any> {
    const certPath = "./src/certs/cert";
    const keyPath = "./src/certs/key";

    return this.dummyService.checkServerStatus();
  }

  async getTiposConcepto(
    cuit: string,
    token: string,
    sign: string
  ): Promise<any> {
    return this.TiposConc.getTiposConcepto(cuit, token, sign);
  }

  async getTiposIva(cuit: string, token: string, sign: string): Promise<any> {
    return this.TiposIva.getTiposIva(cuit, token, sign);
  }

  async getTiposMonedas(
    cuit: string,
    token: string,
    sign: string
  ): Promise<any> {
    return this.TiposMonedas.getTiposMonedas(cuit, token, sign);
  }
  async getTiposOpcionales(
    cuit: string,
    token: string,
    sign: string
  ): Promise<any> {
    return this.TiposOpcionales.getTiposOpcionales(cuit, token, sign);
  }

  async createInvoice(
    cuit: string,
    token: string,
    sign: string,
    invoiceData: any
  ): Promise<any> {
    const soapClient = await soap.createClientAsync(this.wsfeWSDL);

    let formattedInvoiceData = {
      ...invoiceData,
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
}
