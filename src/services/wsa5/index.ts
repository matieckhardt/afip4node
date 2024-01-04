import { AfipAuthWSA5 } from "../auth/AfipAuthWSA5";
import * as soap from "soap";
import fs from "fs";
import path from "path";
import { GetIdPersonaListByDocumento } from "./getIdPersonaListByDocumento5";
import { GetPersona } from "./getPersona5";

export class Wsa5Service {
  private afipAuth: AfipAuthWSA5;
  private wsA5WSDL: string;

  // Instancias de los servicios
  private getIdPersonaService: GetIdPersonaListByDocumento;
  private getPersonaService: GetPersona;

  constructor(afipAuth: AfipAuthWSA5) {
    this.afipAuth = afipAuth;
    this.wsA5WSDL = path.resolve(
      __dirname,
      "../../wsdl/ws_sr_padron_a5.wsdl"
    );

    this.getIdPersonaService = new GetIdPersonaListByDocumento(this.wsA5WSDL);
    this.getPersonaService = new GetPersona(this.wsA5WSDL);
  }

  async getDNI(
    cuit: string,
    token: string,
    sign: string,
    documento: string
  ): Promise<any> {
    return this.getIdPersonaService.getIdPersonaListByDocumento(
      cuit,
      token,
      sign,
      documento
    );
  }

  async getCUIT(
    cuit: string,
    token: string,
    sign: string,
    documento: string
  ): Promise<any> {
    return this.getPersonaService.getPersona(cuit, token, sign, documento);
  }
}
