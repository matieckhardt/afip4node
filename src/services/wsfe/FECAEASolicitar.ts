// services/wsfe/FECAEASolicitar.ts
import * as soap from "soap";

export class FECAEASolicitar {
  private wsfeWSDL: string;

  constructor(wsfeWSDL: string) {
    this.wsfeWSDL = wsfeWSDL;
  }

  async solicitarCAEA(
    cuit: string,
    token: string,
    sign: string,
    periodo: number,
    orden: number
  ): Promise<any> {
    const soapClient = await soap.createClientAsync(this.wsfeWSDL);
    const requestBody = {
      Auth: { Token: token, Sign: sign, Cuit: cuit },
      Periodo: periodo,
      Orden: orden,
    };

    try {
      const response = await soapClient.FECAEASolicitarAsync(requestBody);
      return response[0].FECAEASolicitarResult;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error en FECAEASolicitar: ${error.message}`);
      } else {
        throw new Error("Error desconocido en FECAEASolicitar");
      }
    }
  }
}
