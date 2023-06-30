export interface DataEncrypter {
  checkIfMatch(item: any, encryptedData: any): boolean | Promise<boolean>;
  encrypt(item: any): Promise<string>;
}
