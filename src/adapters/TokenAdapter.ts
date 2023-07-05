export interface TokenGenerator {
  generateToken(str: any): string;
  read(item: any): DecodeToken;
}
