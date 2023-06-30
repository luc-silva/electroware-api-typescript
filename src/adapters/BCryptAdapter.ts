import { DataEncrypter } from "./DataEncrypterAdapter";
import * as bcrypt from "bcryptjs";

class BCryptAdapter implements DataEncrypter {
  async checkIfMatch(item: string, encryptedData: string): Promise<boolean> {
    return await bcrypt.compare(item, encryptedData).then((bool) => bool);
  }

  async encrypt(item: string): Promise<string> {
    return await bcrypt.hash(item, await this.salt());
  }

  private async salt(): Promise<string> {
    return await bcrypt.genSalt(10);
  }
}

export default new BCryptAdapter();
