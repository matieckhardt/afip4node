// services/wsfe/FECompUltimoAutorizado.ts
import * as soap from "soap";

export class FECompUltimoAutorizado {
  private wsfeWSDL: string;

  constructor(wsfeWSDL: string) {
    this.wsfeWSDL = wsfeWSDL;
  }

  async getLastVoucher(
    token: string,
    sign: string,
    cuit: string,
    salesPoint: string,
    invoiceType: string,
    service: string
  ): Promise<any> {
    const soapClient = await soap.createClientAsync(this.wsfeWSDL);
    const requestBody = {
      Auth: { Token: token, Sign: sign, Cuit: cuit },
      PtoVta: salesPoint,
      CbteTipo: invoiceType,
    };

    try {
      const response = await soapClient.FECompUltimoAutorizadoAsync(
        requestBody
      );
      console.log(
        "Respuesta del WSFE:",
        response[0].FECompUltimoAutorizadoResult.CbteNro
      );
      return response[0].FECompUltimoAutorizadoResult;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Error al obtener el último comprobante: ${error.message}`
        );
      } else {
        throw new Error(`Error al obtener el último comprobante`);
      }
    }
  }
}
