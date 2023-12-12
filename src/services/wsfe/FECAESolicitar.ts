// services/wsfe/FECAESolicitar.ts
import * as soap from "soap";

export class FECAESolicitar {
  private wsfeWSDL: string;

  constructor(wsfeWSDL: string) {
    this.wsfeWSDL = wsfeWSDL;
  }

  async solicitarCAE(
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
        response[0].FECAESolicitarResult.Observaciones.Obs
      );
      if (response[0].FECAESolicitarResult.Resultado === "R") {
        console.log(response[0].FECAESolicitarResult[0].Observaciones.Obs);
      }
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
