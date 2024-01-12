import { AfipAuth } from "./auth/AfipAuthWSFE";
import * as soap from "soap";
import fs from "fs";
import path from "path";
import { FEDummyService } from "./wsfe/FEDummy";
import { FECompUltimoAutorizado } from "./wsfe/FECompUltimoAutorizado";
import { FEParamGetPtosVenta } from "./wsfe/FEParamGetPtosVenta";
import { FEParamGetTiposCbte } from "./wsfe/FEParamGetTiposCbte";
import { FEParamGetTiposDoc } from "./wsfe/FEParamGetTiposDoc";
import { FEParamGetTiposConcepto } from "./wsfe/FEParamGetTiposConcepto";
import { FEParamGetTiposIva } from "./wsfe/FEParamGetTiposIva";
import { FEParamGetTiposMonedas } from "./wsfe/FEParamGetTiposMonedas";
import { FEParamGetTiposOpcionales } from "./wsfe/FEParamGetTiposOpcionales";
import { FEParamGetTiposPaises } from "./wsfe/FEParamGetTiposPaises";
import { FEParamGetTiposTributos } from "./wsfe/FEParamGetTiposTributos";
import { FEParamGetCotizacion } from "./wsfe/FEParamGetCotizacion";
import { FECAEAInformar } from "./wsfe/FECAEAInformar";
import { FECAEASinMovimientoConsultar } from "./wsfe/FECAEASinMovimientoConsultar";
import { FECAEASinMovimientoInformar } from "./wsfe/FECAEASinMovimientoInformar";
import { FECAEASolicitar } from "./wsfe/FECAEASolicitar";
import { FECAESolicitar } from "./wsfe/FECAESolicitar";
import { FECompConsultar } from "./wsfe/FECompConsultar";
import { FECompTotXRequest } from "./wsfe/FECompTotXRequest";
import { FECAEAConsultarService } from "./wsfe/FECAEAConsultar"; // Asegúrate de que la ruta sea correcta

export class WsfeService {
  private afipAuth: AfipAuth;
  private wsfeWSDL: string;

  // Instancias de los servicios
  private dummyService: FEDummyService;
  private ultimoAutorizadoService: FECompUltimoAutorizado;
  private ptosVentaService: FEParamGetPtosVenta;
  private tiposCbteService: FEParamGetTiposCbte;
  private tiposDocService: FEParamGetTiposDoc;
  private tiposConceptoService: FEParamGetTiposConcepto;
  private tiposIvaService: FEParamGetTiposIva;
  private tiposMonedasService: FEParamGetTiposMonedas;
  private tiposOpcionalesService: FEParamGetTiposOpcionales;
  private tiposPaisesService: FEParamGetTiposPaises;
  private tiposTributosService: FEParamGetTiposTributos;
  private cotizacionService: FEParamGetCotizacion;
  private caeaInformarService: FECAEAInformar;
  private caeaSinMovimientoConsultarService: FECAEASinMovimientoConsultar;
  private caeaSinMovimientoInformarService: FECAEASinMovimientoInformar;
  private caeaSolicitarService: FECAEASolicitar;
  private caeSolicitarService: FECAESolicitar;
  private compConsultarService: FECompConsultar;
  private compTotXRequestService: FECompTotXRequest;
  private caeaConsultarService: FECAEAConsultarService;

  constructor(afipAuth: AfipAuth) {
    this.afipAuth = afipAuth;
    this.wsfeWSDL = path.resolve(__dirname, "../wsdl/wsfe-production.wsdl");
    this.caeaConsultarService = new FECAEAConsultarService(this.wsfeWSDL);

    this.dummyService = new FEDummyService(this.wsfeWSDL);
    this.ultimoAutorizadoService = new FECompUltimoAutorizado(this.wsfeWSDL);
    this.ptosVentaService = new FEParamGetPtosVenta(this.wsfeWSDL);
    this.tiposCbteService = new FEParamGetTiposCbte(this.wsfeWSDL);
    this.tiposDocService = new FEParamGetTiposDoc(this.wsfeWSDL);
    this.tiposConceptoService = new FEParamGetTiposConcepto(this.wsfeWSDL);
    this.tiposIvaService = new FEParamGetTiposIva(this.wsfeWSDL);
    this.tiposMonedasService = new FEParamGetTiposMonedas(this.wsfeWSDL);
    this.tiposOpcionalesService = new FEParamGetTiposOpcionales(this.wsfeWSDL);
    this.tiposPaisesService = new FEParamGetTiposPaises(this.wsfeWSDL);
    this.tiposTributosService = new FEParamGetTiposTributos(this.wsfeWSDL);
    this.cotizacionService = new FEParamGetCotizacion(this.wsfeWSDL);
    this.caeaInformarService = new FECAEAInformar(this.wsfeWSDL);
    this.caeaSinMovimientoConsultarService = new FECAEASinMovimientoConsultar(
      this.wsfeWSDL
    );
    this.caeaSinMovimientoInformarService = new FECAEASinMovimientoInformar(
      this.wsfeWSDL
    );
    this.caeaSolicitarService = new FECAEASolicitar(this.wsfeWSDL);
    this.caeSolicitarService = new FECAESolicitar(this.wsfeWSDL);
    this.compConsultarService = new FECompConsultar(this.wsfeWSDL);
    this.compTotXRequestService = new FECompTotXRequest(this.wsfeWSDL);
  }

  async FECAEAConsultar(
    cuit: string,
    token: string,
    sign: string,
    PtoVta: number,
    Periodo: number,
    Orden: number
  ): Promise<any> {
    // Llama al servicio de FECAEAConsultar
    return this.caeaConsultarService.consultarCAEA(
      cuit,
      token,
      sign,
      PtoVta,
      Periodo,
      Orden
    );
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

    service: string
  ): Promise<any> {
    return this.ptosVentaService.getSalesPoints(cuit, token, sign);
  }

  async getTiposCbte(
    cuit: string,
    token: string,
    sign: string,
    salesPoint: string,
    invoiceType: string,
    service: string
  ): Promise<any> {
    return this.tiposCbteService.getTiposCbte(cuit, token, sign);
  }

  async getTiposTributos(
    cuit: string,
    token: string,
    sign: string
  ): Promise<any> {
    return this.tiposTributosService.getTiposTributos(cuit, token, sign);
  }

  async getTiposPaises(
    cuit: string,
    token: string,
    sign: string
  ): Promise<any> {
    return this.tiposPaisesService.getTiposPaises(cuit, token, sign);
  }

  async getTiposDoc(cuit: string, token: string, sign: string): Promise<any> {
    return this.tiposDocService.getTiposDoc(cuit, token, sign);
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
    return this.tiposConceptoService.getTiposConcepto(cuit, token, sign);
  }

  async getTiposIva(cuit: string, token: string, sign: string): Promise<any> {
    return this.tiposIvaService.getTiposIva(cuit, token, sign);
  }

  async getTiposMonedas(
    cuit: string,
    token: string,
    sign: string
  ): Promise<any> {
    return this.tiposMonedasService.getTiposMonedas(cuit, token, sign);
  }
  async getTiposOpcionales(
    cuit: string,
    token: string,
    sign: string
  ): Promise<any> {
    return this.tiposOpcionalesService.getTiposOpcionales(cuit, token, sign);
  }

  async FECAEAInformar(
    cuit: string,
    token: string,
    sign: string,
    PtoVta: number,
    CbteTipo: number,
    Periodo: number,
    Orden: number
  ): Promise<any> {
    return this.caeaInformarService.informarCAEA(
      cuit,
      token,
      sign,
      PtoVta,
      CbteTipo,
      Periodo,
      Orden
    );
  }

  async FECAEASinMovimientoConsultar(
    cuit: string,
    token: string,
    sign: string,
    PtoVta: number,
    CbteTipo: number,
    Periodo: number,
    Orden: number
  ): Promise<any> {
    return this.caeaSinMovimientoConsultarService.informarCAEA(
      cuit,
      token,
      sign,
      PtoVta,
      CbteTipo,
      Periodo,
      Orden
    );
  }

  async FECAEASinMovimientoInformar(
    cuit: string,
    token: string,
    sign: string,
    CAEA: string,
    PtoVta: number
  ): Promise<any> {
    return this.caeaSinMovimientoInformarService.informarSinMovimiento(
      cuit,
      token,
      sign,
      CAEA,
      PtoVta
    );
  }

  async FECAEASolicitar(
    cuit: string,
    token: string,
    sign: string,
    periodo: number,
    orden: number
  ): Promise<any> {
    return this.caeaSolicitarService.solicitarCAEA(
      cuit,
      token,
      sign,
      periodo,
      orden
    );
  }

  async FECAESolicitar(
    cuit: string,
    token: string,
    sign: string,
    invoiceData: any
  ): Promise<any> {
    return this.caeSolicitarService.solicitarCAE(
      cuit,
      token,
      sign,
      invoiceData
    );
  }

  async FECompConsultar(
    cuit: string,
    token: string,
    sign: string,
    consultaCompData: any
  ): Promise<any> {
    return this.compConsultarService.consultarComprobante(
      cuit,
      token,
      sign,
      consultaCompData
    );
  }

  async FECompTotXRequest(
    cuit: string,
    token: string,
    sign: string
  ): Promise<any> {
    return this.compTotXRequestService.obtenerTotalXRequest(cuit, token, sign);
  }

  async FEParamGetCotizacion(
    cuit: string,
    token: string,
    sign: string,
    moneda: string
  ): Promise<any> {
    return this.cotizacionService.obtenerCotizacion(cuit, token, sign, moneda);
  }

  async createInvoice(
    cuit: string,
    token: string,
    sign: string,
    invoiceData: any
  ): Promise<any> {
    const soapClient = await soap.createClientAsync(this.wsfeWSDL);
    console.log("antes de mandar por soap", invoiceData);

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
        ? { CbtesAsoc: invoiceData.CbtesAsoc }
        : undefined,
      Compradores: invoiceData.Compradores
        ? { Comprador: invoiceData.Compradores }
        : undefined,
      Opcionales: invoiceData.Opcionales
        ? { Opcional: invoiceData.Opcionales }
        : undefined,
    };

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
      PeriodoAsoc: {
        FchDesde: invoiceData.PeriodoAsoc.CbteFch,
        FchHasta: invoiceData.PeriodoAsoc.CbteFch,
      },
      CbtesAsoc: invoiceData.CbtesAsoc,

      FchServDesde:
        invoiceData.Concepto === 2 || invoiceData.Concepto === 3
          ? invoiceData.CbteFch
          : null,
      FchServHasta:
        invoiceData.Concepto === 2 || invoiceData.Concepto === 3
          ? invoiceData.CbteFch
          : null,
      FchVtoPago:
        invoiceData.Concepto === 2 || invoiceData.Concepto === 3
          ? invoiceData.CbteFch
          : null,
    };

    //  delete formattedInvoiceData.CantReg;
    //  delete formattedInvoiceData.PtoVta;
    //  delete formattedInvoiceData.CbteTipo;
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
      console.log("dataToAuth for SOAP", dataToAuth);

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
