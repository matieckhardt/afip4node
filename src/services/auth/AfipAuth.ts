import * as forge from "node-forge";
import * as soap from "soap";
import fs from "fs";
import path from "path";
import * as xml2js from "xml2js";

class AfipAuth {
  private wsaaWSDL: string;
  private wsaaUrl: string;
  private serviceCertificates: Map<
    string,
    { certificate: string; privateKey: string }
  >;

  constructor(privateKeyPath: string, certPath: string, production: boolean) {
    this.wsaaWSDL = path.resolve(__dirname, "../certs/wsaa.wsdl");
    this.wsaaUrl = production
      ? "https://wsaa.afip.gov.ar/ws/services/LoginCms"
      : "https://wsaahomo.afip.gov.ar/ws/services/LoginCms";
    this.serviceCertificates = new Map();
    this.loadServiceCertificates(privateKeyPath, certPath);
  }

  private loadServiceCertificates(
    privateKeyPath: string,
    certPath: string
  ): void {
    // Load and store certificates for different services here
    // For example, if you have different certificates for each service, load them accordingly
    // For simplicity, this example assumes the same certificate for all services, modify as needed
    const certificate = fs.readFileSync(path.resolve(certPath), "utf8");
    const privateKey = fs.readFileSync(path.resolve(privateKeyPath), "utf8");
    this.serviceCertificates.set("defaultService", { certificate, privateKey });
    // Add more services as needed
  }

  async getAuthToken(
    cuit: string,
    service: string
  ): Promise<{ token: string; sign: string }> {
    const taFileName = `TA-${service}-${cuit}.json`;
    const taPath = path.resolve(__dirname, `../certs/${taFileName}`);
    const existingTA = this.readTA(taPath);

    if (existingTA && this.isTAValid(existingTA)) {
      return existingTA;
    }

    try {
      const { certificate, privateKey } =
        this.serviceCertificates.get(service) ||
        this.serviceCertificates.get("defaultService");
      const tra = this.createTRA(service);
      const signedTRA = this.signTRA(tra, privateKey, certificate);
      const newTA = await this.sendTRA(signedTRA);
      this.saveTA(newTA, taPath);
      return newTA;
    } catch (error) {
      console.error("Error al obtener el token de autenticación:", error);
      throw error;
    }
  }

  private saveTA(
    ta: { token: string; sign: string; expirationTime: string },
    taPath: string
  ): void {
    fs.writeFileSync(taPath, JSON.stringify(ta, null, 2));
  }

  private readTA(
    taPath: string
  ): { token: string; sign: string; expirationTime: string } | null {
    try {
      if (fs.existsSync(taPath)) {
        const taData = fs.readFileSync(taPath, "utf8");
        return JSON.parse(taData);
      }
      return null;
    } catch (error) {
      console.error("Error al leer el TA:", error);
      return null;
    }
  }

  private isTAValid(ta: {
    token: string;
    sign: string;
    expirationTime: string;
  }): boolean {
    const now = new Date();
    const expirationTime = new Date(ta.expirationTime);
    return now < expirationTime;
  }
  private createTRA(service: string): string {
    const date = new Date();
    const generationTime = new Date(date.getTime() - 600000).toISOString();
    const expirationTime = new Date(date.getTime() + 600000).toISOString();
    const uniqueId = Math.floor(date.getTime() / 1000);

    const tra = `
            <loginTicketRequest version="1.0">
                <header>
                    <uniqueId>${uniqueId}</uniqueId>
                    <generationTime>${generationTime}</generationTime>
                    <expirationTime>${expirationTime}</expirationTime>
                </header>
                <service>${service}</service>
            </loginTicketRequest>
        `.trim();

    return tra;
  }

  private signTRA(tra: string): string {
    const pki = forge.pki;
    const md = forge.md.sha1.create();
    md.update(tra, "utf8");

    const key = pki.privateKeyFromPem(this.privateKey);
    const cert = pki.certificateFromPem(this.certificate);
    const p7 = forge.pkcs7.createSignedData();
    p7.content = forge.util.createBuffer(tra, "utf8");
    p7.addCertificate(cert);
    p7.addSigner({
      key: key,
      certificate: cert,
      digestAlgorithm: forge.pki.oids.sha1,
      authenticatedAttributes: [
        {
          type: forge.pki.oids.contentType,
          value: forge.pki.oids.data,
        },
        {
          type: forge.pki.oids.messageDigest,
          // The value will be automatically filled with the hash of the content (TRA)
        },
        {
          type: forge.pki.oids.signingTime,
          // The value will be automatically filled with the current date/time
        },
      ],
    });
    p7.sign();
    const asn1 = forge.asn1.toDer(p7.toAsn1()).getBytes();

    // Encode the ASN.1 structure as Base64
    const base64Cms = forge.util.encode64(asn1);

    return base64Cms;
  }

  private async sendTRA(
    signedTRA: string
  ): Promise<{ token: string; sign: string; expirationTime: string }> {
    const soapClient = await soap.createClientAsync(this.wsaaWSDL, {
      endpoint: this.wsaaUrl,
    });
    const result = await soapClient.loginCmsAsync({ in0: signedTRA });

    // La respuesta viene en 'result[0].loginCmsReturn', y es una cadena XML
    const responseXml = result[0].loginCmsReturn;

    // Desencapsular y analizar la cadena XML
    const parsedResponse = await xml2js.parseStringPromise(responseXml);
    const loginTicketResponse = parsedResponse.loginTicketResponse;

    // Extraer 'token', 'sign' y 'expirationTime'
    const token = loginTicketResponse.credentials[0].token[0];
    const sign = loginTicketResponse.credentials[0].sign[0];
    const expirationTime = loginTicketResponse.header[0].expirationTime[0];

    return { token, sign, expirationTime };
  }
}

export { AfipAuth };
