import { Injectable } from '@nestjs/common';
import { SiweMessage } from 'siwe';

/**
 * Сервис Sign In With Ethereum (SIWE) - авторизация через подпись сообщения
 * Спецификация: https://eips.ethereum.org/EIPS/eip-4361
 */
@Injectable()
export class SiweService {
  async checkSign(
    message: string,
    signature: string,
    nonce: string,
  ): Promise<SiweMessage> {
    const SIWEObject = new SiweMessage(message);
    const { data } = await SIWEObject.verify({ signature, nonce });
    return data;
  }
}
