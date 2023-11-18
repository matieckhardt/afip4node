// services/wsfe/FECAEAConsultar.ts
import * as soap from "soap";

export class FECAEAConsultarService {
  private wsfeWSDL: string;

  constructor(wsfeWSDL: string) {
    this.wsfeWSDL = wsfeWSDL;
  }

  async consultarCAEA(
    cuit: string,
    token: string,
    sign: string,
    PtoVta: number,
    Periodo: number,
    Orden: number
  ): Promise<any> {
    const soapClient = await soap.createClientAsync(this.wsfeWSDL);
    const requestBody = {
      Auth: { Token: token, Sign: sign, Cuit: cuit },
      PtoVta: PtoVta,
      Periodo: Periodo,
      Orden: Orden,
    };

    try {
      const response = await soapClient.FECAEAConsultarAsync(requestBody);
      return response[0].FECAEAConsultarResult; // Ajusta según la estructura de la respuesta de AFIP
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error en FECAEAInformar: ${error.message}`);
      } else {
        throw new Error("Error desconocido en FECAEAInformar");
      }
    }
  }
}
