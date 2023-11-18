// services/wsfe/FECAEAInformar.ts
import * as soap from "soap";

export class FECAEAInformar {
  private wsfeWSDL: string;

  constructor(wsfeWSDL: string) {
    this.wsfeWSDL = wsfeWSDL;
  }

  async informarCAEA(
    cuit: string,
    token: string,
    sign: string,
    PtoVta: number,
    CbteTipo: number,
    Periodo: number,
    Orden: number
  ): Promise<any> {
    const soapClient = await soap.createClientAsync(this.wsfeWSDL);
    const requestBody = {
      Auth: { Token: token, Sign: sign, Cuit: cuit },
      FeCAEARegInfReq: {
        PtoVta: PtoVta,
        CbteTipo: CbteTipo,
        Periodo: Periodo,
        Orden: Orden,
      },
    };

    try {
      const response = await soapClient.FECAEAInformarAsync(requestBody);
      return response[0].FECAEAInformarResult;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error en FECAEAInformar: ${error.message}`);
      } else {
        throw new Error("Error desconocido en FECAEAInformar");
      }
    }
  }
}
