// services/wsfe/FECAEASinMovimientoInformar.ts
import * as soap from "soap";

export class FECAEASinMovimientoInformar {
  private wsfeWSDL: string;

  constructor(wsfeWSDL: string) {
    this.wsfeWSDL = wsfeWSDL;
  }

  async informarSinMovimiento(
    cuit: string,
    token: string,
    sign: string,
    CAEA: string,
    PtoVta: number
  ): Promise<any> {
    const soapClient = await soap.createClientAsync(this.wsfeWSDL);
    const requestBody = {
      Auth: { Token: token, Sign: sign, Cuit: cuit },
      CAEA: CAEA,
      PtoVta: PtoVta,
    };

    try {
      const response = await soapClient.FECAEASinMovimientoInformarAsync(
        requestBody
      );
      return response[0].FECAEASinMovimientoInformarResult;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Error en FECAEASinMovimientoInformar: ${error.message}`
        );
      } else {
        throw new Error("Error desconocido en FECAEASinMovimientoInformar");
      }
    }
  }
}
