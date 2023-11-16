import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import {
  OneInchErrorDto,
  OneInchGetAllowanceDto,
  OneInchSwapTxDto,
  OneInchTxDto,
} from '../dto/1inch.dto';
import { CryptoConfig } from '../crypto.config';
import Decimal from 'decimal.js';

/**
 * Service 1inch
 * Docs: https://portal.1inch.dev/documentation
 */
@Injectable()
export class OneInchService {
  constructor(
    private readonly config: CryptoConfig,
    private readonly httpService: HttpService,
  ) {}

  /**
   * Send request to 1inch API
   * @param method
   * @param chainId
   * @param query
   * @returns
   */
  private async request<T>(
    method: string,
    chainId: number,
    query: Record<string, string>,
  ) {
    const apiBaseUrl = `https://api.1inch.dev/swap/v5.2/${chainId}`;
    const url = `${apiBaseUrl}${method}?${new URLSearchParams(
      query,
    ).toString()}`;

    const { data } = await firstValueFrom(
      this.httpService
        .get<T>(url, {
          headers: {
            Authorization: `Bearer ${this.config.ONEINCH_API_KEY}`,
            Accept: 'application/json',
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            Logger.error(error.response?.data || error.message);
            const oneInchError: OneInchErrorDto = error.response
              ?.data as OneInchErrorDto;
            throw new BadRequestException(
              oneInchError?.description || '1inch API error',
            );
          }),
        ),
    );

    return data;
  }

  /**
   * Get token allowance
   * @param chainId
   * @param tokenAddress
   * @param walletAddress
   * @returns
   */
  async getTokenAllowance(
    chainId: number,
    tokenAddress: string,
    walletAddress: string,
  ): Promise<OneInchGetAllowanceDto> {
    const tx: OneInchGetAllowanceDto = await this.request(
      '/approve/allowance',
      chainId,
      { tokenAddress, walletAddress },
    );
    return tx;
  }

  /**
   * Set token allowance
   * @param chainId
   * @param tokenAddress
   * @param {Decimal} amount
   * @returns
   */
  async setTokenAllowance(
    chainId: number,
    tokenAddress: string,
    amount: Decimal,
  ): Promise<OneInchTxDto> {
    const tx: OneInchTxDto = await this.request(
      '/approve/transaction',
      chainId,
      { tokenAddress, amount: amount.toString() },
    );
    return tx;
  }

  /**
   * Swap tokens
   * @param chainId
   * @param src
   * @param dst
   * @param from
   * @param {Decimal} amount
   * @param {Decimal} slippage
   * @returns
   */
  async swap(
    chainId: number,
    src: string,
    dst: string,
    from: string,
    amount: Decimal,
    slippage: Decimal,
  ): Promise<OneInchSwapTxDto> {
    const tx: OneInchSwapTxDto = await this.request('/swap', chainId, {
      src,
      dst,
      from,
      amount: amount.toString(),
      slippage: slippage.toString(),
    });
    return tx;
  }
}
